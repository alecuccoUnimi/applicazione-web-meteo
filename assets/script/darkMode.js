
function updateDarkModeLocalStorage(){
    const checked = document.getElementById('darkModeSwitch').checked;
    const visualMode = {
        darkMode : checked,
        date : new Date().getTime()  /(1000*60*60*24),
    };
    localStorage.setItem('darkMode', JSON.stringify(visualMode));
}


function darkMode(){
    var element = document.getElementById("darkModeSwitch");
    if(element.checked){
        const primary_color = document.querySelectorAll('.primary-color');
        primary_color.forEach(element  => {
          element.classList.remove('primary-color');
          element.classList.add('dark-mode-primary-color');
        });
        const secondary_color = document.querySelectorAll('.secondary-color');
        secondary_color.forEach(element  => {
            element.classList.remove('secondary-color');
            element.classList.add('dark-mode-secondary-color');
          });
          document.body.classList.add('background-color');
   } else {
        const primary_color = document.querySelectorAll('.dark-mode-primary-color');
        primary_color.forEach(element => {
            element.classList.remove('dark-mode-primary-color');
            element.classList.add('primary-color');
        });
        const secondary_color = document.querySelectorAll('.dark-mode-secondary-color');
        secondary_color.forEach(element  => {
            element.classList.remove('dark-mode-secondary-color');
            element.classList.add('secondary-color');
          });
          document.body.classList.remove('background-color');
    }
    updateDarkModeLocalStorage();
}

function getDarkModeFromLocalStorage(){
    const visualMode = JSON.parse(localStorage.getItem('darkMode'));
    if(visualMode ){
        const time = new Date().getTime() / (1000*60*60*24);
        if((time - visualMode.date) > 20  ){
            updateDarkModeLocalStorage();
        } else {
            document.getElementById('darkModeSwitch').checked = visualMode.darkMode;
            darkMode();
        }
    }else { 
        updateDarkModeLocalStorage();
    }
}


getDarkModeFromLocalStorage();
