<template>
  <div class="product-detail-page">
    <LoadingSpinner v-if="store.loading" full />
    <div v-else-if="store.product" class="product-detail">
      <div class="product-gallery">
        <img :src="activeImg" :alt="store.product.title" class="main-img" />
        <div class="thumbnails">
          <img
            v-for="(img, i) in store.product.images"
            :key="i"
            :src="img"
            :class="{ active: activeImg === img }"
            @click="activeImg = img"
          />
        </div>
      </div>
      <div class="product-info-detail">
        <p class="product-brand">{{ store.product.brand }}</p>
        <h1>{{ store.product.title }}</h1>
        <div class="rating">
          <span>⭐ {{ store.product.rating?.toFixed(1) }}</span>
          <span class="muted">({{ store.product.reviewCount }} reseñas)</span>
        </div>
        <div class="price-block">
          <span class="price">${{ store.product.price?.toFixed(2) }}</span>
          <span v-if="store.product.originalPrice > store.product.price" class="original-price">
            ${{ store.product.originalPrice?.toFixed(2) }}
          </span>
        </div>
        <p class="description">{{ store.product.description }}</p>
        <div class="stock-info" :class="{ 'out-of-stock': store.product.stock === 0 }">
          {{ store.product.stock > 0 ? `${store.product.stock} en stock` : 'Sin stock' }}
        </div>
        <div class="qty-selector">
          <button @click="qty = Math.max(1, qty - 1)">−</button>
          <span>{{ qty }}</span>
          <button @click="qty = Math.min(store.product.stock, qty + 1)">+</button>
        </div>
        <button
          class="btn-primary btn-lg w-full"
          :disabled="store.product.stock === 0"
          @click="addToCart"
        >Agregar al Carrito</button>
        <RouterLink to="/products" class="btn-outline w-full mt-2">← Volver a Productos</RouterLink>
      </div>
    </div>
    <div v-else class="empty-state"><p>Producto no encontrado.</p></div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const store = useProductsStore()
const cartStore = useCartStore()
const qty = ref(1)
const activeImg = ref('')

onMounted(() => store.fetchProduct(route.params.id))
watch(() => store.product, (p) => { if (p) activeImg.value = p.thumbnail || p.images?.[0] || '' })

const addToCart = () => cartStore.addItem(store.product._id, qty.value)
</script>
