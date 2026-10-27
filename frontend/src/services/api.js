// Centralized API Client

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const getAuthToken = () => {
  try {
    return localStorage.getItem('jobdheko_token');
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('jobdheko_token', token);
    } else {
      localStorage.removeItem('jobdheko_token');
    }
  } catch {
    // Storage access error handling
  }
};

export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const { responseType, ...fetchOptions } = options;

  const headers = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    Accept: responseType === 'blob' ? 'audio/wav, application/json' : 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...fetchOptions,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !isFormData) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      setAuthToken(null);
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      throw new ApiError('Session expired. Please sign in again.', 401);
    }

    let data = null;
    const contentType = response.headers.get('content-type');
    if (responseType === 'blob') {
      data = await response.blob();
    } else if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || data?.detail || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or server unreachable error
    throw new ApiError(
      error.message || 'Unable to connect to the backend server. Please verify your connection.',
      0,
      null
    );
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};

export const apiBlob = (endpoint, body, options = {}) => request(endpoint, {
  ...options,
  method: 'POST',
  body,
  responseType: 'blob',
});

export { ApiError };
