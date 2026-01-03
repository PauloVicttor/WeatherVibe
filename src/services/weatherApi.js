const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const FORECAST_URL = import.meta.env.VITE_FORECAST_URL;

export async function getWeatherByCity(city) {
  const response = await fetch(
    `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar clima atual");
  }

  return response.json();
}

export async function getForecastByCity(city) {
  const response = await fetch(
    `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar previsão");
  }

  return response.json();
}