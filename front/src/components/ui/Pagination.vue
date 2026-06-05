<template>
  <div class="pagination" v-if="pages > 1">
    <button :disabled="page <= 1" @click="$emit('change', page - 1)">←</button>
    <button
      v-for="p in visiblePages"
      :key="p"
      :class="{ active: p === page }"
      @click="$emit('change', p)"
    >{{ p }}</button>
    <button :disabled="page >= pages" @click="$emit('change', page + 1)">→</button>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ page: Number, pages: Number })
defineEmits(['change'])
const visiblePages = computed(() => {
  const arr = []
  for (let i = Math.max(1, props.page - 2); i <= Math.min(props.pages, props.page + 2); i++) arr.push(i)
  return arr
})
</script>
