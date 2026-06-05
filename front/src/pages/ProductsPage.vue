<template>
  <div class="products-page">
    <div class="products-layout">
      <ProductFilters :categories="store.categories" @filter="onFilter" />
      <div class="products-main">
        <div class="products-toolbar">
          <input v-model="search" @input="debouncedSearch" placeholder="Buscar productos..." class="input search-input" />
          <p class="results-count">{{ store.pagination.total }} productos encontrados</p>
        </div>
        <div v-if="store.loading" class="product-grid">
          <SkeletonCard v-for="i in 12" :key="i" />
        </div>
        <div v-else-if="!store.products.length" class="empty-state">
          <p>No productos encontrados. Try adjusting your filters.</p>
        </div>
        <div v-else class="product-grid">
          <ProductCard v-for="p in store.products" :key="p._id" :product="p" />
        </div>
        <Pagination :page="store.pagination.page" :pages="store.pagination.pages" @change="onPage" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/products/ProductCard.vue'
import ProductFilters from '@/components/products/ProductFilters.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import Pagination from '@/components/ui/Pagination.vue'

const store = useProductsStore()
const search = ref('')
const currentFilters = ref({})
let searchTimer = null

onMounted(() => { store.fetchCategories(); store.fetchProducts() })

const onFilter = (filters) => {
  currentFilters.value = filters
  store.fetchProducts({ ...filters, search: search.value, page: 1 })
}

const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => store.fetchProducts({ ...currentFilters.value, search: search.value, page: 1 }), 400)
}

const onPage = (page) => store.fetchProducts({ ...currentFilters.value, search: search.value, page })
</script>
