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
import { useCity } from "./CityContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
const pages = [
  { label: "מידע  נוסף ", path: "/more-info" },
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
  const [openToast, SetOpenToast] = useState<boolean>(false);
  const [openlogoutToast, SetOpenLogToast] = useState<boolean>(false);
  const handleLogout = () => {
    SetOpenToast(true);
  };
  const handleClick = () => SetOpenToast(true);
  const handleClose = () => SetOpenToast(false);
  const confirmLogout = () => {
    setUsername("");
    setIsAdmin(false);
    localStorage.removeItem("token");
    SetOpenToast(true);
    setTimeout(() => {
      navigate("/");
    }, 1000);
    SetOpenToast(false);
    SetOpenLogToast(true);
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

        <Divider sx={{ marginY: 1 }} />
        {username && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: "red" }} />
              </ListItemIcon>
              <ListItemText primary="התנתק" sx={{ color: "red" }} />
            </ListItemButton>
          </ListItem>
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
          color: "#ffffff",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate("/")}
              aria-label="דף הבית"
              size="large"
            >
              <HomeIcon />
            </IconButton>

            {isAdmin && (
              <IconButton
                color="inherit"
                onClick={() => navigate("/admin-page")}
                aria-label="דף אדמין"
                size="large"
              >
                <SupervisorAccountIcon />
              </IconButton>
            )}
          </Box>

          {/* מרכז - כותרת ממורכזת */}
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            מזגן הטבע
          </Typography>

          {/* צד שמאל */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isHome && (
              <Autocomplete
                freeSolo
                options={cities}
                value={city}
                onInputChange={(event, newValue) => setCity(newValue)}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "4px",
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

            {username &&<Typography>שלום {username}</Typography>}

            {/* כפתור לפתיחת Drawer תמיד */}
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

      {/* Drawer תמיד קיים */}
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
