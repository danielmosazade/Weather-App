import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCity } from "../components/CityContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUsername: setGlobalUsername, setIsAdmin } = useCity();

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1️⃣ הרשמה
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      // 2️⃣ התחברות אוטומטית
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // 3️⃣ שמירת המשתמש בקונטקסט
      setGlobalUsername(res.data.username);
      setIsAdmin(res.data.role === "admin");

      // 4️⃣ הודעת הצלחה
      toast.success("🎉 נרשמת והתחברת בהצלחה!", {
        position: "top-center",
        autoClose: 3000,
        style: { textAlign: "center" },
      });

      // 5️⃣ מעבר לעמוד הבית
      navigate("/");

    } catch (err: any) {
      console.error(err);
      toast.error("❌ שגיאה בהרשמה או בהתחברות", {
        position: "top-center",
        autoClose: 3000,
        style: { textAlign: "center" },
      });
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC6s5u4sMBb4Tz9zOpV0t0JfejWgy7XPFyHfqL5ONl32eRb8J9i49Z1fc5_UM70tKYhMU&usqp=CAU")`,
          height: "100vh",
          overflow: "hidden",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 300,
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.85)",
            borderRadius: 2,
            padding: 4,
            boxShadow: 3,
            margin: 3,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            הרשמה
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="שם משתמש"
              value={username}
              required
              fullWidth
              margin="normal"
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="אימייל"
              type="email"
              value={email}
              required
              fullWidth
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="סיסמה"
              type="password"
              value={password}
              required
              fullWidth
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              הרשמה
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default Register;
