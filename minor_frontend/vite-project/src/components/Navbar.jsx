import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLoginClick, language, setLanguage }) => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link to="/">Slum Detection Portal</Link>
      </div>

      <div className="flex items-center gap-4">
        <a href="#about" className="hover:underline">
          {language === "en" ? "About" : "परियोजना के बारे में"}
        </a>

        {/* Removed Dashboard and State Selection */}

        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Twitter
        </a>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 text-white rounded px-2 py-1"
        >
          <option value="en">EN</option>
          <option value="hi">हिंदी</option>
        </select>

        <button
          onClick={onLoginClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {language === "en" ? "Login" : "लॉगिन"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
