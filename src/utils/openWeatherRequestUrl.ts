const getGeoRequestUrl = (loc: string): string => {
  const URL: string = import.meta.env.VITE_APP_OW_GEO_URL

  return `${URL}?q=${loc}&limit=10&appid=${import.meta.env.VITE_APP_OW_API_KEY}`
}

const getCurrentWeatherRequestUrl = (lat: number, lon: number): string => {
  const URL: string = import.meta.env.VITE_APP_OW_CURRENT_WEATHER_DATA_URL

  return `${URL}?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_APP_OW_API_KEY}&units=metric`
}

const get5DaysForecastRequestUrl = (lat: number, lon: number): string => {
  const URL: string = import.meta.env.VITE_APP_OW_5_DAYS_FORECAST_URL

  return `${URL}?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_APP_OW_API_KEY}&units=metric`
}

const getWeatherIconUrl = (icon: string): string => {
  const URL: string = import.meta.env.VITE_APP_OW_ICON_URL
  return `${URL}/${icon}@2x.png`
}

export { getGeoRequestUrl, getCurrentWeatherRequestUrl, get5DaysForecastRequestUrl, getWeatherIconUrl }
