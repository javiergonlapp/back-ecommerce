<template>
  <transition name="drawer">
    <div v-if="open" class="drawer-overlay" @click.self="$emit('close')">
      <div class="cart-drawer">
        <div class="drawer-header">
          <h2>Tu Carrito ({{ cartStore.itemCount }})</h2>
          <button @click="$emit('close')">✕</button>
        </div>

        <div v-if="!cartStore.items.length" class="drawer-empty">
          <p>Tu carrito está vacío</p>
          <RouterLink to="/products" @click="$emit('close')" class="btn-primary">Ver Productos</RouterLink>
        </div>

        <div v-else class="drawer-body">
          <CartItem
            v-for="item in cartStore.items"
            :key="item._id"
            :item="item"
            @update="cartStore.updateItem(item._id, $event)"
            @remove="cartStore.removeItem(item._id)"
          />

          <div class="coupon-row">
            <input v-model="couponInput" placeholder="Código de cupón" class="input" />
            <button @click="applyCode" class="btn-outline">Aplicar</button>
          </div>

          <div class="cart-summary">
            <div class="summary-row"><span>Subtotal</span><span>${{ cartStore.subtotal.toFixed(2) }}</span></div>
            <div v-if="cartStore.discount > 0" class="summary-row discount">
              <span>Descuento ({{ cartStore.couponCode }})</span>
              <span>-${{ cartStore.discount.toFixed(2) }}</span>
            </div>
            <div class="summary-row total"><span>Total</span><span>${{ cartStore.total.toFixed(2) }}</span></div>
          </div>

          <RouterLink to="/checkout" @click="$emit('close')" class="btn-primary w-full">
            Ir al Pago
          </RouterLink>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import CartItem from './CartItem.vue'

defineProps({ open: Boolean })
defineEmits(['close'])
const cartStore = useCartStore()
const couponInput = ref('')

const applyCode = async () => {
  if (!couponInput.value.trim()) return
  const ok = await cartStore.applyCoupon(couponInput.value.trim())
  if (ok) couponInput.value = ''
}
</script>
