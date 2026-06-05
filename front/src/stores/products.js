import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productsApi } from '@/api/products'
import { categoriesApi } from '@/api/categories'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const product = ref(null)
  const categories = ref([])
  const pagination = ref({ total: 0, page: 1, limit: 12, pages: 1 })
  const loading = ref(false)

  const fetchProducts = async (params = {}) => {
    loading.value = true
    try {
      const { data } = await productsApi.list(params)
      products.value = data.data
      pagination.value = data.pagination
    } finally { loading.value = false }
  }

  const fetchProduct = async (id) => {
    loading.value = true
    try {
      const { data } = await productsApi.detail(id)
      product.value = data.data.product
    } finally { loading.value = false }
  }

  const fetchCategories = async () => {
    const { data } = await categoriesApi.list()
    categories.value = data.data.categories
  }

  return { products, product, categories, pagination, loading, fetchProducts, fetchProduct, fetchCategories }
})
