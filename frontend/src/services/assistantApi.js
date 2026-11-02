import { api } from './api';

export const assistantApi = {
  createSession() {
    return api.post('/assistant/sessions', { title: 'oneAi chat' });
  },

  sendMessage(sessionId, message, jobId = null) {
    return api.post(`/assistant/sessions/${sessionId}/messages`, { message, jobId });
  },
};