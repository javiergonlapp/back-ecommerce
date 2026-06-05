import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api/cart'
import { useToastStore } from './toast'

export const useCartStore = defineStore('cart', () => {
  const cart = ref(null)
  const loading = ref(false)

  const items = computed(() => cart.value?.items || [])
  const itemCount = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.quantity, 0))
  const discount = computed(() => cart.value?.discount || 0)
  const total = computed(() => Math.max(0, subtotal.value - discount.value))
  const couponCode = computed(() => cart.value?.couponCode || null)

  const fetchCart = async () => {
    loading.value = true
    try {
      const { data } = await cartApi.get()
      cart.value = data.data.cart
    } catch {} finally { loading.value = false }
  }

  const addItem = async (productId, quantity = 1) => {
    const toast = useToastStore()
    try {
      const { data } = await cartApi.addItem(productId, quantity)
      cart.value = data.data.cart
      toast.success('¡Agregado al carrito!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al agregar el producto')
    }
  }

  const updateItem = async (itemId, quantity) => {
    try {
      const { data } = await cartApi.updateItem(itemId, quantity)
      cart.value = data.data.cart
    } catch {}
  }

  const removeItem = async (itemId) => {
    try {
      const { data } = await cartApi.removeItem(itemId)
      cart.value = data.data.cart
    } catch {}
  }

  const applyCoupon = async (code) => {
    const toast = useToastStore()
    try {
      const { data } = await cartApi.applyCoupon(code)
      cart.value = data.data.cart
      toast.success('¡Cupón aplicado!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cupón inválido')
      return false
    }
  }

  const clear = async () => {
    try { await cartApi.clear(); cart.value = null } catch {}
  }

  return { cart, loading, items, itemCount, subtotal, discount, total, couponCode, fetchCart, addItem, updateItem, removeItem, applyCoupon, clear }
})
