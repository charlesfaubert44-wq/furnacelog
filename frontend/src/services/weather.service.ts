/**
 * Weather Service
 * Fetches real-time weather for northern Canadian cities
 */

export interface CityWeather {
  city: string;
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
}

const CITIES = {
  whitehorse: { name: 'Whitehorse', lat: 60.7212, lon: -135.0568 },
  yellowknife: { name: 'Yellowknife', lat: 62.4540, lon: -114.3718 },
  iqaluit: { name: 'Iqaluit', lat: 63.7467, lon: -68.5170 }
};

/**
 * Fetch weather for all three northern cities
 * Uses OpenWeatherMap free API
 */
export const fetchNorthernWeather = async (): Promise<CityWeather[]> => {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (!API_KEY) {
    // Return mock data if no API key
    return getMockWeather();
  }

  try {
    const weatherPromises = Object.values(CITIES).map(async (city) => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch weather for ${city.name}`);
      }

      const data = await response.json();

      return {
        city: city.name,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon
      };
    });

    return await Promise.all(weatherPromises);
  } catch (error) {
    console.error('Weather fetch failed, using mock data:', error);
    return getMockWeather();
  }
};

/**
 * Mock weather data for development/fallback
 */
const getMockWeather = (): CityWeather[] => {
  return [
    {
      city: 'Whitehorse',
      temp: -28,
      feelsLike: -35,
      description: 'clear sky',
      icon: '01n'
    },
    {
      city: 'Yellowknife',
      temp: -32,
      feelsLike: -41,
      description: 'light snow',
      icon: '13n'
    },
    {
      city: 'Iqaluit',
      temp: -38,
      feelsLike: -48,
      description: 'overcast clouds',
      icon: '04n'
    }
  ];
};

export default {
  fetchNorthernWeather
};
