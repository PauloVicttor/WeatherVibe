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
  const [city, setCity] = useState("São Paulo"); // cidade inicial
  const [search, setSearch] = useState("São Paulo"); // valor do input

  const isDay =
    weather &&
    Date.now() / 1000 > weather.sys.sunrise &&
    Date.now() / 1000 < weather.sys.sunset;

  async function loadWeather(selectedCity) {
    try {
      setLoading(true);
      const data = await getWeatherByCity(selectedCity);
      setWeather(data);

      const forecastData = await getForecastByCity(selectedCity);
      const daily = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(daily.slice(0, 5));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather(city);
  }, [city]);

  const renderWeatherEffect = () => {
    if (!weather) return null;

    const main = weather.weather[0].main.toLowerCase();
    const description = weather.weather[0].description.toLowerCase();
    const hasRain =
      weather.rain && (weather.rain["1h"] > 0 || weather.rain["3h"] > 0);

    if (
      ["rain", "drizzle", "thunderstorm"].some((cond) => main.includes(cond)) ||
      description.includes("chuva") ||
      hasRain
    ) {
      return <RainCanvas description={weather.weather[0].description} isDay={isDay} />;
    }

    if (main.includes("clear") && isDay) {
      return <SunCanvas />;
    }
    if (main.includes("clear") && !isDay) {
      return <MoonCanvas />;
    }

    if (main.includes("clouds")) {
      return <CloudyCanvas />;
    }

    return null;
  };

  const getWeatherIcon = (main, description, rain) => {
    const cond = main.toLowerCase();
    const desc = description.toLowerCase();
    const hasRain = rain && (rain["1h"] > 0 || rain["3h"] > 0);

    if (
      ["rain", "drizzle", "thunderstorm"].some((c) => cond.includes(c)) ||
      desc.includes("chuva") ||
      hasRain
    ) {
      return "🌧️";
    }
    if (cond.includes("clear")) {
      return "☀️";
    }
    if (cond.includes("clouds")) {
      return "☁️";
    }
    return "🌡️";
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex items-center justify-center transition-colors duration-700
        ${
          isDay
            ? "bg-gradient-to-b from-sky-400 to-sky-100"
            : "bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#2c5364]"
        }`}
    >
      {renderWeatherEffect()}

      {/* 📄 Card central com glassmorphism ajustado */}
      <div
        className={`z-10 w-full max-w-3xl px-10 py-8 rounded-3xl 
          backdrop-blur-xl bg-white/40 shadow-2xl border border-white/40
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
            <p className="text-3xl font-semibold tracking-wide">{weather.name}</p>
            <p className="text-7xl font-extrabold mt-2 leading-none">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="mt-3 text-lg capitalize opacity-80 flex items-center justify-center gap-2">
              {getWeatherIcon(
                weather.weather[0].main,
                weather.weather[0].description,
                weather.rain
              )}
              {weather.weather[0].description}
            </p>

            {/* 🔍 Campo de busca abaixo da descrição */}
            <div className="relative max-w-md mx-auto mt-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setCity(search)}
                placeholder="Buscar cidade..."
                className="w-full pl-10 pr-4 py-2 rounded-full 
                           bg-white/20 backdrop-blur-md 
                           text-center text-sm 
                           focus:outline-none focus:ring-2 focus:ring-sky-400 
                           placeholder:text-slate-400"
              />
            </div>
          </>
        )}

        {forecast.length > 0 && (
          <div className="mt-8 grid grid-cols-5 gap-3">
            {forecast.map((day) => {
              const date = new Date(day.dt_txt);
              const weekday = date.toLocaleDateString("pt-BR", {
                weekday: "short",
              });
              const icon = getWeatherIcon(
                day.weather[0].main,
                day.weather[0].description,
                day.rain
              );

              return (
                <div
                  key={day.dt}
                  className="flex flex-col items-center bg-white/20 rounded-2xl p-3 backdrop-blur-md"
                >
                  <span className="font-medium">{weekday}</span>
                  <span className="text-xl font-bold">
                    {Math.round(day.main.temp)}°C
                  </span>
                  <span className="capitalize text-xs opacity-70 flex items-center gap-1">
                    {icon} {day.weather[0].description}
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