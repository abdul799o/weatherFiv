import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Weather.css';
import WeatherHourly from './WeatherHourly';
import DailyWeather from './DailyWeather';

const Weather = () => {
    const [city, setCity] = useState('London');
    const z = 0;
    const x = 0;
    const y = 0;
    const [icon, setIcon] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [weatherMap, setWeatherMap] = useState(null); 
    const [weatherDisplay, setWeeklyWeather] = useState('');
    const [weatherDisplay2, setTodaysWeather] = useState(''); // weatherDisplay and weatherDisplay2 set by the correlating functions
    const currentDay = new Date().toDateString();
    const activity = ["cycling", "hiking", "camping", "clothing"] //Order for the 3 activities and clothing used for recommendations
    const [forecastData, setForecastData] = useState(null);
    const [dailyData, setDailyData] = useState([]);

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
    let dayOfTheWeek = weekday[d.getDay()];

    async function fetchForecast() {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=metric&cnt=7&appid=69084501b8a41087da148556d2a1b461`
            );

            setForecastData(response.data);

        } catch (error) {
            console.error(error);
        }
    }
    
    async function fetchData() {
        try {

            const apiURL = "https://api.openweathermap.org/data/2.5/forecast/daily?q=London&units=metric&cnt=7&appid=69084501b8a41087da148556d2a1b461";
            try {
              const response = await fetch(apiURL);
              const data = await response.json();
              setDailyData(data.list);
            } catch (error) {
              console.error("Error fetching data: ", error);
            }

        } catch (error) {
            console.error(error);
        }
        try {
            const reply = await axios.get(
                `https://tile.openweathermap.org/map/temp_new/${z}/${x}/${y}.png?appid=69084501b8a41087da148556d2a1b461`
            );
            fetch(`https://tile.openweathermap.org/map/temp_new/${z}/${x}/${y}.png?appid=69084501b8a41087da148556d2a1b461`)
                .then(reply => { return reply.blob(); })
                .then(blob => {
                    var img = URL.createObjectURL(blob);
                    console.log(img);
                    setWeatherMap(img);
                });

            console.log(reply.data); //You can see all the weather data in console log
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => { //API weather data fetched after initial page render
        fetchData();
        weatherIcon();
        todaysWeather();
        getLocation();
        fetchForecast(); 

    }, []);

    function getDayOfWeek(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
      }

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

    function CheckDay(day){
        if(day + d.getDay() > 6){
            return day + d.getDay() - 7;
        }
        else{
            return day + d.getDay();
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    const weatherIcon = () =>{
        setIcon(<img src={require('./images/Sun_fill.png')} alt=""></img>)
    }
    //Sets the weather data display to just today's weather
    const todaysWeather = () => {
        setTodaysWeather(
        <WeatherHourly cityVal={city}/>
        );
        setWeeklyWeather();
    }

    const getDaysRange = () => {
        const days = [];
        for (let i = 1; i <= 4; i++) { // Starting from 1 to include the current day
            const day = new Date();
            day.setDate(day.getDate() + i);
            // Format the date to show only the day of the week
            const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'long' });
            days.push(dayOfWeek);
        }
        return days;
    };


    const weeklyWeather = () => {
        setWeeklyWeather(
            <div id="weather-container">
            {dailyData.map((day, index) => (
                <div key={index} id="icons-container">
                    <h3>{getDayOfWeek(day.dt)}</h3>
                    <p>{day.temp.day}°C</p>
                    <img src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`} alt={day.weather[0].description} />
                </div>
            ))}

        </div>
        )
        setTodaysWeather(); // Assuming you want to clear the today's weather when displaying weekly weather
    }

    //Displays the recommendations for the specific activities based on the weather conditions
    const descriptions = (activity) => {
        //Order of weather conditions is Rain/Drizzle, Snow, Clear, Clouds, Thunderstorm, Fog, Other
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
                <div id='date'><p>{currentDay}</p></div>
                <div id='temp'><p>{weatherData.main.temp}°C</p></div>
                <button id = 'act-button' onClick={() => navigate('/activities')}>Activities</button>
            </div>

            {/*Displays the weekly weather or current day weather depending on user button selection*/}
            <div className = 'weather-box'>
                    <button type = "button" id = 'weather-choice' onClick={todaysWeather}>Today's Weather</button>
                    <button type = "button" id = 'weather-choice2' onClick={weeklyWeather}>Weekly Weather</button>
                    <p>{weatherDisplay}</p>
                    <p>{weatherDisplay2}</p>
            </div>

            {/*Displays general weather information and catered advice to users*/}
            <div className = 'weather-desc'>
                <h2>Weather Information</h2>
                <p>Description: {weatherData.weather[0].description}</p>
                <p>Feels like : {weatherData.main.feels_like}°C</p>
                <p>Humidity : {weatherData.main.humidity}%</p>
                <p>Pressure : {weatherData.main.pressure}</p>
                <p>Wind Speed : {weatherData.wind.speed}m/s</p>
            </div>
            <div id = 'activity-desc'>
                <h2>Activity Specific Recommendations</h2>
                <h3>Cycling</h3>
                <p>{descriptions(activities[0])}</p>
                <h3>Hiking</h3>
                <p>{descriptions(activities[1])}</p>
                <h3>Camping</h3>
                <p>{descriptions(activities[2])}</p>
                <h3>Clothing</h3>
                <p>{descriptions(activities[3])}</p>
            </div>
        </div>
        {/*Displays weather map for the day*/}
        <div id = "weather-map">
            <p>Map of Area</p>
            <img id = "map-image" src = {weatherMap} alt='map'></img>
        </div>
    </>
    ) : (
        <p>Enter your city to load weather data...</p>
    )}
    </div>
);
};
export default Weather;












