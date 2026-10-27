import { api } from './api';

export const profileApi = {
  async getProfile() {
    return api.get('/profile');
  },

  async updateProfile(data) {
    return api.put('/profile', data);
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/profile/avatar', formData);
  },
};
