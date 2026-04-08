const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  auth: {
    register: async (userData) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },

    login: async (credentials) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    },

    getProfile: async () => {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse(response);
    },

    updateProfile: async (data) => {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    updateAddress: async (address) => {
      const response = await fetch(`${API_URL}/auth/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(address),
      });
      return handleResponse(response);
    },
  },

  products: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_URL}/products?${queryString}`);
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(`${API_URL}/products/${id}`);
      return handleResponse(response);
    },

    getCategories: async () => {
      const response = await fetch(`${API_URL}/products/categories`);
      return handleResponse(response);
    },

    seed: async () => {
      const response = await fetch(`${API_URL}/products/seed`, { method: 'POST' });
      return handleResponse(response);
    },
  },

  orders: {
    create: async (orderData) => {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(orderData),
      });
      return handleResponse(response);
    },

    getAll: async () => {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse(response);
    },

    cancel: async (id) => {
      const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
        method: 'PUT',
        headers: { ...getAuthHeader() },
      });
      return handleResponse(response);
    },
  },
};
