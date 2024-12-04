type SearchResult = {
  country: string
  lat: number
  local_names: object
  lon: number
  name: string
  state?: string
}

type Coordinates = {
  lat: number | null
  lon: number | null
}

type SavedLocation = {
  lat: number
  lon: number
  name: string
  region: string
}

type Weather = {
  id: number
  main: string
  description: string
  icon: string
}

type CurrentWeatherData = {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<Weather>
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level: number
    grnd_level: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust: number
  }
  rain?: {
    '1h'?: number
    '3h'?: number
  }
  snow?: {
    '1h'?: number
    '3h'?: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

type Forecast = {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
  }
  weather: Array<Weather>
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust: number
  }
  visibility: number
  pop: number
  rain?: {
    '3h'?: number
  }
  snow?: {
    '3h'?: number
  }
  sys: {
    pod: string
  }
  dt_txt: string
}

type ForecastData = {
  cod: string
  message: number
  cnt: number
  list: Array<Forecast>
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

export type { SearchResult, SavedLocation, Coordinates, CurrentWeatherData, ForecastData, Forecast }
