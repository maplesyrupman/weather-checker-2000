const getLatLong = (address) => {
    let apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDDAXgOW2qEDtuDWpaGlkmhXq-NE1eup58`;

    fetch(apiUrl).then(response => {
        if (response.ok) {
            response.json().then(data => {
                let longLat = data.results[0].geometry.location;
                let long = longLat.lng;
                let lat = longLat.lat; 
                getWeather(lat, long);
            })
        }
    })
}

const getWeather = (lat, long) => {
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=alerts&units=metric&appid=5b848fac17108bd3ae005d5145e0ad5a`;

    fetch(apiUrl).then(response => {
        if (response.ok) {
            response.json().then(data => {
                console.log(data);
            })
        } else {
            console.log('error');
        }
    })
}

