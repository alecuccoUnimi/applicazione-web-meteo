const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const { mainModule } = require('process');


require("dotenv").config();


const app = express();
const port = process.env.PORT || 8080;
const API_ID_Wheater = process.env.API_ID_Wheater;
const API_ID_UnSplash = process.env.API_ID_UnSplash;

app.use(express.static(__dirname + '/assets'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');



app.get('/', function (req, res) {
    res.render(path.join(__dirname, '/views/index.ejs'));
    
});

app.get('/index.ejs', function (req, res) {
    res.render(path.join(__dirname, '/views/index.ejs'));
});

app.get('/italia.ejs', function (req, res) {
    res.render(path.join(__dirname, '/views/italia.ejs'));
});

app.get('/europa.ejs', function (req, res) {
    res.render(path.join(__dirname, '/views/europa.ejs'));
});

app.get('/mondo.ejs', function (req, res) {
    res.render(path.join(__dirname, '/views/mondo.ejs'));
});


app.get('/ricerca', (req, res) => {
    let citta = req.query.citta;
    getWeather(citta,res);
});

app.listen(port);
console.log('Server started at http://localhost:' + port);


function getWeather(citta,res){
    let coordinates = getCoordinates(citta).then(field => {
        getWeatherByCoordinate(field[0].lat, field[0].lon).then(meteo => {
     
            let d = new Date();
            let localTime = d.getTime();
            let localOffset = d.getTimezoneOffset() * 60000;
            let utc = localTime + localOffset;
            let cityTime = utc + (1000 * meteo.timezone_offset);
            let date = new Date(cityTime);

            let dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
            let monthsNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

            let meteo_corrente = meteo.current; //tempo corrente
            let meteo_hourly = meteo.hourly;
            let meteo_daily = meteo.daily;

            //CORRENTE
            let icon = "http://openweathermap.org/img/wn/" + meteo_corrente.weather[0].icon + "@2x.png";
            let ora_corrente = date.getHours() + ":" + date.getMinutes();
            let giorno = dayNames[date.getDay()] + " " + date.getDate() + " " + monthsNames[date.getMonth()];
            let temperatura = meteo_corrente.temp + "°";
            let tempo = meteo_corrente.weather[0].description;
            let pressione = meteo_corrente.pressure; 
            let umidita = meteo_corrente.humidity;
            let vento = meteo_corrente.wind_speed;
            let nuvole = meteo_corrente.clouds;
            let precipitazioni;
            meteo_corrente = { giorno, icon, temperatura, tempo, pressione, umidita, nuvole, vento};
            

            //PROSSIME ORE
            let meteo_orario = [];
            let diff = date.getHours() - 23;
            let ora ;
            let i = 1;
            do {
                ora = date.getHours() + i;
                icon = "http://openweathermap.org/img/wn/" + meteo_hourly[i].weather[0].icon + "@2x.png";
                temperatura = meteo_hourly[i].temp;
                let tempo = meteo_hourly[i].weather[0].description;
                pressione = meteo_hourly[i].pressure; 
                umidita = meteo_hourly[i].humidity;
                vento = meteo_hourly[i].wind_speed;
                nuvole = meteo_hourly[i].clouds;
                precipitazioni = meteo_hourly[i].pop;
                meteo_orario.push({ora, icon, temperatura,tempo,pressione, umidita, nuvole,vento,precipitazioni,});
                i++;
            } while (ora < 23);

            //PROSSIMI GIORNI
            let meteo_previsioni = [];
            for (let i = 1; i < 8; i++) {

                icon = "http://openweathermap.org/img/wn/" + meteo_daily[i].weather[0].icon + "@2x.png";
                let date = new Date(meteo_daily[i].dt * 1000);
                giorno = dayNames[date.getDay()] + " " + date.getDate() + " " + monthsNames[date.getMonth()];
                temperatura = meteo_daily[i].temp.min + "° - " + meteo_daily[i].temp.max + "°";
                let tempo = meteo_daily[i].weather[0].description;
                pressione = meteo_daily[i].pressure; 
                umidita = meteo_daily[i].humidity;
                vento = meteo_daily[i].wind_speed;
                nuvole = meteo_daily[i].clouds;
                precipitazioni = meteo_daily[i].pop;
                meteo_previsioni.push({giorno,icon,temperatura,tempo,pressione, umidita,nuvole,vento,precipitazioni,
                });
            }
            
            const photo = getPhoto(tempo).then(immagine => { res.render('ricerca.ejs', { citta, immagine, ora_corrente, meteo_corrente, meteo_orario , meteo_previsioni }); });

        });
    });
}

/* WEATHER API
--------------------------------------- */

async function getCoordinates(city) {
    let response = await fetch("https://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid=" + API_ID_Wheater, { method: "GET" });
    let jsonObj = await response.json();
    return jsonObj;
}


async function getWeatherByCoordinate(lat, lon) {
    let response = await fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={minutely,alerts}&lang=it&appid=" + API_ID_Wheater + "&units=metric", { method: "GET" });
    let jsonObj = await response.json();
    return jsonObj;
}

async function getPhoto(photo) {
    let response = await fetch("https://api.unsplash.com/search/photos?query=" + photo + "&orientation=landscape&client_id=" + API_ID_UnSplash, { method: "GET" });
    let jsonObj = await response.json();
    //let randonImage = Math.floor(Math.random() * 10);
    return jsonObj.results[0].urls.regular;
}