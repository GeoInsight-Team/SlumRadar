import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import slum1 from "../assets/slum1.jpg";
import slum2 from "../assets/slum2.jpg";
import slum3 from "../assets/slum3.jpg";

const Home = () => {
  const [language, setLanguage] = useState("en");
  const [imageIndex, setImageIndex] = useState(0);
  const images = [slum1, slum2, slum3];

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const aboutContent = {
    en: [
      {
        title: "Detect Slums",
        desc: "Uses ML to identify emerging slums from satellite data.",
      },
      {
        title: "Predict Health Risks",
        desc: "Forecasts disease risks in underdeveloped areas.",
      },
      {
        title: "Guide NGOs & Governments",
        desc: "Provides insights to aid urban planning.",
      },
    ],
    hi: [
      {
        title: "स्लम की पहचान",
        desc: "उभरते हुए स्लम क्षेत्रों की पहचान एमएल से करता है।",
      },
      {
        title: "स्वास्थ्य जोखिम",
        desc: "बीमारियों के जोखिम की भविष्यवाणी करता है।",
      },
      {
        title: "सरकारी मार्गदर्शन",
        desc: "एनजीओ और सरकार को डेटा आधारित सलाह देता है।",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar language={language} setLanguage={setLanguage} />

      {/* Slideshow */}
      <div
        className="h-screen w-full bg-cover bg-center flex items-center justify-center transition-all duration-1000"
        style={{ backgroundImage: `url(${images[imageIndex]})` }}
      >
        <div className="bg-black/60 p-10 rounded-xl text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the Slum Detection Portal
          </h1>
          <p className="text-lg">
            {language === "en"
              ? "Helping Governments & NGOs detect, plan, and act."
              : "सरकार और एनजीओ की सहायता एक बेहतर भविष्य के लिए।"}
          </p>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-16 px-4 bg-white text-black">
        <h2 className="text-3xl font-bold text-center mb-10">
          {language === "en" ? "About the Project" : "परियोजना के बारे में"}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {aboutContent[language].map((item, i) => (
            <div
              key={i}
              className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
