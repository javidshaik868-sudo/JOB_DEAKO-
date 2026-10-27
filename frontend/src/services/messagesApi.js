import { api } from './api';

export const messagesApi = {
  async getConversations() {
    try {
      return await api.get('/messages/conversations');
    } catch (err) {
      if (import.meta.env.DEV) {
        return { conversations: [] };
      }
      throw err;
    }
  },

  async getMessages(conversationId) {
    try {
      return await api.get(`/messages/${conversationId}`);
    } catch (err) {
      if (import.meta.env.DEV) {
        return { messages: [] };
      }
      throw err;
    }
  },

  async sendMessage(conversationId, text) {
    try {
      return await api.post(`/messages/${conversationId}`, { text });
    } catch (err) {
      if (import.meta.env.DEV) {
        return {
          id: 'msg-' + Date.now(),
          conversationId,
          text,
          sender: 'me',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      throw err;
    }
  },
};

export const jobAlertsApi = {
  async getAlerts() {
    try {
      return await api.get('/job-alerts');
    } catch (err) {
      if (import.meta.env.DEV) {
        const stored = localStorage.getItem('jobdheko_dev_alerts');
        if (stored) return JSON.parse(stored);
        return { alerts: [] };
      }
      throw err;
    }
  },

  async createAlert(data) {
    try {
      return await api.post('/job-alerts', data);
    } catch (err) {
      if (import.meta.env.DEV) {
        const newAlert = {
          id: 'alert-' + Date.now(),
          status: 'active',
          createdAt: new Date().toISOString(),
          ...data,
        };
        const current = JSON.parse(localStorage.getItem('jobdheko_dev_alerts') || '{"alerts":[]}');
        current.alerts.push(newAlert);
        localStorage.setItem('jobdheko_dev_alerts', JSON.stringify(current));
        return newAlert;
      }
      throw err;
    }
  },

  async toggleAlertStatus(id, newStatus) {
    try {
      return await api.patch(`/job-alerts/${id}/status`, { status: newStatus });
    } catch (err) {
      if (import.meta.env.DEV) {
        const current = JSON.parse(localStorage.getItem('jobdheko_dev_alerts') || '{"alerts":[]}');
        current.alerts = current.alerts.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
        localStorage.setItem('jobdheko_dev_alerts', JSON.stringify(current));
        return { success: true, id, status: newStatus };
      }
      throw err;
    }
  },

  async deleteAlert(id) {
    try {
      return await api.delete(`/job-alerts/${id}`);
    } catch (err) {
      if (import.meta.env.DEV) {
        const current = JSON.parse(localStorage.getItem('jobdheko_dev_alerts') || '{"alerts":[]}');
        current.alerts = current.alerts.filter((a) => a.id !== id);
        localStorage.setItem('jobdheko_dev_alerts', JSON.stringify(current));
        return { success: true, id };
      }
      throw err;
    }
  },
};

export const careerResourcesApi = {
  async getResources(category) {
    const endpoint = category && category !== 'all' ? `/career-resources?category=${category}` : '/career-resources';
    try {
      return await api.get(endpoint);
    } catch (err) {
      if (import.meta.env.DEV) {
        return { resources: [] };
      }
      throw err;
    }
  },
};
