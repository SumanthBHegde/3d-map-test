import React, { useState, useMemo } from "react";
import "./App.css";
import States from "./data.json";
import { Map } from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";

// Access the MAPBOX_ACCESS_TOKEN environment variable
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  latitude: 12.977439,
  longitude: 77.570839,
  zoom: 3,
  bearing: 0,
  pitch: 30,
};

function App() {
  const [guessedStates, setGuessedStates] = useState([]); // To store correctly guessed states
  const [currentGuess, setCurrentGuess] = useState(""); // To store user's current input

  // Handle user input change
  const handleInputChange = (e) => {
    setCurrentGuess(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedGuess = currentGuess.trim().toLowerCase();
    const matchedState = States.features.find(
      (state) => state.properties.st_nm.toLowerCase() === normalizedGuess
    );

    if (matchedState) {
      const stateName = matchedState.properties.st_nm;
      if (!guessedStates.includes(stateName)) {
        // Use functional update to ensure state is updated correctly
        setGuessedStates((prevGuessedStates) => [
          ...prevGuessedStates,
          stateName,
        ]);

        alert(`Correct! ${stateName} is added.`);
      } else {
        alert(`You already guessed ${stateName}.`);
      }
    } else {
      alert("Incorrect guess. Please try again!");
    }

    setCurrentGuess("");
  };

  // Handle map click
  const onClick = (info) => {
    if (info.object) {
      const stateName = info.object.properties.st_nm;

      if (guessedStates.includes(stateName)) {
        alert(`You've guessed: ${stateName}`);
      } else {
        alert("Not conquered yet!");
      }
    }
  };

  // Define the GeoJsonLayer with dynamic fill colors based on guessed states
  const layers = useMemo(() => {
    return [
      new GeoJsonLayer({
        id: "States",
        data: States,
        filled: true,
        pointRadiusMinPixels: 5,
        pointRadiusScale: 2000,
        getFillColor: (feature) => {
          const stateName = feature.properties.st_nm;

          if (guessedStates.includes(stateName)) {
            return [255, 69, 0, 200]; // Red-orange color for guessed states
          } else {
            return [0, 0, 0, 0]; // Transparent for unguessed states
          }
        },
        pickable: true,
        autoHighlight: true,
        onClick,
      }),
    ];
  }, [guessedStates]);

  return (
    // Main container with flex row layout
    <div className="app-container">
      {/* Left section with the form */}
      <div className="form-section">
        <form onSubmit={handleSubmit} className="guess-form">
          <input
            type="text"
            value={currentGuess}
            onChange={handleInputChange}
            placeholder="Enter the name of a state"
            required
            className="guess-input"
          />
          <button type="submit" className="guess-button">
            Guess
          </button>
        </form>

        {/* Display Guessed States */}
        <div className="guessed-states">
          <h3>Guessed States:</h3>
          <ul>
            {guessedStates.map((state, index) => (
              <li key={index}>{state}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <DeckGL
          key={guessedStates.join(",")}
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
          style={{ width: "100%", height: "100%" }}
        >
          <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
        </DeckGL>
      </div>
    </div>
  );
}

export default App;
