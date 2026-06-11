<script setup lang="ts">
import { NOTE_COLORS } from '@/utils/noteColors'

defineProps<{ modelValue: string | null }>()
defineEmits<{ (e: 'update:modelValue', value: string | null): void }>()
</script>

<template>
  <div class="note-color-picker flex items-center" style="gap: 8px">
    <span class="text-caption text-grey-7">Color</span>
    <button
      type="button"
      class="swatch swatch--none"
      :class="{ 'swatch--active': modelValue === null }"
      title="No color"
      data-cy="note-color-none"
      @click="$emit('update:modelValue', null)"
    >
      <q-icon name="block" size="14px" />
    </button>
    <button
      v-for="c in NOTE_COLORS"
      :key="c.key"
      type="button"
      class="swatch"
      :class="{ 'swatch--active': modelValue === c.key }"
      :style="{ backgroundColor: c.value }"
      :title="c.label"
      :data-cy="`note-color-${c.key}`"
      @click="$emit('update:modelValue', c.key)"
    />
  </div>
</template>

<style lang="scss" scoped>
.swatch {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  outline: none;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;

  &:hover {
    transform: scale(1.12);
  }

  &--none {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border-color: rgba(127, 127, 127, 0.5);
    color: rgba(127, 127, 127, 0.8);
  }

  &--active {
    border-color: currentColor;
    box-shadow: 0 0 0 2px var(--q-primary);
  }
}
</style>
