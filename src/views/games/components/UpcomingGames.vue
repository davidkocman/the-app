<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'

// components
import GameItem from './GameItem.vue'

// store
import useGamesStore from '@/store/games'

const $q = useQuasar()
const gamesStore = useGamesStore()

const currentYearMonth = ref(new Date().toISOString().slice(0, 7))

const minYearMonth = computed(() => {
  const d = new Date()
  d.setMonth(d.getMonth() - 6)
  return d.toISOString().slice(0, 7)
})

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
      items: gamesStore.getCurrenthMonthUpcomingGames.filter((game) => game.released === currentDate) || []
    })
  }
  return days
})

const daysWithGames = computed(() =>
  currentMonthUpcomingGames.value.filter((d) => d.hasValidDate && d.items?.length)
)

const isToday = (date: string | null) =>
  !!date && date === new Date().toISOString().slice(0, 10)

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
    <div class="col row justify-between items-center q-mb-md">
      <q-btn @click="prevMonth" :disable="currentYearMonth <= minYearMonth">Previous month</q-btn>
      <div class="text-weight-bold">
        {{ new Date(currentYearMonth).toLocaleDateString('en-EN', { month: 'long', year: 'numeric' }) }}
      </div>
      <q-btn @click="nextMonth">Next month</q-btn>
    </div>
  </div>

  <!-- Mobile list view -->
  <div v-if="$q.screen.lt.md" class="mobile-games-list">
    <template v-if="daysWithGames.length">
      <div v-for="day in daysWithGames" :key="day.date!" class="mobile-day-row">
        <div class="mobile-day-header" :class="{ 'mobile-day-header--today': isToday(day.date) }">
          <span class="mobile-day-number">
            {{ new Date(day.date!).toLocaleDateString('sk-SK', { day: 'numeric' }) }}
          </span>
          <span class="mobile-day-name">
            {{ new Date(day.date!).toLocaleDateString('en-EN', { weekday: 'long', month: 'short' }) }}
          </span>
        </div>
        <div
          class="mobile-day-games"
          :style="{ gridTemplateColumns: day.items!.length === 1 ? '1fr' : 'repeat(2, 1fr)' }"
        >
          <GameItem v-for="item in day.items!.slice(0, 4)" :key="item.id" :item="item" />
        </div>
      </div>
    </template>
    <div v-else class="text-center q-py-xl text-grey-6">
      No games releasing this month
    </div>
  </div>

  <!-- Desktop calendar grid -->
  <div v-else class="row">
    <div class="col">
      <div class="calendar-grid">
        <!-- Weekday headers -->
        <div
          class="weekday-header text-weight-bold"
          v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
          :key="day"
        >
          <span>{{ day }}</span>
        </div>
        <!-- Calendar days -->
        <template v-for="(day, index) in currentMonthUpcomingGames" :key="index">
          <div v-if="day.hasValidDate" class="current-month-day">
            <span
              class="text-weight-bold"
              :class="[isToday(day.date) ? 'current-day' : '']"
            >
              {{ day.date ? new Date(day.date).toLocaleDateString('sk-SK', { day: 'numeric' }) : '' }}
            </span>
            <template v-if="day.items?.length">
              <div
                class="items-wrapper"
                :style="{ gridTemplateColumns: day.items.length === 1 ? '1fr' : 'repeat(2, 1fr)' }"
              >
                <GameItem v-for="item in day.items.slice(0, 4)" :key="item.id" :item="item" />
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
.mobile-games-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-day-row {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--bg-muted);
}

.mobile-day-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background-color: var(--bg-muted);

  &--today {
    background-color: $primary;
    .mobile-day-number,
    .mobile-day-name {
      color: var(--text-base);
    }
  }
}

.mobile-day-number {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
  min-width: 2rem;
}

.mobile-day-name {
  font-size: 0.85rem;
  opacity: 0.75;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mobile-day-games {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;

  :deep(.game-item) {
    border-radius: 0;
  }

  :deep(.game-item:last-child:nth-child(odd)) {
    grid-column: 1 / -1;
  }
}

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
      grid-template-columns: repeat(2, 1fr);
      height: 100%;
      :deep(.game-item:last-child:nth-child(odd)) {
        grid-column: 1 / -1;
      }
    }
  }
  .not-current-month-day {
    opacity: 0.2;
  }
}
</style>
