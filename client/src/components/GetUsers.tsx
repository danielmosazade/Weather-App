import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get<User[]>(`${API_BASE_URL}/api/users/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setUsers(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>כל המשתמשים</h1>
      <table>
        <thead>
          <tr>
            <th>שם</th>
            <th>אימייל</th>
            <th>תפקיד</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
