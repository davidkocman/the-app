<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'

// components
import GameItem from './GameItem.vue'

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
    const currentDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), i + 1).toISOString().slice(0, 10)
    days.push({
      hasValidDate: true,
      date: currentDate,
      items: gamesStore.getCurrenthMonthUpcomingGames.filter(game => game.released === currentDate) || []
    })
  }
  return days
})

const nextMonth = () => {
  const now = new Date(currentYearMonth.value)
  const nextMonth = new Date(now.setMonth(now.getMonth() + 1))
  currentYearMonth.value = nextMonth.toISOString().slice(0, 7)
  gamesStore.fetchUpcomingGames(currentYearMonth.value)
}
const prevMonth = () => {
  const now = new Date(currentYearMonth.value)
  const prevMonth = new Date(now.setMonth(now.getMonth() - 1))
  currentYearMonth.value = prevMonth.toISOString().slice(0, 7)
  gamesStore.fetchUpcomingGames(currentYearMonth.value)
}

onBeforeMount(async () => {
  await gamesStore.fetchUpcomingGames(currentYearMonth.value)
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
         <template v-for="(day, index) in currentMonthUpcomingGames" :key="index">
           <div 
             v-if="day.hasValidDate"
             class="current-month-day"
           >
             <span class="text-weight-bold" :class="[day.date && new Date(day.date).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10) ? 'current-day' : '']">
               {{ day.date ? new Date(day.date).toLocaleDateString('sk-SK', { day: 'numeric' }) : '' }}
             </span>
             <template v-if="day.items?.length">
              <div  class="items-wrapper">
                <GameItem v-for="item in day.items.slice(0, 1)" :key="item.id" :item="item" />
              </div>
             </template>
           </div>
           <div v-else class="not-current-month-day"></div>
         </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(7, auto);
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
  .not-current-month-day,
  .current-month-day {
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    border-top-left-radius: 6px;
    border-top-right-radius: 18px;
    background-color: var(--games-weekday-bg);
    border: 1px solid var(--bg-muted);
  }
  .current-month-day {
    min-height: 300px;
    overflow: hidden;
    position: relative;
    span {
      background-color: var(--bg-muted);
      border-bottom-right-radius: 6px;
      display: block;
      left: 0;
      padding: 2px 6px;
      pointer-events: none;
      position: absolute;
      top: 0;
      z-index: 9;
      &.current-day {
        background-color: $primary;
      }
    }
    .items-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      height: 100%;
    }
  }
  .not-current-month-day {
    opacity: 0.2;
  }
}
</style>
