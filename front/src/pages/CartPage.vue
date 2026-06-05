<template>
  <div class="cart-page">
    <h1>Carrito de Compras</h1>
    <div v-if="!cartStore.items.length" class="empty-state">
      <p>Tu carrito está vacío.</p>
      <RouterLink to="/products" class="btn-primary">Seguir Comprando</RouterLink>
    </div>
    <div v-else class="cart-layout">
      <div class="cart-items">
        <CartItem
          v-for="item in cartStore.items"
          :key="item._id"
          :item="item"
          @update="cartStore.updateItem(item._id, $event)"
          @remove="cartStore.removeItem(item._id)"
        />
      </div>
      <div class="cart-sidebar">
        <div class="coupon-box">
          <h4>Código de Cupón</h4>
          <div class="coupon-row">
            <input v-model="coupon" placeholder="Ej. JAVIER15" class="input" />
            <button @click="applyCode" class="btn-outline">Apply</button>
          </div>
          <p v-if="cartStore.couponCode" class="coupon-applied">✅ {{ cartStore.couponCode }} applied</p>
        </div>
        <div class="order-summary">
          <h4>Resumen del Pedido</h4>
          <div class="summary-row"><span>Subtotal</span><span>${{ cartStore.subtotal.toFixed(2) }}</span></div>
          <div v-if="cartStore.discount > 0" class="summary-row discount">
            <span>Descuento</span><span>-${{ cartStore.discount.toFixed(2) }}</span>
          </div>
          <div class="summary-row total"><span>Total</span><span>${{ cartStore.total.toFixed(2) }}</span></div>
          <RouterLink to="/checkout" class="btn-primary w-full">Pagar →</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import CartItem from '@/components/cart/CartItem.vue'

const cartStore = useCartStore()
const coupon = ref('')
const applyCode = async () => {
  if (!coupon.value.trim()) return
  const ok = await cartStore.applyCoupon(coupon.value.trim())
  if (ok) coupon.value = ''
}
</script>
