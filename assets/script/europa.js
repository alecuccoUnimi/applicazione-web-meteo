const API_ID_Wheater = "55380768e96088848012064e79f3aae8";



async function getCoordinatesByCity(city){
    let response = await fetch("https://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid="+API_ID_Wheater,{ method:"GET"});
    let jsonObj = await response.json();
    return jsonObj;
}


async function getWeatherByCoordinates(lat,long){
    let response = await fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude={minutely,alerts}&appid="+API_ID_Wheater+"&units=metric&lang=it",{method:"GET"});
    let jsonObj = await response.json();
    return jsonObj;
}

cities = [0, "Londra","Liverpool","Manchester","Parigi", "Marsiglia","Nizza","Madrid","Siviglia","Barcellona","Berlino","Francoforte","Monaco","Amsterdam","Lisbona","Porto","Dublino"];
for (let i = 1; i < cities.length; i++) {
    setWeather(cities[i],i);
}

function setWeather(city,i){
let coordinates = getCoordinatesByCity(city).then(field => { 
    getWeatherByCoordinates(field[0].lat, field[0].lon).then(meteo =>{

        let meteo_corrente= meteo.current; //tempo corrente

        document.getElementById('img_' + i).src = "http://openweathermap.org/img/wn/"+meteo_corrente.weather[0].icon+"@2x.png";
        let tempo = meteo_corrente.weather[0].description;
        let pressione = meteo_corrente.pressure; 
        let umidita = meteo_corrente.humidity;
        let vento = meteo_corrente.wind_speed;
        let nuvole = meteo_corrente.clouds;
        document.getElementById('meteo_' + i).innerText = tempo + " Pressione: " + pressione + "Umidità: " + umidita + "Vento: " +vento + "Nuvole: " + nuvole ; 
        document.getElementById('temp_' + i).innerText = meteo_corrente.temp +"°";
    });
});
}
