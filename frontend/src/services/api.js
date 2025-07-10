const api = {
  baseURL: '/api',

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  },

  auth: {
    login: (credentials) =>
      api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
  },

  chat: {
    send: (message) =>
      api.request('/chat/send', {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
    getHistory: () => api.request('/chat/history'),
  },

  image: {
    generate: (prompt) =>
      api.request('/image/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      }),
    getHistory: () => api.request('/image/history'),
  },
};

export default api;