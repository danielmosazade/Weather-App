import React, { useState, FormEvent } from "react";
import Navbar from "../components/Navbar";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCity } from "../components/CityContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const { setUsername, setIsAdmin } = useCity();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(process.env.REACT_APP_SERVER_URL);
    try {
      const res = await fetch(
        `https://mzgn-htb.onrender.com/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include", // שולח את ה-cookie עם הבקשה
        }
      );

      if (!res.ok) {
        toast.error("⚠️נתונים שגואים נסה שוב", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          style: { textAlign: "center" },
        });
        return;
      }

      const data: { username: string; role: string } = await res.json();

      // שמירה ב-context בלבד
      setUsername(data.username);
      setIsAdmin(data.role === "admin");

      toast.success(` שלום ${data.username}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        style: { textAlign: "center" },
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          backgroundImage: `url("https://png.pngtree.com/thumb_back/fh260/background/20230607/pngtree-close-up-image-of-the-rain-on-the-road-image_2913794.jpg")`,
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
            כניסה
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="email">איימיל</InputLabel>
              <OutlinedInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="איימיל"
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="password">סיסמא</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="סיסמא"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              כניסה
            </Button>
          </form>

          {message && (
            <Typography sx={{ mt: 2 }} color="error">
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Login;
