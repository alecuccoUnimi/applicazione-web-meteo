const API_ID = "55380768e96088848012064e79f3aae8";

async function getWeatherByCity(city){
    let response = await fetch("https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+API_ID+"&units=metric&lang=it",{method:"GET"});
    let jsonObj = await response.json();
    return jsonObj;
}


function setWeather(city,i){
        getWeatherByCity(city).then(meteo =>{

        document.getElementById('img_' + i).setAttribute('src',"http://openweathermap.org/img/wn/"+meteo.weather[0].icon+"@2x.png");
        document.getElementById('meteo_' + i).innerText =  meteo.weather[0].description + " " + meteo.main.temp +"°";
    });
   
}


let cities = [0,"Milano","Roma","Napoli","New York","Dubai","Londra","Tokyo","Los Angeles","Sydney"];
    for (let i = 1; i < cities.length; i++) {
        setWeather(cities[i],i);
}  




function setWeatherPosition(city){
    let dayNames = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato',];    
    let monthsNames = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];

    getWeatherByCity(city).then(field => {
        document.getElementById("immagine_posizione").src = "http://openweathermap.org/img/wn/"+field.weather[0].icon+"@2x.png";
        document.getElementById("temperatura_corrente").innerText = field.main.temp + "°";
        let date = new Date(field.dt*1000);
        document.getElementById('giorno_corrente').innerText = dayNames[date.getDay()] + " " + date.getDate() + " " + monthsNames[date.getMonth()];
        let pressione = field.main.pressure;
        let umidità = field.main.humidity;
        document.getElementById("tempo_corrente").innerText = "pressione:" + pressione + "                            umidità:  " + umidità;
});
}














