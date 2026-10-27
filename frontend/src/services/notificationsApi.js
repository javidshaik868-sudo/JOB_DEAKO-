import { api } from './api';

export const notificationsApi = {
  async getNotifications(category) {
    const endpoint = category && category !== 'all' ? `/notifications?category=${category}` : '/notifications';
    try {
      return await api.get(endpoint);
    } catch (err) {
      if (import.meta.env.DEV) {
        return { notifications: [], unreadCount: 0 };
      }
      throw err;
    }
  },

  async markAsRead(id) {
    try {
      return await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      if (import.meta.env.DEV) {
        return { success: true, id };
      }
      throw err;
    }
  },

  async markAllAsRead() {
    try {
      return await api.post('/notifications/mark-all-read', {});
    } catch (err) {
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw err;
    }
  },
};
