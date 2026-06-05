import api from './client'
export const couponsApi = {
  list: () => api.get('/coupons'),
  validate: (code, orderAmount) => api.post('/coupons/validate', { code, orderAmount }),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  remove: (id) => api.delete(`/coupons/${id}`),
}
