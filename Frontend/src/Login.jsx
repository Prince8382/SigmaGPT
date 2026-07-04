import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './App.css'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`,  {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      alert(data.error);
    }
  };

   const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/");
  }
}, []);

  return (
    <div className="authContainer">
      <h2>Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
       />

      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} 
        onKeyDown={handleKeyDown}
      />

      <button onClick={handleLogin}>Login</button>

      <p onClick={() => navigate("/register")}
        style={{ cursor: "pointer" }}
      >
        Create new account
      </p>
    </div>
  );
}

export default Login;