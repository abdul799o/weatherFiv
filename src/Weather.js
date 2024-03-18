import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Weather.css';


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

                    // for(i=0; i<5; i++){
                    //     Number(data.list[i].main.temp.toFixed(2)+"°")
                    // }
                    // for(i=0; i<5; i++){
                    //     src="https://openweathermap.org/img/wn/" +data.list[i].weather[0].icon + ".png";
                    // }
                });

            console.log(reply.data); //You can see all the weather data in console log
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => { //API weather data fetched after initial page render
        fetchData();
        //weatherIcon();
        todaysWeather();
    }, []);

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    

  //Sets the weather data display to just today's weather
  const todaysWeather = () => {
        setTodaysWeather(<p>Today's Weather Will Be Here</p>);
        setWeeklyWeather();
    }

    const getDaysRange = () => {
        const days = [];
        for (let i = -1; i <= 3; i++) { // Starting from -1 to include the day before
            const day = new Date();
            day.setDate(day.getDate() + i);
            // Format the date to show only the day of the week
            const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'long' });
            days.push(dayOfWeek);
        }
        return days;
    };

    //Sets the weather data display to daily weather
    const weeklyWeather = () => {
        const daysRange = getDaysRange(); // Get the formatted days of the week
        setWeeklyWeather(
        //     <div className='weekly-weather'>
        //         {daysRange.map((day, index) => (
        //             <p key={index}>{day}</p> // Display each day of the week
        //     ))}
        // </div>

        <div id="weather-container">
                <div id="icons-container">
                    <div id ="icons">
                    <p class="weather" id="day1"></p>
                    <div class="image"><img src={require('./dot.jpg')} class="imgClass" id="img1"></img></div>
                    </div>
                </div>
                <div id="icons-container">
                    <div id ="icons">
                    <p class="weather" id="day2"></p>
                    <div class="image"><img src={require('./dot.jpg')} class="imgClass" id="img2"></img></div>
                    </div>
                </div>
                <div id="icons-container">
                    <div id ="icons">
                    <p class="weather" id="day3"></p>
                    <div class="image"><img src={require('./dot.jpg')} class="imgClass" id="img3"></img></div>
                    </div>
                </div>
                <div id="icons-container">
                    <div id ="icons">
                    <p class="weather" id="day4"></p>
                    <div class="image"><img src={require('./dot.jpg')} class="imgClass" id="img4"></img></div>
                    </div>
                </div>
                <div id="icons-container">
                    <div id ="icons">
                    <p class="weather" id="day5"></p>
                    <div class="image"><img src={require('./dot.jpg')} class="imgClass" id="img5"></img></div>
                    </div>
                </div>
            </div>


    );
        setTodaysWeather();
    }

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
            </div>

            {/*Displays the weekly weather or current day weather depending on user button selection*/}
            <div className = 'weather-box'>
                    <button type = "button" id = 'weather-choice' onClick={todaysWeather}>Today's Weather</button>
                    <button type = "button" id = 'weather-choice2' onClick={weeklyWeather}>Weekly Weather</button>
                    <p>{weatherDisplay}</p>
                    <p>{weatherDisplay2}</p>
            </div>

            {/* <div id="weather-container">
                <div id="icons-container">
                    <div id ="icons">
                    <p class="weather" id="day1"></p>
                    <div class="image"><img src={require('./dot.jpg')} class="imgClass" id="img1"></img></div>
                    </div>
                </div>
                <div id="icons-container">
                    <div id ="icons">
                    <p class="weather" id="day2"></p>
                    <div class="image"><img src={require('./dot.jpg')} class="imgClass" id="img2"></img></div>
                    </div>
                </div>
                <div id="icons-container">
                    <div id ="icons">
                    <p class="weather" id="day3"></p>
                    <div class="image"><img src={require('./dot.jpg')} class="imgClass" id="img3"></img></div>
                    </div>
                </div>
                <div id="icons-container">
                    <div id ="icons">
                    <p class="weather" id="day4"></p>
                    <div class="image"><img src={require('./dot.jpg')} class="imgClass" id="img4"></img></div>
                    </div>
                </div>
                <div id="icons-container">
                    <div id ="icons">
                    <p class="weather" id="day5"></p>
                    <div class="image"><img src={require('./dot.jpg')} class="imgClass" id="img5"></img></div>
                    </div>
                </div>
            </div> */}

            

            {/*Displays general weather information and catered advice to users*/}
            <div className = 'weather-desc'>
                <h2>Weather Information</h2>
                <p>Description: {weatherData.weather[0].description}</p>
                <p>Feels like : {weatherData.main.feels_like}°C</p>
                <p>Humidity : {weatherData.main.humidity}%</p>
                <p>Pressure : {weatherData.main.pressure}</p>
                <p>Wind Speed : {weatherData.wind.speed}m/s</p>

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

            {/*Displays weather map for the day*/}
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
