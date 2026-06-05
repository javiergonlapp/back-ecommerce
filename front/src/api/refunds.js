import api from './client'
export const refundsApi = {
  request: (orderId, reason) => api.post('/refunds', { orderId, reason }),
  myRefunds: () => api.get('/refunds/my'),
  adminList: () => api.get('/refunds'),
  approve: (id, adminNote) => api.patch(`/refunds/${id}/approve`, { adminNote }),
  reject: (id, adminNote) => api.patch(`/refunds/${id}/reject`, { adminNote }),
}
