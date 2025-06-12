import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import slum1 from "../assets/slum1.jpg";
import slum2 from "../assets/slum2.jpg";
import slum3 from "../assets/slum3.jpg";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }
    localStorage.setItem("userRole", "user");
    navigate("/dashboard");
  };

  const images = [slum1, slum2, slum3];
  const [current, setCurrent] = useState(0);

  // Auto slide every 3 sec
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-4 bg-black bg-opacity-40 backdrop-blur-md text-white">
        <div className="text-2xl font-bold">Slum Detect</div>
        <div className="space-x-6 flex items-center">
          <a href="#" className="hover:text-blue-300">
            Home
          </a>
          <a href="#about" className="hover:text-blue-300">
            About
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-300"
          >
            Twitter
          </a>
          <select className="bg-transparent border border-white text-white px-2 py-1 rounded">
            <option>English</option>
            <option>हिन्दी</option>
          </select>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold shadow"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Slideshow */}
      <div className="absolute inset-0 z-0">
        <img
          src={images[current]}
          alt="slideshow"
          className="w-full h-screen object-cover transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* About Section */}
      <section
        id="about"
        className="relative z-10 text-white max-w-4xl mx-auto pt-48 px-6 text-center"
      >
        <h2 className="text-4xl font-bold mb-4 drop-shadow">
          About This Portal
        </h2>
        <p className="text-lg text-white/90 drop-shadow">
          Our Slum Detection system uses satellite data and AI to detect
          underdeveloped areas, predict health risks, and help NGOs &
          governments allocate resources effectively. This platform offers
          real-time updates, analytics, and visual insights for better
          decision-making.
        </p>
      </section>

      {/* Login Form Modal */}
      {showLogin && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-4 text-gray-700 text-xl"
              onClick={() => setShowLogin(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <input
              type="text"
              placeholder="Email or Contact"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-3 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 p-3 border rounded"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
            >
              🔐 Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
