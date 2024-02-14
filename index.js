const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container")

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchform]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");


let currentTab=userTab;
const API_KEY="276f08979857492da09162828233012"
currentTab.classList.add("current-tab");
getfromSessionStorage();

function renderWeatherInfo(weatherInfo){
    //fetch all data to be updated in UI
    const cityName=document.querySelector("[data-cityName]");
    const desc=document.querySelector("[data-weatherDescription]")
    const weatherIcon=document.querySelector("[data-weatherIcon]")
    const temp=document.querySelector("[data-temp]")
    const windSpeed=document.querySelector("[data-windSpeed]")
    const humidity=document.querySelector("[data-humidity]")
    const cloudiness=document.querySelector("[data-cloudiness]")
    cityName.innerText=weatherInfo?.location?.name;
    desc.innerText=weatherInfo?.current?.condition?.text;
    weatherIcon.src=weatherInfo?.current?.condition?.icon;
    temp.innerText=`${weatherInfo?.current?.temp_c} °C`;
    windSpeed.innerText=weatherInfo?.current?.wind_kph;
    humidity.innerText=weatherInfo?.current?.humidity;
    cloudiness.innerText=weatherInfo?.current?.cloud;
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    //API CALL
    try{
        const response= await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`);

        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No geolocation Support")
    }
}
function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]")
grantAccessButton.addEventListener("click",getLocation)

const searchInput=document.querySelector("[data-searchInput]")

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response= await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        console.log("aaa");
    } 
    catch(err){
        loadingScreen.classList.remove("active")
    }
}

searchForm.addEventListener("click",(e)=>{
    e.preventDefault();
    let cityNam=searchInput.value;

    if(cityNam==="") return;
    else{
        console.log(cityNam)
        fetchSearchWeatherInfo(cityNam);
    }
})


function getfromSessionStorage(){
    //checking if location is stored or not
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //switching to usertab
            searchForm.classList.remove("active")
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();//to check if we have our coordinates
        }
    }
}
userTab.addEventListener("click",()=>{
    //for switching the tab
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    //for switching the tab
    switchTab(searchTab);
});
