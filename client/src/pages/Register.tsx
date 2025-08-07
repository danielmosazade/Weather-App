import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('api/auth/register', {
        username,
        email,
        password,
      });
      setMessage('🎉 נרשמת בהצלחה!');
    } catch (err) {
      console.error(err);
      setMessage('❌ שגיאה בהרשמה');
    }
  };

  return (
    <>
    <Navbar/>
    <div style={{ padding: 20 }}>
      <h2>הרשמה</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="שם משתמש"
          value={username}
          onChange={e => setUsername(e.target.value)}
        /><br />
        <input
          placeholder="אימייל"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br />
        <input
          placeholder="סיסמה"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
        <button type="submit">הרשמה</button>
      </form>
      <p>{message}</p>
    </div>
    </>
  );
}

export default Register;

