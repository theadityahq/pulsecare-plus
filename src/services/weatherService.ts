/**
 * PulseCare+ Truthful Weather & Air Quality Telemetry Service
 * Queries Open-Meteo public endpoints with strict zero-simulation rules.
 * Never invents fake weather or AQI values. If network fails and no cached data exists, returns null.
 */

export type AqiCategory =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

export interface WeatherTelemetry {
  temperature: number | null;
  condition: string;
  weatherCode: number | null;
  aqi: number | null;
  aqiCategory: AqiCategory | null;
  humidity: number | null;
  windSpeed: number | null;
  isWeatherFresh: boolean;
  isAqiFresh: boolean;
  lastFetchedAt: string; // ISO 8601
  source: string;
}

export const WMO_CODE_MAP: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

export function getWmoCondition(code: number | null | undefined): string {
  if (code === null || code === undefined) return 'Unknown conditions';
  return WMO_CODE_MAP[code] || 'Unknown conditions';
}

export function getAqiCategory(aqi: number | null | undefined): AqiCategory | null {
  if (aqi === null || aqi === undefined || isNaN(aqi)) return null;
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function combineSignals(signalA?: AbortSignal, signalB?: AbortSignal): AbortSignal | undefined {
  if (!signalA) return signalB;
  if (!signalB) return signalA;
  if (typeof (AbortSignal as any).any === 'function') {
    return (AbortSignal as any).any([signalA, signalB]);
  }
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signalA.addEventListener('abort', onAbort, { once: true });
  signalB.addEventListener('abort', onAbort, { once: true });
  return controller.signal;
}

const CACHE_KEY_PREFIX = 'pulsecare_weather_cache_';
const MAX_STALE_MS = 30 * 60 * 1000; // 30 minutes

export function getCachedWeather(lat: number, lng: number): WeatherTelemetry | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}${lat.toFixed(2)}_${lng.toFixed(2)}`);
    if (!raw) return null;
    const parsed: WeatherTelemetry = JSON.parse(raw);
    const ageMs = Date.now() - new Date(parsed.lastFetchedAt).getTime();
    const isFresh = ageMs < MAX_STALE_MS;
    return {
      ...parsed,
      isWeatherFresh: isFresh && parsed.temperature !== null,
      isAqiFresh: isFresh && parsed.aqi !== null
    };
  } catch {
    return null;
  }
}

export function setCachedWeather(lat: number, lng: number, data: WeatherTelemetry): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(
      `${CACHE_KEY_PREFIX}${lat.toFixed(2)}_${lng.toFixed(2)}`,
      JSON.stringify(data)
    );
  } catch {
    // quota exceeded or storage blocked
  }
}

export async function fetchLiveWeather(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<WeatherTelemetry | null> {
  const cached = getCachedWeather(lat, lng);

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), 4500);
  const combinedSignal = combineSignals(signal, timeoutController.signal);

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=us_aqi`;

  let weatherOk = false;
  let aqiOk = false;

  let temperature: number | null = cached?.temperature ?? null;
  let weatherCode: number | null = cached?.weatherCode ?? null;
  let condition = cached?.condition ?? 'Unknown conditions';
  let humidity: number | null = cached?.humidity ?? null;
  let windSpeed: number | null = cached?.windSpeed ?? null;
  let aqi: number | null = cached?.aqi ?? null;

  try {
    const [weatherRes, aqiRes] = await Promise.allSettled([
      fetch(weatherUrl, { signal: combinedSignal }),
      fetch(aqiUrl, { signal: combinedSignal })
    ]);

    clearTimeout(timeoutId);

    if (weatherRes.status === 'fulfilled' && weatherRes.value.ok) {
      const wData = await weatherRes.value.json();
      if (wData.current) {
        temperature = Math.round(wData.current.temperature_2m);
        weatherCode = wData.current.weather_code ?? null;
        condition = getWmoCondition(weatherCode);
        humidity = Math.round(wData.current.relative_humidity_2m ?? 0);
        windSpeed = Math.round(wData.current.wind_speed_10m ?? 0);
        weatherOk = true;
      }
    }

    if (aqiRes.status === 'fulfilled' && aqiRes.value.ok) {
      const aData = await aqiRes.value.json();
      if (aData.current && typeof aData.current.us_aqi === 'number') {
        aqi = Math.round(aData.current.us_aqi);
        aqiOk = true;
      }
    }
  } catch {
    clearTimeout(timeoutId);
  }

  // If both requests failed and we have no cached data at all, return null (truthful: no fake weather!)
  if (!weatherOk && !aqiOk && !cached) {
    return null;
  }

  const result: WeatherTelemetry = {
    temperature,
    condition: weatherOk ? condition : (cached?.condition || 'Unknown conditions'),
    weatherCode,
    aqi,
    aqiCategory: getAqiCategory(aqi),
    humidity,
    windSpeed,
    isWeatherFresh: weatherOk,
    isAqiFresh: aqiOk,
    lastFetchedAt: weatherOk || aqiOk ? new Date().toISOString() : (cached?.lastFetchedAt || new Date().toISOString()),
    source: 'Open-Meteo Public API'
  };

  if (weatherOk || aqiOk) {
    setCachedWeather(lat, lng, result);
  }

  return result;
}
