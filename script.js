const currentDayContainer = document.getElementById('current-day');
const fiveDayContainer = document.getElementById('five-day-forecast');
const enterCityPrompt = document.getElementById('enter-city-prompt');

let cityEl = document.getElementById('current-city');
let dateEl = document.getElementById('todays-date');
let currentIcon = document.getElementById('current-icon');
let currentTempEl = document.getElementById('current-temp');
let currentWindEl = document.getElementById('current-wind');
let currentHumEl = document.getElementById('current-hum');
let currentUVEl = document.getElementById('current-uv');

let searchBtn = document.getElementById('searchBtn');

let recentContainer = document.getElementById('recent-searches-container');


const getLatLong = (city) => {
    let apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyDDAXgOW2qEDtuDWpaGlkmhXq-NE1eup58`;

    fetch(apiUrl).then(response => {
        if (response.ok) {
            response.json().then(data => {
                let longLat = data.results[0].geometry.location;
                let long = longLat.lng;
                let lat = longLat.lat; 
                let recentObj = {
                    lat,
                    long, 
                    city
                }
                saveRecent(recentObj);
                createRecentButton(recentObj);
                getWeather(lat, long, city);
            })
        } else {
            console.log('error');
        }
    })
}

const getWeather = (lat, long, city) => {
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=alerts&units=metric&appid=5b848fac17108bd3ae005d5145e0ad5a`;

    fetch(apiUrl).then(response => {
        if (response.ok) {
            response.json().then(data => {
                displayCurrentDay(data, city);
                display5Day(data);

                if (currentDayContainer.classList.contains('hide')) {
                    currentDayContainer.classList.remove('hide');
                    fiveDayContainer.classList.remove('hide');
                    enterCityPrompt.classList.add('hide');
                }
            })
        } else {
            console.log('error');
        }
    })
};

const displayCurrentDay = (data, city) => {
    cityEl.textContent = city;
    dateEl.textContent = dayjs().format('dddd, MMMM D, YYYY');
    currentIcon.setAttribute('src', getIconUrl(data.current.weather[0].icon));
    currentTempEl.textContent = data.current.temp + '° C';
    currentWindEl.textContent = Math.round((data.current.wind_speed * 3.5)) + ' km/h';
    currentHumEl.textContent = data.current.humidity + '%';

    let currentUv = data.current.uvi;
    currentUVEl.textContent = currentUv;

    currentUVEl.classList = '';
    if (currentUv <= 2.5) {
        currentUVEl.classList.add('bg-success')
    } else if (currentUv > 2.5 && currentUv <= 5.5) {
        currentUVEl.classList.add('bg-warning');
    } else {
        currentUVEl.classList.add('bg-danger');
    }
    
}

const display5Day = (data) => {
    for (let i=1; i < 6; i++) {
        let todaysData = data.daily[i-1];

        let dateEl = document.getElementById(`day-${i}-date`);
        let iconImg = document.getElementById(`day-${i}-icon`);
        let highTempEl = document.getElementById(`day-${i}-Htemp`);
        let lowTempEl = document.getElementById(`day-${i}-Ltemp`);
        let windEl = document.getElementById(`day-${i}-wind`);
        let humEl = document.getElementById(`day-${i}-hum`);

        dateEl.textContent = dayjs().add(i, 'day').format('dddd');
        iconImg.setAttribute('src', getIconUrl(todaysData.weather[0].icon));
        highTempEl.textContent = Math.round(todaysData.temp.max);
        lowTempEl.textContent = Math.round(todaysData.temp.min);
        windEl.textContent = Math.round(todaysData.wind_speed *3.5) + ' km/h';
        humEl.textContent = todaysData.humidity + '%';
    }
}

const getIconUrl = (iconId) => {
    let iconUrl = `http://openweathermap.org/img/wn/${iconId}.png`;
    return iconUrl;
}

const getRecent = () => {
    return (localStorage.getItem('recentSearches')) ? 
            JSON.parse(localStorage.getItem('recentSearches')) : 
            [];
}

const saveRecent = (recentObj) => {
    let recentSearches = getRecent();
    let thisSearch = [recentObj];
    let newRecent = thisSearch.concat(recentSearches);
    if (newRecent.length > 7) {
        newRecent = newRecent.slice(0, 7);
    }
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
}

const createRecentButton = (recentObj) => {
    let recentButton = document.createElement('button');
    recentButton.classList = 'btn btn-secondary';
    recentButton.textContent = recentObj.city;
    recentButton.setAttribute('data-city', recentObj.city);
    recentButton.setAttribute('data-lat', recentObj.lat);
    recentButton.setAttribute('data-long', recentObj.long);

    recentButton.addEventListener('click', (e) => {
        let lat = e.target.dataset.lat;
        let long = e.target.dataset.long;
        let city = e.target.dataset.city;

        getWeather(lat, long, city);
    });

    recentContainer.insertBefore(recentButton, recentContainer.firstChild);
    if (recentContainer.childNodes.length > 7) {
        recentContainer.lastChild.remove();
    }
}

const createRecentButtons = () => {
    let recentSearches = getRecent();
    recentSearches.reverse(); //ensures correct order of recent searches, see 
    

    for (let i=0; i< recentSearches.length; i++) {
        createRecentButton(recentSearches[i]);
    }
}

searchBtn.addEventListener('click', e => {
    e.preventDefault();
    let city = document.getElementById('search-input').value;
    getLatLong(city);
    document.getElementById('search-input').value = '';
})

createRecentButtons();