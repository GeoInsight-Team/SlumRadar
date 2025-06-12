// src/pages/StateSelectionPage.jsx
import React, { useState } from "react";

const StateSelectionPage = () => {
  const [state, setState] = useState("");
  const [place, setPlace] = useState("");
  const [smallPlace, setSmallPlace] = useState("");
  const [status, setStatus] = useState("");
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Sample data (replace with real data from API/backend later)
  const states = ["Odisha", "Bihar", "Karnataka"];
  const knownPlaces = {
    Odisha: ["Bhubaneswar", "Cuttack"],
    Bihar: ["Patna", "Gaya"],
    Karnataka: ["Bangalore", "Mysore"],
  };
  const smallPlaces = {
    Bhubaneswar: ["Saheed Nagar", "Patia"],
    Cuttack: ["Jobra", "Badambadi"],
    Patna: ["Kankarbagh", "Boring Road"],
    Gaya: ["Delha", "Tekari"],
    Bangalore: ["Indiranagar", "Whitefield"],
    Mysore: ["Chamundi", "VV Mohalla"],
  };

  const handleShowDetails = () => {
    setStatus("Underdeveloped"); // You can make this dynamic from backend
    setDetailsVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Select Your Location
        </h2>

        <div className="mb-4">
          <label className="block mb-1">State</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setPlace("");
              setSmallPlace("");
              setDetailsVisible(false);
            }}
          >
            <option value="">-- Select State --</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {state && (
          <div className="mb-4">
            <label className="block mb-1">Known Place</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={place}
              onChange={(e) => {
                setPlace(e.target.value);
                setSmallPlace("");
                setDetailsVisible(false);
              }}
            >
              <option value="">-- Select Place --</option>
              {knownPlaces[state]?.map((pl) => (
                <option key={pl} value={pl}>
                  {pl}
                </option>
              ))}
            </select>
          </div>
        )}

        {place && (
          <div className="mb-4">
            <label className="block mb-1">Smaller Place</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={smallPlace}
              onChange={(e) => setSmallPlace(e.target.value)}
            >
              <option value="">-- Select Smaller Place --</option>
              {smallPlaces[place]?.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>
        )}

        {smallPlace && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            onClick={handleShowDetails}
          >
            Show Details
          </button>
        )}

        {detailsVisible && (
          <div className="mt-6">
            <p className="text-lg font-semibold">
              Development Status: <span className="text-red-500">{status}</span>
            </p>
            <div className="mt-3 bg-gray-100 p-4 rounded">
              <p>🏫 Schools: 2</p>
              <p>🏥 Hospitals: 1</p>
              <p>🚽 Toilets: 0</p>
              <p>🚰 Water Sources: 1</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateSelectionPage;
