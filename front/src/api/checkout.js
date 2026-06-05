import api from './client'
export const checkoutApi = {
  createSession: (data) => api.post('/checkout/session', data),
}
