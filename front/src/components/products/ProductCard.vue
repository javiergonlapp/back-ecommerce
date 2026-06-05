<template>
  <div class="product-card" @click="$router.push(`/products/${product._id}`)">
    <div class="product-img-wrap">
      <img :src="product.thumbnail || '/images/sneakers.png'" :alt="product.title" loading="lazy" />
      <span v-if="product.stock === 0" class="badge-out">Sin Stock</span>
    </div>
    <div class="product-info">
      <p class="product-brand">{{ product.brand || product.category?.name }}</p>
      <h3 class="product-title">{{ product.title }}</h3>
      <div class="product-footer">
        <span class="product-price">${{ product.price?.toFixed(2) }}</span>
        <button
          class="btn-add-cart"
          :disabled="product.stock === 0"
          @click.stop="cartStore.addItem(product._id)"
        >
          {{ product.stock === 0 ? 'Agotado' : 'Agregar al Carrito' }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useCartStore } from '@/stores/cart'
const cartStore = useCartStore()
defineProps({ product: Object })
</script>
