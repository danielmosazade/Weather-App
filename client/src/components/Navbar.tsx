import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useMediaQuery,
  TextField,
  Autocomplete,
  ListItemIcon,
  Divider,
  Snackbar,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCity } from "./CityContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const pages = [
  { label: "מידע נוסף", path: "/more-info" },
  { label: "הרשמה", path: "/register" },
  { label: "כניסה", path: "/login" },
];

const cities = [
  "תל אביב",
  "ירושלים",
  "חיפה",
  "באר שבע",
  "ראשון לציון",
  "פתח תקווה",
  "נתניה",
  "אשדוד",
  "אשקלון",
  "אילת",
  "רחובות",
  "טבריה",
  "נהריה",
  "רמת גן",
  "הרצליה",
  "כפר סבא",
  "רעננה",
  "חדרה",
  "נוף הגליל",
  "בית שאן",
];

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { city, setCity, username, isAdmin, setUsername, setIsAdmin } =
    useCity();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isMobile = useMediaQuery("(max-width:768px)");
  const [openToast, setOpenToast] = useState(false);
  const [openLogoutToast, setOpenLogoutToast] = useState(false);

  const handleLogout = () => setOpenToast(true);
  const handleClose = () => setOpenToast(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const confirmLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      setUsername("");
      setIsAdmin(false);
    
      localStorage.removeItem("token");
      setOpenToast(false);
      setOpenLogoutToast(true);
      setTimeout(() => navigate("/"), 1000);
      toast("המשתמש התנתק בהצלחה",{
        position:"top-center"
      })
    } catch (err) {
         toast("המשתמש לא התנתק ",{
        position:"top-center"
      })
    }
  };

  const drawerContent = (
    <Box
      sx={{ width: 250, padding: 2 }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
    >
      <List>
        {pages.map(({ label, path }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton component={Link} to={path}>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}

        {isHome && isMobile && (
          <>
            <Divider sx={{ marginY: 1 }} />
            <Autocomplete
              freeSolo
              options={cities}
              value={city}
              onInputChange={(event, newValue) => setCity(newValue)}
              sx={{ backgroundColor: "#fff", borderRadius: 1, width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="בחר או הקלד עיר"
                  size="small"
                  variant="outlined"
                />
              )}
            />
          </>
        )}

        {username && (
          <>
            <Divider sx={{ marginY: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: "red" }} />
                </ListItemIcon>
                <ListItemText primary="התנתק" sx={{ color: "red" }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#355c7d",
          color: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* צד ימין */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate("/")}
              size="large"
            >
              <HomeIcon />
            </IconButton>

            {isAdmin && !isMobile && (
              <IconButton
                color="inherit"
                onClick={() => navigate("/admin-page")}
                size="large"
              >
                <SupervisorAccountIcon />
              </IconButton>
            )}
          </Box>

          {/* כותרת במרכז */}
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            מזגן הטבע
          </Typography>

          {/* צד שמאל */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isMobile && isHome && (
              <Autocomplete
                freeSolo
                options={cities}
                value={city}
                onInputChange={(e, newValue) => setCity(newValue)}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  width: 160,
                  direction: "rtl",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="בחר או הקלד עיר"
                    size="small"
                    variant="outlined"
                  />
                )}
              />
            )}

            {!isMobile && username && (
              <Typography sx={{ marginLeft: 1 }}>שלום {username}</Typography>
            )}

            {/* כפתור פתיחת Drawer */}
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawerContent}
      </Drawer>

      <Snackbar
        open={openToast}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message="אתה בטוח שאתה רוצה להתנתק?"
        action={
          <>
            <Button color="error" size="small" onClick={confirmLogout}>
              כן
            </Button>
            <Button color="inherit" size="small" onClick={handleClose}>
              לא
            </Button>
          </>
        }
      />
    </>
  );
};

export default Navbar;
