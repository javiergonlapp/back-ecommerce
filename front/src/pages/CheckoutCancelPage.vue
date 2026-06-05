<template>
  <div class="result-page">
    <div class="result-card cancel">
      <div class="result-icon">❌</div>
      <h1>Pago Cancelado</h1>
      <p>El pago fue cancelado. Tu carrito sigue guardado.</p>
      <div class="result-actions">
        <RouterLink to="/cart" class="btn-primary">Volver al Carrito</RouterLink>
        <RouterLink to="/products" class="btn-outline">Seguir Comprando</RouterLink>
      </div>
    </div>
  </div>
</template>
