API_ID_google = "AIzaSyB7dJoRcuqSoSJjSbxPA14b7JrdJsnbxzQ";

var x = document.getElementById("geolocation");
var y = document.getElementById("div_posizione");
var link = document.getElementById('link_posizione');

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else { 
    x.innerText = "La geolocation non è disponibile per questo browser.";
    y.innerText = "";
  }
}

function showPosition(position) { 
    lat=position.coords.latitude;
    lon=position.coords.longitude;
    displayLocation(lat,lon).then(field => setWeatherPosition(field));
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      x.innerText = "Richiesta posizione rifiutata dall'utente."
      y.innerText = "";
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerText = "Le informazioni sulla posizione non sono disponibili."
      y.innerText = "";
      break;
    case error.TIMEOUT:
      x.innerText = "Time out richiesta posizione."
      y.innerText = "";
      break;
    case error.UNKNOWN_ERROR:
      x.innerText = "Errore sconosciuto."
      y.innerText = "";
      break;
  }
  link.style.display = 'none';
}



async function displayLocation(latitude,longitude){
  let response = await fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&key="+API_ID_google,{method:"GET"});
  let jsonObj = await response.json();
  let citta = jsonObj.results[0].address_components[2].long_name;
  x.innerText = "Meteo per " + citta;
  link.href = '/ricerca?citta='+citta;
  return citta;
}

getLocation();
