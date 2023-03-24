const URL: string = import.meta.env.VITE_APP_TMDB_REQUEST_URL

const HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_READ_ACCESS_TOKEN}`,
  'content-type': 'application/json;charset=utf-8'
}

export { URL, HEADERS }
