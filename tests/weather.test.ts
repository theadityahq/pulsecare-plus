import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getWmoCondition,
  getAqiCategory,
  WMO_CODE_MAP,
  fetchLiveWeather,
  WeatherTelemetry
} from '../src/services/weatherService';

describe('Weather & AQI Telemetry Truthfulness', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('correctly maps standard and edge WMO weather codes to official descriptions', () => {
    expect(getWmoCondition(0)).toBe('Clear sky');
    expect(getWmoCondition(51)).toBe('Light drizzle');
    expect(getWmoCondition(56)).toBe('Light freezing drizzle');
    expect(getWmoCondition(66)).toBe('Light freezing rain');
    expect(getWmoCondition(77)).toBe('Snow grains');
    expect(getWmoCondition(85)).toBe('Slight snow showers');
    expect(getWmoCondition(95)).toBe('Thunderstorm');
    expect(getWmoCondition(999)).toBe('Unknown conditions');
    expect(getWmoCondition(null)).toBe('Unknown conditions');
  });

  it('maps AQI values into all 6 official EPA categories', () => {
    expect(getAqiCategory(25)).toBe('Good');
    expect(getAqiCategory(50)).toBe('Good');
    expect(getAqiCategory(51)).toBe('Moderate');
    expect(getAqiCategory(100)).toBe('Moderate');
    expect(getAqiCategory(101)).toBe('Unhealthy for Sensitive Groups');
    expect(getAqiCategory(150)).toBe('Unhealthy for Sensitive Groups');
    expect(getAqiCategory(151)).toBe('Unhealthy');
    expect(getAqiCategory(200)).toBe('Unhealthy');
    expect(getAqiCategory(201)).toBe('Very Unhealthy');
    expect(getAqiCategory(300)).toBe('Very Unhealthy');
    expect(getAqiCategory(301)).toBe('Hazardous');
    expect(getAqiCategory(450)).toBe('Hazardous');
    expect(getAqiCategory(null)).toBeNull();
  });

  it('returns null instead of fabricated data when network fails and no cache exists', async () => {
    // Mock global fetch to reject
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network offline'));
    globalThis.fetch = fetchMock;

    const result = await fetchLiveWeather(28.5672, 77.2100);
    // Strict truthfulness: must NOT fabricate random sine-wave weather!
    expect(result).toBeNull();
  });
});
