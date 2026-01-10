import { useEffect, useRef, useState } from "react";
import { getWeatherByCity, getForecastByCity } from "../services/weatherApi";

import RainCanvas from "../components/RainCanvas";
import SunCanvas from "../components/SunCanvas";
import CloudyCanvas from "../components/CloudyCanvas";
import MoonCanvas from "../components/MoonCanvas";

export default function WeatherScreen() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("São Paulo");
  const [search, setSearch] = useState("São Paulo");

  const scrollRef = useRef(null);

  //Usando o icon da API para definir se é dia ou noite
  const isDay = weather?.weather?.[0]?.icon?.includes("d");

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
    if (!weather || !weather.weather) return null;
    const main = weather.weather[0].main.toLowerCase();
    const description = weather.weather[0].description.toLowerCase();
    const hasRain =
      weather.rain?.["1h"] > 0 || weather.rain?.["3h"] > 0;

    if (
      ["rain", "drizzle", "thunderstorm"].some((cond) => main.includes(cond)) ||
      description.includes("chuva") ||
      hasRain
    ) {
      return (
        <RainCanvas
          description={weather.weather[0].description}
          isDay={isDay}
        />
      );
    }
    if (main.includes("clear") && isDay) return <SunCanvas />;
    if (main.includes("clear") && !isDay) return <MoonCanvas />;
    if (main.includes("clouds")) return <CloudyCanvas />;
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
    if (cond.includes("clear")) return "☀️";
    if (cond.includes("clouds")) return "☁️";
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

      <div
        className={`z-10 w-auto max-w-[95%] sm:max-w-3xl mx-auto px-6 sm:px-10 py-6 sm:py-8 rounded-3xl 
          backdrop-blur-xl bg-white/70 shadow-2xl border border-white/40
          text-center transition-colors duration-500 ${
            !weather ? "text-gray-400" : isDay ? "text-gray-500" : "text-[#1e293b]"
          } font-inter`}
      >
        <h1 className="text-2xl sm:text-4xl font-bold mb-4">
          Weather App ☁️
        </h1>

        {loading && <p className="mt-1 text-sm opacity-80">Carregando clima...</p>}

        {weather && (
          <>
            <p className="text-xl sm:text-3xl font-semibold tracking-wide">
              {weather.name}
            </p>
            {/* Temperatura com efeito prateado */}
            <p className="flex items-center justify-center gap-2 text-6xl sm:text-8xl font-extrabold mt-2 leading-none 
                          bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text text-transparent">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="mt-3 text-sm sm:text-lg capitalize flex items-center justify-center gap-2">
              {getWeatherIcon(
                weather.weather[0].main,
                weather.weather[0].description,
                weather.rain
              )}
              {weather.weather[0].description}
            </p>

            {/* Input de busca */}
            <div className="flex justify-center mt-6">
              <div className="relative w-full max-w-xs sm:max-w-md">
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
                             text-center text-sm sm:text-base
                             focus:outline-none focus:ring-2 focus:ring-sky-400 
                             placeholder:text-slate-400"
                />
              </div>
            </div>
          </>
        )}

        {forecast.length > 0 && (
          <div className="mt-8">
            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-5 md:gap-4">
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
                    key={day.dt_txt}
                    className={`flex flex-col items-center rounded-2xl p-3 backdrop-blur-md text-sm
                      ${isDay ? "bg-white/30 text-gray-500" : "bg-white/20 text-[#1e293b]"}`}
                  >
                    <span className="font-medium">{weekday}</span>
                    <span className="text-xl font-bold">
                      {Math.round(day.main.temp)}°C
                    </span>
                    <span className="capitalize text-xs flex items-center gap-1 text-center">
                      {icon} {day.weather[0].description}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile carrossel */}
            <div className="relative md:hidden">
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto justify-center scrollbar-hide"
              >
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
                      key={day.dt_txt}
                      className={`flex-shrink-0 w-24 sm:w-28 flex flex-col items-center rounded-xl p-2 sm:p-3 backdrop-blur-md text-sm
                        ${isDay ? "bg-white/30 text-gray-500" : "bg-white/20 text-[#1e293b]"}`}
                    >
                      <span className="font-medium">{weekday}</span>
                      <span className="text-lg font-bold">
                        {Math.round(day.main.temp)}°C
                      </span>
                      <span className="capitalize text-xs flex items-center gap-1 text-center">
                        {icon} {day.weather[0].description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
