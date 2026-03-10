import React, { useState, useEffect } from "react";
import StudentTable from "./components/students/StudentsTable";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedUser");
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = () => {
    if (!username.trim()) return;

    localStorage.setItem("loggedUser", username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="bg-white p-10 rounded-xl shadow-xl w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Student Dashboard Login
          </h1>

          <input
            type="text"
            placeholder="Enter username"
            className="border w-full p-3 rounded mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white p-6">
        <h1 className="text-xl font-bold mb-8">Student Dashboard</h1>

        <ul>
          <li className="mb-4 hover:text-gray-200 cursor-pointer">
            Students
          </li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between">
          <span className="font-semibold">Welcome {user}</span>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        <div className="p-6 overflow-auto">
          <StudentTable user={user} />
        </div>
      </div>
    </div>
  );
}