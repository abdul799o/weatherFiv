import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Activities.css';

const Activities = () => {
    const [city, setCity] = useState('London');
    const [weatherData, setWeatherData] = useState(null);
    const currentDay = new Date().toDateString();
    const activities = ["cycling", "hiking", "camping", "clothing"] //Order for the 3 activities and clothing used for recommendations
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
        getLocation();
    }, []);

    //Gets User Location 
    const getLocation=() =>  {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error); //Takes 2 Functions, success and failure
            console.log("Geolocation not supported.");
          }
          
          //Successful Geolocation
          function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            // Make API call to OpenWeatherMap
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=69084501b8a41087da148556d2a1b461&units=metric`)
            .then(response => response.json())
            .then(data => {
            setWeatherData(data);
            console.log(data);
        })
        .catch(error => console.log(error));
            //setCity (weatherData);
          }
          //Unsuccessful Geolocation
          function error() {
            console.log("Unable to retrieve your location");
          }
        }

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    //Displays the recommendations for the specific activities based on the weather conditions
    const recommendations = (activity) => {
        //Order of weather conditions is Rain/Drizzle, Snow, Clear sky/Few clouds, Many clouds, Thunderstorm, Mist, Other
        const cyclDesc = ["Roads may be slippery due to rain. Take caution", "Roads may be slippery due to ice. Take caution.", "No issues with slippery roads or visibility", "No major issues with slippery roads or visibility", "High risk activity. Thunderstorm currently taking place.", "Visibility on roads may be affected. Take caution."]
        const hikDesc = ["Some paths may become slippery due to rain.", "Some paths may be unsafe due to ice formations. Take caution.", "Weather ideal for hiking!", "Weather ideal for hiking!", "Thunderstorm currently taking place. Hiking not recommended.", "Visibility on pathways may be affected."]
        const campDesc = ["Prepare shelter to protect from rain.", "Prepare shelter to protect from snow or hail.", "Weather ideal for camping", "Weather ideal for camping", "Shelter required to protect from thunderstorm. Take caution", "No major issues with camping."]
        const clothDesc = ["Coat recommended", "Wear multiple layers to protect from cold and snow.", "Sunglasses recommended", "Coat recommended to prepare for possible rain", "Prepare for heavy rain with waterproof clothing.", "No clothing recommendations."]
        if (activity === "cycling"){
            return cyclDesc[recCategory()]
        }
        else if (activity === "hiking") {
            return hikDesc[recCategory()]
        }
        else if (activity ==="camping"){
            return campDesc[recCategory()]
        }
        else if (activity === "clothing") {
            return clothDesc[recCategory()]
        }
    }
    //Returns an index depending on the current weather conditions which determines which 
    //recommendation to display in the description arrays for the three descriptions and clothing
    const recCategory = () => {
        var descNo
        if (weatherData.weather[0].main === "Rain" || weatherData.weather[0].main === "Drizzle"){
            descNo = 0
        }
        else if (weatherData.weather[0].main === "Snow"){
            descNo = 1
        }
        else if (weatherData.weather[0].main === "Clear" || weatherData.weather[0].description === "few clouds" || weatherData.weather[0] === "scattered clouds"){
            descNo = 2
        }
        else if (weatherData.weather[0].description === "broken clouds" || weatherData.weather[0].description === "overcast clouds"){
            descNo = 3
        }
        else if (weatherData.weather[0].main === "Thunderstorm"){
            descNo = 4
        }
        else if (weatherData.weather[0].icon === "50d" || weatherData.weather[0].icon === "50n"){
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
            <div className = 'page-grid2'>
                {/*Displays the chosen location, current day, and main temperature*/}
                <div className='flex-container2'> 
                    <div id='title'><p>{weatherData.name}</p></div>
                    <div><p>{currentDay}</p></div>
                    <div><p>{weatherData.main.temp}°C</p></div>
                    <button id = 'weath-button' onClick={() => navigate('/weather')}>Weather</button>
                </div>
                <div id = 'cycling'>
                    <h3>Cycling</h3>
                    <p>{recommendations(activities[0])}</p>
                </div>
                <div id = 'hiking'>
                    <h3>Hiking</h3>
                    <p>{recommendations(activities[1])}</p>
                </div>
                <div id = 'camping'>
                    <h3>Camping</h3>
                    <p>{recommendations(activities[2])}</p>
                </div>
                <div id = 'clothing'>
                    <h3>Clothing</h3>
                    <p>{recommendations(activities[3])}</p>
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
