import { useEffect, useState } from "react";
import "./App.css";
import "./components/styles/SearchForm.css";
import "./components/styles/Preloader.css";
import "../public/styles/dark.css";
import axios from "axios";
import Weather from "./components/Weather";
import SearchForm from "./components/SearchForm";
import { backgroundAccordingToWeather } from "./utilities/utilities.js";
import ModalWrongCity from "./components/ModalWrongCity";

function App() {
  //============================ImagewetaherState===================//
  const [background, setbackground] = useState(null);
  //============================WeatherStates===================//
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [cityWeather, setCityWeather] = useState(null);
  const [daysWeatherInfo, setDaysWeatherInfo] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [correctCityName, setCorrectCityName] = useState(false);

  const API_KEY = "72b39761e7f01caa4c4d9a7ce3aa447f";

  const succes = (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const URL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=7&appid=${API_KEY}`;

    Promise.all([axios.get(URL), axios.get(URL2)])
      .then((responses) => {
        setWeatherInfo(responses[0].data);
        setDaysWeatherInfo(responses[1].data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCitySearch = (city) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    axios
      .get(URL)
      .then(({ data }) => {
        setCityWeather(data);
      })
      .catch((error) => {
        console.error(error);
        setCorrectCityName(true);
      });
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const closeModal = () => {
    setCorrectCityName(false);
  };
  const accesLocationDenied = (err) => {
    if (err.code) {
      // El usuario denegó el acceso a la ubicación
      handleCitySearch("Bogota");
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(succes, accesLocationDenied);
  }, []);

  //=====================================backgroundEffect=================//
  useEffect(() => {
    cityWeather
      ? setbackground(
          backgroundAccordingToWeather[cityWeather?.weather[0].icon]
        )
      : setbackground(
          backgroundAccordingToWeather[weatherInfo?.weather[0].icon]
        );
  }, [weatherInfo, cityWeather]);

  return (
    <>
      <ModalWrongCity correctCityName={correctCityName} toClose={closeModal} />
      <main className={`background ${background}`}>
        {correctCityName && <div>HOLA MUNDI</div>}
        <section className="main_section">
          <button className="button_dark_mode" onClick={toggleDarkMode}>
            {isDark ? (
              <img
                className="dark_mode_icon"
                src="/images/night-mode.png"
                alt=""
              />
            ) : (
              <img
                className="dark_mode_icon"
                src="/images/day-mode.png"
                alt=""
              />
            )}
          </button>

          <h1 className={`title_main_section ${isDark ? "dark_text" : ""}`}>
            Weather ForeCast
          </h1>
          <SearchForm onSearch={handleCitySearch} isDark={isDark} />
          {cityWeather ? (
            <Weather weather={cityWeather} isDark={isDark} />
          ) : (
            <Weather
              weather={weatherInfo}
              daysWeatherInfo={daysWeatherInfo}
              isDark={isDark}
            />
          )}
        </section>
      </main>
    </>
  );
}

export default App;
