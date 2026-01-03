import { useEffect, useState } from "react";
import { getWeatherByCity } from "../services/weatherApi";
import RainCanvas from "../components/RainCanvas";
import SunCanvas from "../components/sunCanvas";
import CloudyCanvas from "../components/CloudyCanvas"; 

export default function WeatherScreen() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDay =
  weather &&
  Date.now() / 1000 > weather.sys.sunrise &&
  Date.now() / 1000 < weather.sys.sunset

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await getWeatherByCity("São Paulo");
        setWeather(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex items-center justify-center">

      {/* Efeitos climáticos */}
{weather && weather.weather[0].main.toLowerCase().includes("rain") && (
  <RainCanvas />
)}

{weather && weather.weather[0].main.toLowerCase().includes("clear") && (
  <SunCanvas />
)}

{weather && weather.weather[0].main.toLowerCase().includes("clouds") && (
  <CloudyCanvas />
)}

      

      {/* Conteúdo */}
      <div className="z-10 text-white text-center">
        <h1 className="text-4xl font-bold flex items-center gap-2 justify-center">
          Weather App ☁️
        </h1>

        {loading && (
          <p className="mt-1 text-slate-300 text-sm">Carregando clima...</p>
        )}

        {weather && (
          <>
            <p className="mt-1 text-slate-300 text-sm">
              {weather.weather[0].description}
            </p>
            <p className="mt-2 text-slate-400 text-xs">
              {weather.name} · {Math.round(weather.main.temp)}°C
            </p>
          </>
        )}
      </div>
    </div>
  );
}
