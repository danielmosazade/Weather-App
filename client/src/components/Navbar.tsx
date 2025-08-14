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
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useCity } from "./CityContext";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

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
  const isMobile = useMediaQuery("(max-width:768px)");
  const { city, setCity } = useCity();
  const navigate = useNavigate();
  const { username,isAdmin } = useCity();
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
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
      </List>
    </Box>
  );

  return (
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
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton
          color="inherit"
          onClick={() => navigate("/")}
          aria-label="דף הבית"
          size="large"
        >
          <HomeIcon />
        </IconButton>
        {/* צד ימין - ניווט */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                {drawerContent}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 3 }}>
              <Typography> שלום {username}</Typography>

              {pages.map(({ label, path }) => (
                <Typography
                  key={label}
                  variant="button"
                  component={Link}
                  to={path}
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          )}
        </Box>

        {/* כותרת ממורכזת */}
        <Typography
          variant="h6"
          sx={{
            left: 0,
            right: 0,
            mx: "auto",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          מזגן הטבע
        </Typography>

        {/* צד שמאל - חיפוש וכפתור דף הבית */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Autocomplete
            freeSolo
            options={cities}
            value={city}
            onInputChange={(event, newValue) => {
              setCity(newValue);
            }}
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
