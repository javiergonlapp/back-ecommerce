import api from './client'
export const ordersApi = {
  myOrders: (params) => api.get('/orders/my', { params }),
  detail: (id) => api.get(`/orders/${id}`),
  adminList: (params) => api.get('/orders', { params }),
  updateStatus: (id, status, note) => api.patch(`/orders/${id}/status`, { status, note }),
}
