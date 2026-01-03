const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getWeatherByCity(city) {
  const response = await fetch(
    `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar clima");
  }

  return response.json();
}
