import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiURL = "https://api.openweathermap.org/data/2.5/forecast/daily?q=London&units=metric&cnt=7&appid=69084501b8a41087da148556d2a1b461";
      try {
        const response = await fetch(apiURL);
        const data = await response.json();
        setDailyData(data.list);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  function getDayOfWeek(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }


  return (
    <div>
      {dailyData.map((day, index) => (
        <div key={index}>
          <h3>{getDayOfWeek(day.dt)}</h3>
          <p>Temperature: {day.temp.day}°C</p>
          <img src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`} alt={day.weather[0].description} />
        </div>
      ))}
    </div>
  );
};

export default WeatherApp;
