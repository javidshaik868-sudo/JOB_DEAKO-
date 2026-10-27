import { api, setAuthToken } from './api';

export const authApi = {
  async login({ email, password }) {
    const response = await api.post('/auth/login', { email, password });
    if (response?.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  async signup(data) {
    return api.post('/auth/signup', data);
  },

  async resendOtp({ email }) {
    return api.post('/auth/resend-otp', { email });
  },

  async verifyOtp({ email, otp }) {
    const response = await api.post('/auth/verify-otp', { email, otp });
    if (response?.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  async forgotPassword({ email }) {
    return api.post('/auth/forgot-password', { email });
  },

  async resetPassword({ token, newPassword }) {
    return api.post('/auth/reset-password', { token, newPassword });
  },

  async getCurrentUser() {
    return api.get('/auth/me');
  },

  async logout() {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Ignore network errors on logout
    } finally {
      setAuthToken(null);
    }
  },
};
