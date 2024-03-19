function DailyWeather({ weather }) {
  return (
    <div>
      <h2>Day Temperature: {weather.temp.day}°C</h2>
      <p>Min: {weather.temp.min}°C, Max: {weather.temp.max}°C</p>
      <p>Weather: {weather.weather[0].description}</p>
    </div>
  );
}

export default DailyWeather;