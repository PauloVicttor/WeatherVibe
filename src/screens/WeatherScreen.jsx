import { useEffect, useState } from "react";
import { getWeatherByCity, getForecastByCity } from "../services/weatherApi";

import RainCanvas from "../components/RainCanvas";
import SunCanvas from "../components/SunCanvas";
import CloudyCanvas from "../components/CloudyCanvas";
import MoonCanvas from "../components/MoonCanvas";

export default function WeatherScreen() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDay =
    weather &&
    Date.now() / 1000 > weather.sys.sunrise &&
    Date.now() / 1000 < weather.sys.sunset;

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await getWeatherByCity("São Paulo");
        setWeather(data);

        const forecastData = await getForecastByCity("São Paulo");
        // pegar apenas 1 previsão por dia (ex.: 12h)
        const daily = forecastData.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );
        setForecast(daily.slice(0, 5)); // agora pega 5 dias
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, []);

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex items-center justify-center transition-colors duration-700
        ${
          isDay
            ? "bg-gradient-to-b from-sky-400 to-sky-100"
            : "bg-gradient-to-b from-[#020617] to-[#0f172a]"
        }`}
    >
      {/* Efeitos climáticos */}
      {weather && weather.weather[0].main.toLowerCase().includes("rain") && (
        <RainCanvas />
      )}
      {weather && weather.weather[0].main.toLowerCase().includes("clear") && isDay && (
        <SunCanvas />
      )}
      {weather && weather.weather[0].main.toLowerCase().includes("clear") && !isDay && (
        <MoonCanvas />
      )}
      {weather && weather.weather[0].main.toLowerCase().includes("clouds") && (
        <CloudyCanvas />
      )}

      {/* 📄 Card central com glassmorphism */}
      <div
        className={`z-10 w-full max-w-3xl px-10 py-8 rounded-3xl backdrop-blur-xl bg-white/30 shadow-2xl border border-white/40
          text-center transition-colors duration-500 ${
            isDay ? "text-slate-900" : "text-white"
          }`}
      >
        <h1 className="text-4xl font-bold mb-4">Weather App ☁️</h1>

        {loading && (
          <p className="mt-1 text-sm opacity-80">Carregando clima...</p>
        )}

        {weather && (
          <>
            {/* Cidade em destaque */}
            <p className="text-3xl font-semibold tracking-wide">{weather.name}</p>

            {/* Temperatura principal */}
            <p className="text-7xl font-extrabold mt-2 leading-none">
              {Math.round(weather.main.temp)}°C
            </p>

            {/* Descrição */}
            <p className="mt-3 text-lg capitalize opacity-80">
              {weather.weather[0].description}
            </p>
          </>
        )}

        {/* Previsão dos próximos 6 dias */}
        {forecast.length > 0 && (
          <div className="mt-8 grid grid-cols-5 gap-3">
            {forecast.map((day) => {
              const date = new Date(day.dt_txt);
              const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" });
              return (
                <div
                  key={day.dt}
                  className="flex flex-col items-center bg-white/20 rounded-2xl p-3 backdrop-blur-md"
                >
                  <span className="font-medium">{weekday}</span>
                  <span className="text-xl font-bold">
                    {Math.round(day.main.temp)}°C
                  </span>
                  <span className="capitalize text-xs opacity-70">
                    {day.weather[0].description}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}