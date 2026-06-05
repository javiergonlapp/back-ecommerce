<template>
  <div class="cart-item">
    <img :src="item.product?.thumbnail || '/images/sneakers.png'" :alt="item.product?.title" />
    <div class="item-info">
      <p class="item-title">{{ item.product?.title }}</p>
      <p class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</p>
      <div class="qty-control">
        <button @click="$emit('update', item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
        <span>{{ item.quantity }}</span>
        <button @click="$emit('update', item.quantity + 1)">+</button>
      </div>
    </div>
    <button class="remove-btn" @click="$emit('remove')">✕</button>
  </div>
</template>
<script setup>
defineProps({ item: Object })
defineEmits(['update', 'remove'])
</script>
