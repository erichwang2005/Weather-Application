
document.getElementById("search-button").addEventListener("click", () => {
    const slider = document.getElementById("fc-button");
    slider.classList.add("slidechange");

});

let searchCounter = 0;
function getWeather()
{
    searchCounter++;
    const apiKey = 'd1c77924e5388d0361a71657c8070ec4';
    const city = document.getElementById('city').value;

    if(!city)
    {
        alert('Please enter a valid city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {displayWeather(data);
    })
    .catch(error => {console.error('Error fetching data:', error);
    alert('Error fetching weather data, please try again');
    });
   

    fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {displayHourlyForecast(data.list);
    })
    .catch(error => {console.error('Error fetching hourly forecast data:', error);
        alert('Error fetching hourly forecast data, please try again.')
    });

}

function displayWeather(data)
{
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    let fcvalue;
    if(document.getElementById("fc-box").checked)
    {
        fcvalue = 1;
    }
    else
    {
        fcvalue = 0;
    }

    if(data.code === '404')
    {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>` ;
    }
    else
    {
        const cityName = data.name;
        let temp = Math.round(data.main.temp - 273.15);

        if(fcvalue === 1)
        {
            temp = Math.round((data.main.temp - 273.15)*1.8+32);
        }
        
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temp}</p>`;
        const weatherHTML = `<p>${cityName}</p> <p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData)
{
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24H = hourlyData.slice(0,8);

    let fcvalue;
    if(document.getElementById("fc-box").checked)
    {
        fcvalue = 1;
    }
    else
    {
        fcvalue = 0;
    }

    next24H.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        let temp = Math.round(item.main.temp - 273.15);

        if(fcvalue === 1)
        {
            temp = Math.round((item.main.temp - 273.15)*1.8+32);
        }
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        let hourlyItemHtml;

        if(fcvalue === 1)
        {
            hourlyItemHtml = `
            <div class = "hourly-item">
            <span>${hour}:00</span>
            <img src = "${iconUrl}" alt = "Hourly Weather Icon">
            <span>${temp}&degF</span>
            </div>
            `;
        }
        else
        {
            hourlyItemHtml = `
            <div class = "hourly-item">
            <span>${hour}:00</span>
            <img src = "${iconUrl}" alt = "Hourly Weather Icon">
            <span>${temp}&degC</span>
            </div>
            `;
        }   
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage()
{
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}

function fcChange()
{
    if(searchCounter > 0)
    {
        getWeather();
    }
}