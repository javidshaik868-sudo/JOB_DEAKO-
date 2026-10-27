import { api } from './api';

export const jobsApi = {
  async getJobs(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.location) query.append('location', params.location);
    if (params.workMode) query.append('workMode', params.workMode);
    if (params.experience) query.append('experience', params.experience);
    if (params.salary) query.append('salary', params.salary);
    if (params.jobType) query.append('jobType', params.jobType);
    if (params.skills) query.append('skills', params.skills);
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page);

    const queryString = query.toString();
    const endpoint = `/jobs${queryString ? `?${queryString}` : ''}`;
    
    try {
      return await api.get(endpoint);
    } catch (err) {
      if (import.meta.env.DEV) {
        // In local development before backend is started, return empty collection to trigger EmptyState
        return { jobs: [], total: 0, page: 1, totalPages: 0 };
      }
      throw err;
    }
  },

  async getJobById(jobId) {
    try {
      return await api.get(`/jobs/${jobId}`);
    } catch (err) {
      throw err;
    }
  },

  async getSavedJobs() {
    try {
      return await api.get('/jobs/saved');
    } catch (err) {
      if (import.meta.env.DEV) {
        return { savedJobs: [], total: 0 };
      }
      throw err;
    }
  },

  async saveJob(jobId) {
    try {
      return await api.post(`/jobs/${jobId}/save`, {});
    } catch (err) {
      if (import.meta.env.DEV) {
        return { success: true, saved: true, jobId };
      }
      throw err;
    }
  },

  async unsaveJob(jobId) {
    try {
      return await api.delete(`/jobs/${jobId}/save`);
    } catch (err) {
      if (import.meta.env.DEV) {
        return { success: true, saved: false, jobId };
      }
      throw err;
    }
  },
};
