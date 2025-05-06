<script setup>
import { ref, computed, onBeforeMount } from 'vue'

// store
import useGamesStore from '@/store/games'

const gamesStore = useGamesStore()

const currentYearMonth = ref(new Date().toISOString().slice(0, 7))

const currentMonthUpcomingGames = computed(() => {
  const firstDay = new Date(`${currentYearMonth.value}-01`)
  const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0)
  const days = []
  
  // Get the day of week for the first day (0 = Sunday, 1 = Monday, ...)
  let firstDayOfWeek = firstDay.getDay()
  // Convert Sunday from 0 to 7
  firstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek
  
  // Add empty cells for days before the first day of month
  for (let i = 1; i < firstDayOfWeek; i++) {
    days.push({
      hasValidDate: false,
      date: null
    })
  }
  
  // Add the days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      hasValidDate: true,
      date: new Date(firstDay.getFullYear(), firstDay.getMonth(), i + 1).toISOString().slice(0, 10),
    })
  }
  return days
})

const getDatesInCurrentMonth = () => {
  const start = new Date(currentYearMonth.value)
  const end = new Date(start.getFullYear(), start.getMonth() + 1 , 0)
  const dates = []  
  for (let i = start.getDate(); i <= end.getDate(); i++) {
    dates.push(new Date(start.getFullYear(), start.getMonth(), i + 1).toISOString().slice(0, 10))
  }
  return dates
}

const nextMonth = () => {
  const now = new Date(currentYearMonth.value)
  const nextMonth = new Date(now.setMonth(now.getMonth() + 1))
  currentYearMonth.value = nextMonth.toISOString().slice(0, 7)
  // gamesStore.fetchUpcomingGames(currentYearMonth.value)
}
const prevMonth = () => {
  const now = new Date(currentYearMonth.value)
  const prevMonth = new Date(now.setMonth(now.getMonth() - 1))
  currentYearMonth.value = prevMonth.toISOString().slice(0, 7)
  // gamesStore.fetchUpcomingGames(currentYearMonth.value)
}

onBeforeMount(async () => {
  // await gamesStore.fetchUpcomingGames(currentYearMonth.value)
})
</script>

<template>
  <div class="row">
    <div class="col row justify-between q-mb-md">
      <q-btn @click="prevMonth" :disable="currentYearMonth === new Date().toISOString().slice(0, 7)">Previous month</q-btn>
      <div class="text-weight-bold">{{ new Date(currentYearMonth).toLocaleDateString('en-EN', {month: 'long', year: 'numeric'}) }}</div>
      <q-btn @click="nextMonth">Next month</q-btn>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div class="calendar-grid">
        <!-- Weekday headers -->
        <div class="weekday-header text-weight-bold" v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">
          <span>
            {{ day }}
          </span>
        </div>
        <!-- Calendar days -->
         <template v-for="day in currentMonthUpcomingGames" :key="day.date">
           <div 
             v-if="day.hasValidDate"
             :key="day.date"
             :class="['calendar-day', { 'empty-day': !day }]"
           >
             <span class="text-weight-bold">
               {{ day ? new Date(day.date).toLocaleDateString('sk-SK', { day: 'numeric' }) : '' }}
             </span>
           </div>
           <div v-else></div>
         </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(7, 1fr);
  .weekday-header {
    padding: 12px;
    text-align: center;
    width: auto;
    span {
      background-color: $primary;
      border-radius: 4px;
      color: var(--text-base);
      padding: 4px 8px;
    }
  }
  .calendar-day {
    background-color: var(--games-weekday-bg);
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    border-top-left-radius: 6px;
    border-top-right-radius: 18px;
    border: 1px solid var(--bg-muted);
    min-height: 200px;
    overflow: hidden;
    position: relative;
    &.empty-day {
      background-color: transparent;
      border: none;
    }
    span {
      display: block;
      left: 0;
      padding: 2px 6px;
      position: absolute;
      top: 0;
    }
  }
}
</style>
