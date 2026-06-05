<template>
  <div :class="['spinner-wrap', { 'spinner-wrap--full': full }]">
    <div class="spinner"></div>
    <p v-if="text" class="spinner-text">{{ text }}</p>
  </div>
</template>
<script setup>
defineProps({ full: Boolean, text: String })
</script>
