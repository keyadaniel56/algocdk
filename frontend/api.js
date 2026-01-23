// api.js - Client-side API helper functions for interacting with the backend API
// Base URL for the API (update this for production)
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null, headers = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// API functions grouped by category
const api = {
  marketplace: {
    getMarketplace: () => apiRequest('/marketplace'),
  },

  paystack: {
    getCallback: () => apiRequest('/paystack/callback'),
  },

  auth: {
    signup: (data) => apiRequest('/auth/signup', 'POST', data),
    login: (data) => apiRequest('/auth/login', 'POST', data),
    forgotPassword: (data) => apiRequest('/auth/forgot_password/', 'POST', data),
  },

  user: {
    getProfile: (id) => apiRequest(`/user/profile/${id}`),
    updateProfile: (id, data) => apiRequest(`/user/updateprofile/${id}`, 'POST', data),
    deleteAccount: (id) => apiRequest(`/user/delete_account/${id}`, 'DELETE'),
    resetPassword: (id, data) => apiRequest(`/user/reset_password/${id}`, 'POST', data),
    toggleFavorite: (id) => apiRequest(`/user/togole_favorite/${id}`),
    getFavorites: () => apiRequest('/user/favorite/me'),
  },

  superadmin: {
    auth: {
      signup: (data) => apiRequest('/superadmin/auth/signup', 'POST', data),
      login: (data) => apiRequest('/superadmin/auth/login', 'POST', data),
    },
    getProfile: (id) => apiRequest(`/superadmin/profile/${id}`),
    getDashboard: (id) => apiRequest(`/superadmin/superadmindashboard/${id}`),
    createUser: (data) => apiRequest('/superadmin/create_user', 'POST', data),
    updateUser: (id, data) => apiRequest(`/superadmin/update_user/${id}`, 'POST', data),
    deleteUser: (id) => apiRequest(`/superadmin/delete_user/${id}`, 'DELETE'),
    getAllUsers: () => apiRequest('/superadmin/users'),
    getUserById: (id) => apiRequest(`/superadmin/user/${id}`),
    createAdmin: (data) => apiRequest('/superadmin/create_admin', 'POST', data),
    getAllAdmins: () => apiRequest('/superadmin/get_all_admins'),
    toggleAdminStatus: () => apiRequest('/superadmin/toggle_admin_status'),
    updateAdmin: (id, data) => apiRequest(`/superadmin/update_admin/${id}`, 'POST', data),
    deleteAdmin: () => apiRequest('/superadmin/delete_admin', 'DELETE'),
    updateAdminPassword: (data) => apiRequest('/superadmin/update_admin_password', 'POST', data),
    getBots: () => apiRequest('/superadmin/bots'),
    scanBots: () => apiRequest('/superadmin/scan_bots'),
  },

  admin: {
    getDashboard: () => apiRequest('/admin/dashboard'),
    createBot: (data) => apiRequest('/admin/create-bot', 'POST', data),
    updateBot: (id, data) => apiRequest(`/admin/update-bot/${id}`, 'PUT', data),
    deleteBot: (id) => apiRequest(`/admin/delete-bot/${id}`, 'DELETE'),
    getBots: () => apiRequest('/admin/bots'),
    getProfile: () => apiRequest('/admin/profile'),
    updateBankDetails: (data) => apiRequest('/admin/bank-details', 'PUT', data),
    getTransactions: () => apiRequest('/admin/transactions'),
    recordTransaction: (data) => apiRequest('/admin/transactions', 'POST', data),
    getBotUsers: (id) => apiRequest(`/admin/bots/${id}/users`),
    removeUserFromBot: (bot_id, user_id) => apiRequest(`/admin/bots/${bot_id}/users/${user_id}`, 'DELETE'),
    resetPassword: (id, data) => apiRequest(`/admin/reset_password/${id}`, 'POST', data),
  },

  payment: {
    initialize: (data) => apiRequest('/payment/initialize', 'POST', data),
    verify: () => apiRequest('/payment/verify'),
    callback: (data) => apiRequest('/payment/callback', 'POST', data),
    updateTransaction: (data) => apiRequest('/payment/update-transaction', 'POST', data),
    webhook: (data) => apiRequest('/payment/webhook', 'POST', data),
  },
};

// Make api global so it's accessible from other scripts
window.api = api;

// Usage example:
// const response = await api.auth.signup({ email: 'user@example.com', password: 'pass' });
// Note: For authenticated endpoints, add token to headers, e.g., apiRequest(..., { Authorization: `Bearer ${token}` })