import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherApp.css';
const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [city, setCity] = useState('Karachi');
  const [country, setCountry] = useState('Pakistan');
  const [bgTheme, setBgTheme] = useState('default');
  const API_KEY = 'cbc39a931965b7e6201c235e74804d90';

  const fetchWeatherData = async (cityName = 'Karachi', countryCode = 'PK') => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      
      // Set background theme based on weather condition
      const weatherMain = response.data.weather[0].main.toLowerCase();
      if (weatherMain.includes('clear')) {
        setBgTheme('sunny');
      } else if (weatherMain.includes('cloud')) {
        setBgTheme('cloudy');
      } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
        setBgTheme('rainy');
      } else if (weatherMain.includes('snow')) {
        setBgTheme('snowy');
      } else {
        setBgTheme('default');
      }
    } catch (err) {
      setError('City not found. Please try again.');
      console.error('Error fetching weather data:', err);
      setBgTheme('default');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData(city, country);
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Background theme classes
  const bgThemes = {
    sunny: 'sunny-bg',
    cloudy: 'cloudy-bg',
    rainy: 'rainy-bg',
    snowy: 'snowy-bg',
    default: 'default-bg'
  };

  if (loading) {
    return (
      <div className={`weather-app ${bgThemes[bgTheme]}`}>
        <div className="loading">Loading weather data...</div>
      </div>
    );
  }

  return (
    <div className={`weather-app ${bgThemes[bgTheme]}`}>
      <div className="weather-container">
        <h1 className="app-title">Weather Forecast</h1>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="city-input"
            />
            <input
              type="text"
              placeholder="Enter country code (e.g., PK)"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="country-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        {weatherData && (
          <div className="weather-card">
            <div className="weather-header">
              <h2 className="city-name">{weatherData.name}, {weatherData.sys.country}</h2>
              <p className="current-date">{formatDate(weatherData.dt)}</p>
            </div>
            
            <div className="weather-main">
              <div className="temperature-section">
                <div className="current-temp">
                  {Math.round(weatherData.main.temp)}°C
                </div>
                <div className="weather-condition">
                  <img 
                    src={getWeatherIcon(weatherData.weather[0].icon)} 
                    alt={weatherData.weather[0].description} 
                    className="weather-icon"
                  />
                  <span>{weatherData.weather[0].main}</span>
                </div>
              </div>
              
              <div className="weather-details">
                <div className="detail-item">
                  <span className="detail-label">Feels Like:</span>
                  <span className="detail-value">{Math.round(weatherData.main.feels_like)}°C</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Humidity:</span>
                  <span className="detail-value">{weatherData.main.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Wind Speed:</span>
                  <span className="detail-value">{weatherData.wind.speed} m/s</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pressure:</span>
                  <span className="detail-value">{weatherData.main.pressure} hPa</span>
                </div>
              </div>
            </div>
            
            <div className="weather-footer">
              <div className="minmax-temp">
                <span>Min: {Math.round(weatherData.main.temp_min)}°C</span>
                <span>Max: {Math.round(weatherData.main.temp_max)}°C</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;