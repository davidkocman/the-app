// utils
import dayjs from 'dayjs'

// types
import type { Forecast } from '@/types/weather'
type Group = {
  title: string
  cols: number
}

// --------------------------------------------------------------------

// Capitalize Text
// ----------------------------------
const capitalize = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

// Calculate Percent
// ----------------------------------
const calculatePercentage = (value: number, total: number) => Math.round((value / total) * 100)

const calculateValueFromPercentage = (percentage: number, total: number) => Math.round((percentage * total) / 100)

// Remove Duplicate Elements from array
// ----------------------------------
const removeDuplicates = (arr: Array<string | object>) => [...new Set(arr)]

// Sort Elements By Certain Property
// ----------------------------------
const sortBy = (arr: Array<object>, key: string) => {
  if (arr.length > 1) {
    return arr.sort((a, b) =>
      a[key as keyof object] > b[key as keyof object] ? 1 : a[key as keyof object] < b[key as keyof object] ? -1 : 0
    )
  }
  console.log('Array has to have at least 2 object elements')
}

// Wait for a Certain Amount of Time
// ----------------------------------
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

// Extract data from an array of objects
// ----------------------------------
const extract = (objs: Array<object>, key: string) => objs.map((obj) => obj[key as keyof object])

// Check if a date is a weekday
// ----------------------------------
const isWeekday = (d: Date) => d.getDay() % 6 !== 0

// Check if an array is empty
// ----------------------------------
const isArrayEmpty = (arr: unknown[]) => Array.isArray(arr) && !arr.length

// Check if an object/array is empty
// ----------------------------------
const isObjectEmpty = (obj: object) => obj && Object.keys(obj).length === 0

// Group an array of objects by a key
// ----------------------------------
const groupByKey = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): Record<string, T[]> =>
  arr.reduce((acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc), {} as Record<string, T[]>)

// Sort an array of items by given key
// ----------------------------------
const sortByKey = <T extends Record<string, any>, K extends keyof T>(arr: T[], k: K): T[] =>
  arr.concat().sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0))

// Calculate the number of difference days between two dates
// ----------------------------------
const daysDiff = (date: Date, otherDate: Date) =>
  Math.ceil(Math.abs(date.valueOf() - otherDate.valueOf()) / (1000 * 60 * 60 * 24))

// Calculate the number of months between two dates
// ----------------------------------
const monthDiff = (startDate: Date, endDate: Date) =>
  Math.max(0, (endDate.getFullYear() - startDate.getFullYear()) * 12 - startDate.getMonth() + endDate.getMonth())

// Get local time string from unix timestamp
// ----------------------------------
const timeFromUnix = (timestamp: number, timezone: number) =>
  `${new Date((timestamp + timezone) * 1e3).getHours() + new Date().getTimezoneOffset() / 60}:${String(
    new Date((timestamp + timezone) * 1e3).getMinutes()
  ).padStart(2, '0')}`

const sunProgress = (sunrise: number, sunset: number, timezone: number) => {
  const time = new Date().getHours() * 60 + new Date().getMinutes() + timezone / 60
  const rise = new Date((sunrise + timezone) * 1e3).getHours() * 60 + new Date((sunrise + timezone) * 1e3).getMinutes()
  const set = new Date((sunset + timezone) * 1e3).getHours() * 60 + new Date((sunset + timezone) * 1e3).getMinutes()
  const currentTime = time >= 1440 ? time - 1440 : time
  if (currentTime >= rise && currentTime <= set) {
    const sunTimeDuration = set - rise
    return calculatePercentage(currentTime - rise, sunTimeDuration)
  }
  return null
}

const xAxisGroups = (list: Forecast[]) => {
  const arrOfDates: string[] = []

  list.forEach((item: Forecast) => {
    arrOfDates.push(dayjs(item.dt * 1000).format('dddd'))
  })

  // get unique days
  const uniqueValues = new Set(arrOfDates)
  const uniqueDays = [...uniqueValues]

  // get occurrences
  const valueCounts = new Map<string, number>()
  arrOfDates.forEach((value) => {
    if (valueCounts.has(value)) {
      valueCounts.set(value, valueCounts.get(value)! + 1)
    } else {
      valueCounts.set(value, 1)
    }
  })
  let countsArray: number[] = []
  countsArray = Array.from(valueCounts.values())

  // get groups
  const groups: Group[] = []
  uniqueDays.forEach((item, index) => {
    groups.push({ title: item, cols: countsArray[index] })
  })

  return groups
}

const thousandSeparator = (n: string) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const buttonLabel = (val: string) => {
  return window.innerWidth < 768 ? '' : val
}

export {
  capitalize,
  calculatePercentage,
  calculateValueFromPercentage,
  removeDuplicates,
  sortBy,
  wait,
  extract,
  isWeekday,
  isArrayEmpty,
  isObjectEmpty,
  groupByKey,
  sortByKey,
  daysDiff,
  monthDiff,
  timeFromUnix,
  sunProgress,
  xAxisGroups,
  thousandSeparator,
  buttonLabel
}
