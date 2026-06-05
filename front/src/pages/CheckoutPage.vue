<template>
  <div class="checkout-page">
    <h1>Finalizar Compra</h1>
    <div v-if="!cartStore.items.length" class="empty-state">
      <p>Tu carrito está vacío.</p>
      <RouterLink to="/products" class="btn-primary">Ver Productos</RouterLink>
    </div>
    <div v-else class="checkout-layout">
      <div class="checkout-form-section">
        <h3>Información de Envío</h3>
        <form @submit.prevent="handleCheckout">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre completo</label>
              <input v-model="shipping.fullName" required class="input" />
            </div>
            <div class="form-group">
              <label>Dirección</label>
              <input v-model="shipping.address" required class="input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Ciudad</label><input v-model="shipping.city" required class="input" /></div>
            <div class="form-group"><label>Provincia</label><input v-model="shipping.state" class="input" /></div>
            <div class="form-group"><label>Código Postal</label><input v-model="shipping.zip" class="input" /></div>
          </div>
          <div class="form-group"><label>País</label><input v-model="shipping.country" required class="input" /></div>

          <div class="order-total-row">
            <div class="summary-row"><span>Subtotal</span><span>${{ cartStore.subtotal.toFixed(2) }}</span></div>
            <div v-if="cartStore.discount > 0" class="summary-row discount">
              <span>Discount ({{ cartStore.couponCode }})</span>
              <span>-${{ cartStore.discount.toFixed(2) }}</span>
            </div>
            <div class="summary-row total"><span>Total</span><span>${{ cartStore.total.toFixed(2) }}</span></div>
          </div>

          <p v-if="error" class="form-error">{{ error }}</p>
          <button type="submit" class="btn-primary btn-lg w-full" :disabled="loading">
            {{ loading ? 'Procesando...' : `Pagar $${cartStore.total.toFixed(2)} con Stripe` }}
          </button>
        </form>
      </div>
      <div class="checkout-items">
        <h3>Resumen del Pedido</h3>
        <div v-for="item in cartStore.items" :key="item._id" class="checkout-item">
          <img :src="item.product?.thumbnail" />
          <div>
            <p>{{ item.product?.title }}</p>
            <p class="muted">x{{ item.quantity }} — ${{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { checkoutApi } from '@/api/checkout'

const cartStore = useCartStore()
const loading = ref(false)
const error = ref('')
const shipping = reactive({ fullName: '', address: '', city: '', state: '', country: '', zip: '' })

const handleCheckout = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await checkoutApi.createSession({ shippingAddress: { ...shipping } })
    window.location.href = data.data.url
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al procesar el pago. Inténtalo de nuevo.'
  } finally { loading.value = false }
}
</script>
