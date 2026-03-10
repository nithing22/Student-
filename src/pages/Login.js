import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [username, setUsername] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username) return;

    login(username);
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 to-indigo-300">

      <div className="bg-white p-8 rounded-xl shadow-lg w-80">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Student Dashboard Login
        </h2>

        <input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <button
          onClick={handleLogin}
          className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700"
        >
          Login
        </button>

      </div>

    </div>
  );
}