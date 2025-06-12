// src/pages/LandingPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import slideshow1 from "../assets/slum1.jpg";
// import slideshow2 from "../assets/slum2.jpg";
// import slideshow3 from "../assets/slum3.jpg";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  const content = {
    en: {
      about: [
        {
          title: "AI-Based Detection",
          desc: "Uses satellite and ML to identify emerging slums",
        },
        {
          title: "Resource Analysis",
          desc: "Detects resource availability for critical planning",
        },
        {
          title: "Health Risk Forecast",
          desc: "Predicts disease outbreaks in vulnerable zones",
        },
      ],
      login: "Login",
      aboutHeader: "About the Project",
      lang: "हिन्दी",
    },
    hi: {
      about: [
        {
          title: "एआई आधारित पहचान",
          desc: "उभरती झुग्गियों की पहचान के लिए सैटेलाइट और ML का उपयोग",
        },
        {
          title: "संसाधन विश्लेषण",
          desc: "महत्वपूर्ण योजना के लिए संसाधनों की उपलब्धता की जांच",
        },
        {
          title: "स्वास्थ्य जोखिम पूर्वानुमान",
          desc: "संवेदनशील क्षेत्रों में रोग फैलने की भविष्यवाणी करता है",
        },
      ],
      login: "लॉगिन",
      aboutHeader: "परियोजना के बारे में",
      lang: "English",
    },
  };

  const currentContent = content[language];

  return (
    <div key={language} className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center fixed top-0 w-full z-50">
        <div className="font-bold text-xl">SlumDetect</div>
        <div className="flex space-x-4">
          <a href="#about" className="hover:text-yellow-300">
            About
          </a>
          <a
            href="https://twitter.com"
            className="hover:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <button
            onClick={toggleLanguage}
            className="bg-gray-800 px-2 py-1 rounded"
          >
            {currentContent.lang}
          </button>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-yellow-400 text-black px-3 py-1 rounded font-semibold"
          >
            {currentContent.login}
          </button>
        </div>
      </nav>

      {/* Slideshow */}
      <div className="relative h-screen pt-16">
        <img
          src={slideshow1}
          alt="Slum"
          className="absolute inset-0 w-full h-full object-cover opacity-100 z-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold px-4 text-center">
            {language === "en"
              ? "Predicting Emerging Slums & Health Risks"
              : "उभरती झुग्गियों और स्वास्थ्य जोखिमों की भविष्यवाणी"}
          </h1>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-white text-center">
        <h2 className="text-3xl font-bold mb-8">
          {currentContent.aboutHeader}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {currentContent.about.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">{currentContent.login}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate("/dashboard");
              }}
            >
              <input
                className="w-full mb-3 p-2 border rounded"
                placeholder="Username"
                required
              />
              <input
                className="w-full mb-3 p-2 border rounded"
                type="password"
                placeholder="Password"
                required
              />
              <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                {currentContent.login}
              </button>
            </form>
            <button
              onClick={() => setShowLogin(false)}
              className="mt-4 text-sm text-gray-500 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;