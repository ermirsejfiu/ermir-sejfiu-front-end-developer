import React, { useState } from "react";
import "./App.css";
import WeatherCard from "./components/WeatherCard";

const weatherDescriptions = {
  0: "clear sky",
  1: "mainly clear",
  2: "partly cloudy",
  3: "overcast",
  45: "fog",
  48: "depositing rime fog",
  51: "light drizzle",
  53: "moderate drizzle",
  55: "dense drizzle",
  61: "slight rain",
  63: "moderate rain",
  65: "heavy rain",
  71: "slight snow",
  73: "moderate snow",
  75: "heavy snow",
  80: "slight rain showers",
  81: "moderate rain showers",
  82: "violent rain showers",
  95: "thunderstorm",
  96: "thunderstorm with slight hail",
  99: "thunderstorm with heavy hail",
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    setWeather(null);
    setError("");

    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);

    try {
      const locationResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city.trim()
        )}&count=1&language=en&format=json`
      );
      const locationData = await locationResponse.json();

      if (!locationResponse.ok) {
        setError("Unable to search for that city. Try again.");
        return;
      }

      const location = locationData.results?.[0];

      if (!location) {
        setError("City not found. Try another search.");
        return;
      }

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
      );
      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        setError("Unable to load weather. Try again.");
        return;
      }

      setWeather({
        name: [location.name, location.country].filter(Boolean).join(", "),
        temperature: weatherData.current.temperature_2m,
        description:
          weatherDescriptions[weatherData.current.weather_code] || "current weather",
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: weatherData.current.wind_speed_10m,
      });
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={getWeather} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="message error">{error}</p>}
      {!error && !weather && !loading && (
        <p className="message">Enter a city and click Search to see the weather.</p>
      )}
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
}

export default App;
