import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Weather.css';

const WeatherHourly = ({cityVal}) => {
    const[hourDisplay, setHourDisplay] = useState(null);

    async function fetchWeather() {
        //Making API call to set the hourly data
        try {
            const hourResponse = await axios.get(
                `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${cityVal}&units=metric&appid=69084501b8a41087da148556d2a1b461`
            );
            console.log(hourResponse.data);
            
            //Retrieving hourly weather data for the next 8 hours
            const hourlyWeather = hourResponse.data.list.slice(0,24).map(h =>({
                hour: new Date(h.dt * 1000).getHours(),
                iconCode: h.weather[0].icon,
                hTemp: h.main.temp,
            }))
            
            //Storing retieved hourly data
            setHourDisplay(hourlyWeather)

        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => { //API weather data fetched after initial page render
        fetchWeather();
    }, []);

    return (
        //Applying weather display tags to show hourly weather
        <div>
            {hourDisplay && (
            <div className = "todayFlex">
            {hourDisplay.map((h, index) => (
                <div key={index}>
                    <p>{h.hour}:00</p>
                    <img width={100} height={100} src={`http://openweathermap.org/img/wn/${h.iconCode}.png`}></img>
                    <p>{h.hTemp}°C</p>
                </div>
            ))}
            </div>
            )}
        </div>
    )
}
export default WeatherHourly;