import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

  const API_BASE_URL = process.env.REACT_APP_API_URL;

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ username: "", email: "" });

const fetchUsers = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/users`, {
      withCredentials: true
    });
    setUsers(res.data);
  } catch (err) {
    console.error(err);
    toast.error("Access Denied – כנראה אתה לא אדמין", { position: "top-center" });
  } finally {
    setLoading(false);
  }
};


  const deleteUser = async (id: string) => {
    if (!window.confirm("אתה בטוח שברצונך למחוק את המשתמש הזה?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/auth/users/${id}`, { withCredentials: true });
      setUsers(users.filter((u) => u._id !== id));
      toast.success("המשתמש נמחק בהצלחה", {
        position: "top-center",
        autoClose: 3000,
        style: { textAlign: "center" },
      });
    } catch (err) {
      console.error(err);
      toast.error("שגיאה במחיקת המשתמש", { position: "top-center" });
    }
  };

  const toggleAdminRole = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await axios.put(
        `${API_BASE_URL}/api/auth/users/${user._id}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      toast.success(`התפקיד עודכן ל${newRole === "admin" ? "אדמין" : "משתמש"}`, {
        position: "top-center",
        autoClose: 3000,
        style: { textAlign: "center" },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בעדכון התפקיד", { position: "top-center" });
    }
  };

  const openUpdateDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({ username: user.username, email: user.email });
    setOpenDialog(true);
  };
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    if (!formData.username.trim()) {
      toast.error("שם משתמש חדש הוא חובה", { position: "top-center" });
      return;
    }
    console.log(formData);

    try {
      await axios.put(
        `${API_BASE_URL}/api/auth/users/${selectedUser._id}`,
        { newUsername: formData.username },
        {
          withCredentials: true,
        }
      );

      toast.success("המשתמש עודכן בהצלחה", { position: "top-center" });
      fetchUsers();
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בעדכון המשתמש", { position: "top-center" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />
      <Box p={3} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" mb={2} fontWeight="bold" textAlign="center">
          ניהול משתמשים
        </Typography>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3, maxWidth: 800 }}
        >
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold", p: 1 }}>
                  שם משתמש
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold", p: 1 }}>
                  אימייל
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold", p: 1 }}>
                  תפקיד
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontWeight: "bold", p: 1 }}
                  align="center"
                >
                  פעולות
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell sx={{ p: 1 }}>{user.username}</TableCell>
                  <TableCell sx={{ p: 1 }}>{user.email}</TableCell>
                  <TableCell sx={{ p: 1 }}>{user.role}</TableCell>
                  <TableCell sx={{ p: 1 }} align="center">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => toggleAdminRole(user)}
                    >
                      <AdminPanelSettingsIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openUpdateDialog(user)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteUser(user._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    אין משתמשים להצגה
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog לעדכון משתמש */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>עדכון משתמש</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="שם משתמש"
              fullWidth
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="אימייל"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>ביטול</Button>
            <Button
              onClick={handleUpdateUser}
              variant="contained"
              color="primary"
            >
              שמור
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminPage;
