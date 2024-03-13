import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
    const [city, setCity] = useState('');
    const z = 0;
    const x = 0;
    const y = 0;
    const [weatherData, setWeatherData] = useState(null);
    const [weatherMap, setWeatherMap] = useState(null); 
    const [weatherDisplay, setWeeklyWeather] = useState('');
    const [weatherDisplay2, setTodaysWeather] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=69084501b8a41087da148556d2a1b461`
);
            setWeatherData(response.data);
            console.log(response.data); //You can see all the weather data in console log
        }   catch (error) {
            console.error(error);
        }
        try {
            const reply = await axios.get(
            `https://tile.openweathermap.org/map/temp_new/${z}/${x}/${y}.png?appid=69084501b8a41087da148556d2a1b461`
            );
            fetch(`https://tile.openweathermap.org/map/temp_new/${z}/${x}/${y}.png?appid=69084501b8a41087da148556d2a1b461`)
            .then(reply => {return reply.blob()})
            .then(blob => {
                var img = URL.createObjectURL(blob);
                console.log(img)
                setWeatherMap(img);
            })
            console.log(reply.data); //You can see all the weather data in console log
            } catch (error) {
            console.error(error);
            }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

  const todaysWeather = () => {
        setTodaysWeather(<p>Today's Weather Will Be Here</p>);
        setWeeklyWeather();
    }

    const weeklyWeather = () => {
            setWeeklyWeather(
            <div class = 'weather-box'>
                <p>Day -1</p>
                <p>Today</p>
                <p>Day +1</p>
                <p>Day +2</p>
                <p>Day +3</p>
                <p>Day +4</p>
                <p>Day +5</p>
            </div>
            );
            setTodaysWeather();
    }

return (
    <div className='appdesign'>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={handleInputChange}
            />
            <button id='button' type="submit">Get Weather</button>
        </form>
        {weatherData ? (
        <>
        <div className = 'page-grid'>
            <div className='flex-container'>
                <div id='title'><p>{weatherData.name}</p></div>
                <div><p>Day</p></div>
                <div><p>{weatherData.main.temp}°C</p></div>
            </div>

            <div className = 'weather-box'>
                    <button type = "button" id = 'weather-choice' onClick={todaysWeather}>Today's Weather</button>
                    <button type = "button" id = 'weather-choice2' onClick={weeklyWeather}>Weekly Weather</button>
                    <p>{weatherDisplay}</p>
                    <p>{weatherDisplay2}</p>
            </div>

            <div className = 'activity-desc'>
                <p>Description: {weatherData.weather[0].description}</p>
                <p>Feels like : {weatherData.main.feels_like}°C</p>
                <p>Humidity : {weatherData.main.humidity}%</p>
                <p>Pressure : {weatherData.main.pressure}</p>
                <p>Wind Speed : {weatherData.wind.speed}m/s</p>
            </div>
            <div>
                <img id = "weather-map" src = {weatherMap} alt='map'></img>
            </div>
        </div>
    </>
    ) : (
        <p>Enter your city to load weather data...</p>
    )}
    </div>
);
};
export default Weather;
