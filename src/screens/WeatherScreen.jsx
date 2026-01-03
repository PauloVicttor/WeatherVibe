import { useEffect, useState } from "react"
import { getWeatherByCity } from "../services/weatherApi"

import RainCanvas from "../components/RainCanvas"
import SunCanvas from "../components/SunCanvas"
import CloudyCanvas from "../components/CloudyCanvas"

export default function WeatherScreen() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  const isDay =
    weather &&
    Date.now() / 1000 > weather.sys.sunrise &&
    Date.now() / 1000 < weather.sys.sunset

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await getWeatherByCity("São Paulo")
        setWeather(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadWeather()
  }, [])

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex items-center justify-center transition-colors duration-700
        ${
          isDay
            ? "bg-gradient-to-b from-sky-400 to-sky-100"
            : "bg-gradient-to-b from-[#020617] to-[#0f172a]"
        }`}
    >
      {/* 🌦️ Efeitos climáticos */}
      {weather &&
        weather.weather[0].main.toLowerCase().includes("rain") && (
          <RainCanvas />
        )}

      {weather &&
        weather.weather[0].main.toLowerCase().includes("clouds") && (
          <CloudyCanvas />
        )}

      {weather &&
        weather.weather[0].main.toLowerCase().includes("clear") &&
        isDay && <SunCanvas />}

      {/* 📄 Conteúdo */}
      <div
        className={`z-10 text-center transition-colors duration-500 ${
          isDay ? "text-slate-900" : "text-white"
        }`}
      >
        <h1 className="text-4xl font-bold flex items-center gap-2 justify-center">
          Weather App ☁️
        </h1>

        {loading && (
          <p className="mt-1 text-sm text-slate-400">
            Carregando clima...
          </p>
        )}

        {weather && (
          <>
            <p className="mt-1 text-sm capitalize text-slate-500">
              {weather.weather[0].description}
            </p>
            <p className="mt-2 text-xs text-slate-600">
              {weather.name} · {Math.round(weather.main.temp)}°C
            </p>
          </>
        )}
      </div>
    </div>
  )
}
