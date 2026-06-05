<template>
  <aside class="filters">
    <h3>Filtros</h3>

    <div class="filter-group">
      <label>Categoría</label>
      <select v-model="localFilters.category" @change="emit">
        <option value="">Todas las categorías</option>
        <option v-for="c in categories" :key="c._id" :value="c.slug">{{ c.name }}</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Ordenar por</label>
      <select v-model="localFilters.sort" @change="emit">
        <option value="">Por defecto</option>
        <option value="price_asc">Precio: Menor a Mayor</option>
        <option value="price_desc">Precio: Mayor a Menor</option>
        <option value="newest">Más recientes</option>
        <option value="rating">Mejor valorados</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Precio mínimo</label>
      <input type="number" v-model.number="localFilters.minPrice" @input="emit" placeholder="$0" />
    </div>

    <div class="filter-group">
      <label>Precio máximo</label>
      <input type="number" v-model.number="localFilters.maxPrice" @input="emit" placeholder="$999" />
    </div>

    <button class="btn-outline" @click="reset">Limpiar</button>
  </aside>
</template>
<script setup>
import { reactive } from 'vue'
const props = defineProps({ categories: Array })
const emits = defineEmits(['filter'])
const localFilters = reactive({ category: '', sort: '', minPrice: '', maxPrice: '' })
const emit = () => emits('filter', { ...localFilters })
const reset = () => {
  Object.assign(localFilters, { category: '', sort: '', minPrice: '', maxPrice: '' })
  emits('filter', {})
}
</script>
