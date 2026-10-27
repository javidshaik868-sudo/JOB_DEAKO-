import { api } from './api';

export const applicationsApi = {
  async getApplications(status) {
    const endpoint = status && status !== 'all' ? `/applications?status=${status}` : '/applications';
    try {
      return await api.get(endpoint);
    } catch (err) {
      if (import.meta.env.DEV) {
        return { applications: [], total: 0 };
      }
      throw err;
    }
  },

  async getApplicationById(id) {
    try {
      return await api.get(`/applications/${id}`);
    } catch (err) {
      throw err;
    }
  },

  async submitApplication(jobId, data) {
    try {
      return await api.post(`/applications`, { jobId, ...data });
    } catch (err) {
      if (import.meta.env.DEV) {
        return {
          id: 'app-' + Date.now(),
          jobId,
          status: 'applied',
          appliedAt: new Date().toISOString(),
          ...data,
        };
      }
      throw err;
    }
  },

  async getAvailableInterviewSlots(applicationId) {
    try {
      return await api.get(`/applications/${applicationId}/interview-slots`);
    } catch (err) {
      if (import.meta.env.DEV) {
        return {
          interviewType: 'Technical Round 1',
          duration: '45 mins',
          interviewer: 'Tech Lead / Staff Engineer',
          dates: [
            {
              date: 'Tomorrow, Oct 12',
              slots: ['10:00 AM', '02:00 PM', '04:30 PM'],
            },
            {
              date: 'Thursday, Oct 14',
              slots: ['11:00 AM', '03:00 PM'],
            },
          ],
        };
      }
      throw err;
    }
  },

  async scheduleInterview(applicationId, slotData) {
    try {
      return await api.post(`/applications/${applicationId}/schedule`, slotData);
    } catch (err) {
      if (import.meta.env.DEV) {
        return {
          success: true,
          applicationId,
          scheduledTime: slotData.slot,
          scheduledDate: slotData.date,
          status: 'interview_scheduled',
        };
      }
      throw err;
    }
  },
};
