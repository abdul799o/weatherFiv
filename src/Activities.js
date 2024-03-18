import React, { useEffect, useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Activities.css';
import Weather from "./Weather"

const Activities = () => {
    const [city, setCity] = useState('London');
    const [weatherData, setWeatherData] = useState(null);
    const currentDay = new Date().toDateString();
    const activity = ["cycling", "hiking", "camping", "clothing"] //Order for the 3 activities and clothing used for recommendations
    const navigate = useNavigate();

    async function fetchData() {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=69084501b8a41087da148556d2a1b461`
            );
            setWeatherData(response.data);
            console.log(response.data); //You can see all the weather data in console log
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => { //API weather data fetched after initial page render
        fetchData();
        //getLocation();
    }, []);

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    //Displays the recommendations for the specific activities based on the weather conditions
    const descriptions = (activity) => {
        //Order of weather conditions is Rain/Drizzle, Snow, Clear, Clouds, Thunderstorm, Fog, Other
        const cyclDesc = ["Roads may be slippery due to rain. Take caution", "Roads may be slippery due to ice. Take caution.", "No issues with slippery roads or visibility", "No major issues with slippery roads or visibility", "High risk activity. Thunderstorm currently taking place.", "Visibility on roads may be affected. Take caution."]
        const hikDesc = ["Some paths may become slippery due to rain.", "Some paths may be unsafe due to ice formations. Take caution.", "Weather ideal for hiking!", "Weather ideal for hiking!", "Thunderstorm currently taking place. Hiking not recommended.", "Visibility on pathways may be affected."]
        const campDesc = ["Prepare shelter to protect from rain.", "Prepare shelter to protect from snow or hail.", "Weather ideal for camping", "Weather ideal for camping", "Shelter required to protect from thunderstorm. Take caution", "No major issues with camping."]
        const clothDesc = ["Coat recommended", "Wear multiple layers to protect from cold and snow.", "Sunglasses recommended", "Coat recommended to prepare for possible rain", "Prepare for heavy rain with waterproof clothing.", "No clothing recommendations."]
        if (activity === "cycling"){
            return cyclDesc[descCategory()]
        }
        else if (activity === "hiking") {
            return hikDesc[descCategory()]
        }
        else if (activity ==="camping"){
            return campDesc[descCategory()]
        }
        else if (activity === "clothing") {
            return clothDesc[descCategory()]
        }
    }
    //Returns an index depending on the current weather conditions which determines which 
    //recommendation to display in the description arrays for the three descriptions and clothing
    const descCategory = () => {
        var descNo = -1
        if (weatherData.weather[0].main === "Rain" || weatherData.weather[0].main === "Drizzle"){
            descNo = 0
        }
        else if (weatherData.weather[0].main === "Snow"){
            descNo = 1
        }
        else if (weatherData.weather[0].main === "Clear"){
            descNo = 2
        }
        else if (weatherData.weather[0].main === "Clouds"){
            descNo = 3
        }
        else if (weatherData.weather[0].main === "Thunderstorm"){
            descNo = 4
        }
        else if (weatherData.weather[0].main === "Fog"){
            descNo = 5
        }
        else {
            descNo = 6
        }
        return descNo
    }

    return (
        <div className='appdesign'> 
            <form onSubmit={handleSubmit}> {/*User inputs location to know information about*/}
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
                {/*Displays the chosen location, current day, and main temperature*/}
                <div className='flex-container'> 
                    <div id='title'><p>{weatherData.name}</p></div>
                    <div><p>{currentDay}</p></div>
                    <div><p>{weatherData.main.temp}°C</p></div>
                    <button onClick={() => navigate('/weather')}>Weather</button>
                </div>
    
                <div id = 'activity-desc'>
                    <h2>Activity Specific</h2>
                    <h3>Cycling</h3>
                    <p>{descriptions(activity[0])}</p>
                    <h3>Hiking</h3>
                    <p>{descriptions(activity[1])}</p>
                    <h3>Camping</h3>
                    <p>{descriptions(activity[2])}</p>
                    <h3>Clothing</h3>
                    <p>{descriptions(activity[3])}</p>
                </div>
            </div>
        </>
        ) : (
            <p>Enter your city to load weather data...</p>
        )}
        </div>
    );
};
export default Activities;
