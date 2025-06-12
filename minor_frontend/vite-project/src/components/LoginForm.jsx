// src/pages/LoginPage.jsx
import React, { useState } from "react";

const LoginPage = () => {
  const [emailOrContact, setEmailOrContact] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = () => {
    if (!emailOrContact || !password || !role) {
      alert("Please fill in all fields!");
      return;
    }

    // Here you'd normally call your backend API for authentication
    localStorage.setItem("userRole", role);
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-[90%] max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Slum Detection Portal
        </h1>

        <label className="block text-sm font-medium mb-1">
          Email or Contact No.
        </label>
        <input
          type="text"
          placeholder="Enter your email or contact"
          value={emailOrContact}
          onChange={(e) => setEmailOrContact(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block text-sm font-medium mb-2">Select Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="">-- Choose --</option>
          <option value="user">User</option>
          <option value="admin">Administrator</option>
          <option value="ngo">NGO</option>
        </select>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
