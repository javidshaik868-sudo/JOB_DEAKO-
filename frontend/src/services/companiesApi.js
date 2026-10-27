import { api } from './api';

export const companiesApi = {
  async getCompanies(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.industry) query.append('industry', params.industry);
    if (params.location) query.append('location', params.location);
    if (params.page) query.append('page', params.page);

    const queryString = query.toString();
    const endpoint = `/companies${queryString ? `?${queryString}` : ''}`;

    try {
      return await api.get(endpoint);
    } catch (err) {
      if (import.meta.env.DEV) {
        return { companies: [], total: 0 };
      }
      throw err;
    }
  },

  async getCompanyById(id) {
    try {
      return await api.get(`/companies/${id}`);
    } catch (err) {
      throw err;
    }
  },

  async getCompanyJobs(companyId) {
    try {
      return await api.get(`/companies/${companyId}/jobs`);
    } catch (err) {
      if (import.meta.env.DEV) {
        return { jobs: [], total: 0 };
      }
      throw err;
    }
  },
};
