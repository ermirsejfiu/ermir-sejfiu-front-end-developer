import React from "react";
import "../styles/WeatherCard.css";

function WeatherCard({ weather }) {
  return (
    <div className="weather-card">
      <h2>{weather.name}</h2>

      <h3>{Math.round(weather.temperature)}°C</h3>

      <p className="description">{weather.description}</p>

      <div className="details">
        <span>Humidity: {weather.humidity}%</span>
        <span>Wind: {weather.windSpeed} km/h</span>
      </div>
    </div>
  );
}

export default WeatherCard;
