import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/mumbai-bg.webp";

const Dashboard = () => {
  const [cityName, setCityName] = useState("");
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();

  const dummyData = {
    kolkata: [
      {
        city_name: "Kolkata",
        area: "North Kolkata",
        hospitals: 1,
        clinics: 2,
        schools: 3,
        toilets: 10,
        health_risk: "High",
        future_prediction: { 2030: "3.25" },
      },
      {
        city_name: "Kolkata",
        area: "South Kolkata",
        hospitals: 3,
        clinics: 5,
        schools: 7,
        toilets: 20,
        health_risk: "Moderate",
        future_prediction: { 2030: "2.10" },
      },
      {
        city_name: "Kolkata",
        area: "Salt Lake",
        hospitals: 5,
        clinics: 10,
        schools: 12,
        toilets: 30,
        health_risk: "Low",
        future_prediction: { 2030: "1.05" },
      },
    ],
  };

  const getStatus = (area) => {
    const total = area.hospitals + area.clinics + area.schools + area.toilets;
    if (total > 250) return "Developed";
    if (total > 150) return "Semi-developed";
    return "Underdeveloped";
  };

  const fetchAreaData = async (city) => {
    try {
      const response = await fetch(`http://localhost:5000/test/${city}`);
      const data = await response.json();
      if (data && data.success && data.data.length > 0) {
        return data.data;
      } else {
        const lowerCity = city.toLowerCase();
        return dummyData[lowerCity] || [];
      }
    } catch {
      console.warn("Using dummy data due to fetch error.");
      const lowerCity = city.toLowerCase();
      return dummyData[lowerCity] || [];
    }
  };

  const handleSearch = async () => {
    if (!cityName.trim()) return;
    const result = await fetchAreaData(cityName.trim());
    setAreas(result);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

      {/* Main content */}
      <div className="relative z-10 p-6">
        <div className="bg-white bg-opacity-90 rounded-xl max-w-5xl mx-auto p-6 shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            🏙 Slum Detection Dashboard
          </h1>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <input
              type="text"
              placeholder="🔍 Enter City Name (e.g., Kolkata)"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              className="p-2 border border-gray-400 rounded w-full sm:w-1/2"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>

          {/* Area Cards or Fallback */}
          {areas.length > 0 ? (
            <>
              {areas.map((area, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-6 mb-6 border border-blue-100"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold text-blue-700">
                      📍 {area.area}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        getStatus(area) === "Developed"
                          ? "bg-green-100 text-green-700"
                          : getStatus(area) === "Semi-developed"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      🏷 {getStatus(area)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <p>
                      <strong>City:</strong> {area.city_name}
                    </p>
                    <p>
                      <strong>Hospitals:</strong> {area.hospitals}
                    </p>
                    <p>
                      <strong>Clinics:</strong> {area.clinics}
                    </p>
                    <p>
                      <strong>Schools:</strong> {area.schools}
                    </p>
                    <p>
                      <strong>Toilets:</strong> {area.toilets}
                    </p>
                    <p>
                      <strong>Health Risk:</strong>{" "}
                      <span
                        className={
                          area.health_risk === "High"
                            ? "text-red-600 font-semibold"
                            : area.health_risk === "Moderate"
                            ? "text-yellow-600 font-semibold"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {area.health_risk}
                      </span>
                    </p>
                    <p>
                      <strong>Slum Growth Prediction (2030):</strong>{" "}
                      {area.future_prediction?.["2030"]}%
                    </p>
                  </div>
                </div>
              ))}

              {/* Donate Button - always shown below results */}
              <div className="text-center mt-8">
                <button
                  onClick={() => navigate("/donate")}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
                >
                  ❤ Donate
                </button>
              </div>
            </>
          ) : (
            // No data fallback with Donate button
            <div className="text-center mt-8">
              <button
                onClick={() => navigate("/donate")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
              >
                ❤ Donate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;