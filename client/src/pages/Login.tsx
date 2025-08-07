import React, { useState, FormEvent } from "react";
import Navbar from "../components/Navbar";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },                              
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setMessage("❌ " + errText);
        return;
      }

      const data: { token: string; username: string } = await res.json();
      localStorage.setItem("token", data.token);

      setMessage(`✅ Logged in as ${data.username}`);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Login failed");
    }
  };
  console.log("first")

  return (
    <>
    <Navbar/>
    <div style={{ maxWidth: "300px", margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <button type="submit">Login</button>
      </form>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
    </>
  );
};

export default Login;
