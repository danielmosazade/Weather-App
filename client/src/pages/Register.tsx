import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Box, Button, TextField, Typography } from "@mui/material";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      setMessage("🎉 נרשמת בהצלחה!");
    } catch (err) {
      console.error(err);
      setMessage("❌ שגיאה בהרשמה");
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
          </Typography>{" "}
          <form onSubmit={handleSubmit}>
            <TextField
              label="שם משתמש"
              type="שם משתמש"
              value={username}
              required
              fullWidth
              margin="normal"
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="אימייל"
              type="אימייל"
              value={email}
              required
              fullWidth
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="סיסמה"
              type="סיסמה"
              value={password}
              required
              fullWidth
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              הרשמה
            </Button>{" "}
          </form>
          {message && (
            <Typography sx={{ mt: 2 }} color="error">
              {message}
            </Typography>
          )}{" "}
        </Box>
      </Box>
    </>
  );
}

export default Register;
