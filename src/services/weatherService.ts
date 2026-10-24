/**
 * PulseCare+ Live Weather & Air Quality Telemetry Service
 * Queries Open-Meteo public endpoints (free, open, CORS-friendly, zero auth required)
 * with robust offline fallbacks.
 */

export interface WeatherTelemetry {
  temperature: number;
  condition: string;
  weatherCode: number;
  aqi: number;
  aqiCategory: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  humidity: number;
  windSpeed: number;
  isLive: boolean;
  locationName?: string;
}

const WMO_CODE_MAP: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing Rime Fog',
  51: 'Light Drizzle',
  53: 'Moderate Drizzle',
  55: 'Dense Drizzle',
  61: 'Slight Rain',
  63: 'Moderate Rain',
  65: 'Heavy Rain',
  71: 'Slight Snow',
  73: 'Moderate Snow',
  75: 'Heavy Snow',
  80: 'Rain Showers',
  81: 'Heavy Showers',
  82: 'Violent Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm & Hail',
  99: 'Severe Thunderstorm'
};

function getAqiCategory(aqi: number): 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous' {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 200) return 'Unhealthy';
  return 'Hazardous';
}

// Generate realistic deterministic fallback weather based on coordinates
export function getFallbackWeather(lat: number, lng: number): WeatherTelemetry {
  const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233));
  // Warm climates (subtropical / tropical) vs temperate
  const isTropical = Math.abs(lat) < 35;
  const temp = isTropical
    ? Math.round(24 + seed * 8)
    : Math.round(14 + seed * 9);
  
  const aqiVal = Math.round(45 + seed * 65);

  return {
    temperature: temp,
    condition: seed > 0.6 ? 'Partly Cloudy' : 'Clear',
    weatherCode: seed > 0.6 ? 2 : 0,
    aqi: aqiVal,
    aqiCategory: getAqiCategory(aqiVal),
    humidity: Math.round(45 + seed * 30),
    windSpeed: Math.round(8 + seed * 10),
    isLive: false
  };
}

export async function fetchLiveWeather(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<WeatherTelemetry> {
  const fallback = getFallbackWeather(lat, lng);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const combinedSignal = signal || controller.signal;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=us_aqi`;

    const [weatherRes, aqiRes] = await Promise.allSettled([
      fetch(weatherUrl, { signal: combinedSignal }),
      fetch(aqiUrl, { signal: combinedSignal })
    ]);

    clearTimeout(timeoutId);

    let temp = fallback.temperature;
    let code = fallback.weatherCode;
    let condition = fallback.condition;
    let humidity = fallback.humidity;
    let windSpeed = fallback.windSpeed;
    let aqi = fallback.aqi;
    let isLive = false;

    if (weatherRes.status === 'fulfilled' && weatherRes.value.ok) {
      const wData = await weatherRes.value.json();
      if (wData.current) {
        temp = Math.round(wData.current.temperature_2m);
        code = wData.current.weather_code ?? 0;
        condition = WMO_CODE_MAP[code] || 'Clear';
        humidity = Math.round(wData.current.relative_humidity_2m ?? 50);
        windSpeed = Math.round(wData.current.wind_speed_10m ?? 10);
        isLive = true;
      }
    }

    if (aqiRes.status === 'fulfilled' && aqiRes.value.ok) {
      const aData = await aqiRes.value.json();
      if (aData.current && typeof aData.current.us_aqi === 'number') {
        aqi = Math.round(aData.current.us_aqi);
        isLive = true;
      }
    }

    return {
      temperature: temp,
      condition,
      weatherCode: code,
      aqi,
      aqiCategory: getAqiCategory(aqi),
      humidity,
      windSpeed,
      isLive
    };
  } catch {
    return fallback;
  }
}
