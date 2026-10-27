import { api, apiBlob } from './api';

export const voiceApi = {
  transcribe(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'oneai-recording.webm');
    return api.post('/voice/transcribe', formData);
  },

  speak(text) {
    return apiBlob('/voice/speak', { text });
  },
};