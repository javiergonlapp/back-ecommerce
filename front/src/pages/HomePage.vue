<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>Productos Premium,<br /><span class="gradient-text">Calidad Insuperable</span></h1>
        <p>Descubre nuestra colección de productos premium.</p>
        <RouterLink to="/products" class="btn-primary btn-lg">Comprar Ahora</RouterLink>
      </div>
      <img src="/images/sneakers.png" alt="hero" class="hero-img" />
    </section>

    <section class="featured-section">
      <h2>Productos Destacados</h2>
      <div v-if="loading" class="product-grid">
        <SkeletonCard v-for="i in 4" :key="i" />
      </div>
      <div v-else class="product-grid">
        <ProductCard v-for="p in products" :key="p._id" :product="p" />
      </div>
      <RouterLink to="/products" class="btn-outline mt-4">Ver Todos los Productos →</RouterLink>
    </section>

    <section class="coupon-banner">
      <div class="coupon-inner">
        <span class="coupon-tag">OFERTA EXCLUSIVA</span>
        <h3>Use code <strong>JAVIER15</strong> para 15% de descuento en tu pedido!</h3>
        <RouterLink to="/products" class="btn-primary">Comprar y Ahorrar</RouterLink>
      </div>
    </section>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { storeToRefs } from 'pinia'
import ProductCard from '@/components/products/ProductCard.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'

const store = useProductsStore()
const { products, loading } = storeToRefs(store)
onMounted(() => store.fetchProducts({ limit: 8 }))
</script>
