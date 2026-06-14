<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: number | null
  readonly?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  rate: [value: number]
}>()

const hoverValue = ref<number | null>(null)

const displayValue = computed(() => {
  return hoverValue.value ?? props.modelValue ?? 0
})

function getFillPercent(starIndex: number) {
  const value = displayValue.value
  const starValue = starIndex + 1

  if (value >= starValue) return 100
  if (value <= starIndex) return 0

  return (value - starIndex) * 100
}

function setHover(event: MouseEvent, starIndex: number) {
  if (props.readonly) return

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const ratio = x / rect.width

  const value = starIndex + (ratio <= 0.5 ? 0.5 : 1)

  hoverValue.value = value
}

function clearHover() {
  hoverValue.value = null
}

function selectRating() {
  if (props.readonly || hoverValue.value === null) return

  emit('update:modelValue', hoverValue.value)
  emit('rate', hoverValue.value)
}
</script>

<template>
  <div
    class="star-rating"
    :class="{ readonly }"
    @mouseleave="clearHover"
  >
    <button
      v-for="index in 5"
      :key="index"
      type="button"
      class="star-button"
      :disabled="readonly"
      @mousemove="setHover($event, index - 1)"
      @click="selectRating"
    >
      <span class="star-empty">★</span>

      <span
        class="star-filled"
        :style="{ width: `${getFillPercent(index - 1)}%` }"
      >
        ★
      </span>
    </button>
  </div>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  gap: 0.2rem;
}

.star-button {
  position: relative;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 2rem;
  line-height: 1;
}

.star-button:disabled {
  cursor: default;
}

.star-empty {
  color: #334155;
}

.star-filled {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  color: #facc15;
  white-space: nowrap;
}

.readonly .star-button {
  pointer-events: none;
}
</style>