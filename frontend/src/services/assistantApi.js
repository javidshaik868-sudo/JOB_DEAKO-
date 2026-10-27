import { api } from './api';

export const assistantApi = {
  createSession() {
    return api.post('/assistant/sessions', { title: 'oneAi chat' });
  },

  sendMessage(sessionId, message) {
    return api.post(`/assistant/sessions/${sessionId}/messages`, { message });
  },
};