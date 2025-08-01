const api = { 
  baseURL: 'https://hask-ai-backend.vercel.app/api',

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    try {
      console.log('Making request to:', `${this.baseURL}${endpoint}`);
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      // Log response details for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If it's not JSON, get the text to see what we actually received
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
      }
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  async requestFormData(endpoint, formData, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let browser set it
      },
      method: 'POST',
      body: formData,
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
      }
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
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
    generateImageToImage: (formData) =>
      api.requestFormData('/image/generate-image-to-image', formData),
    getHistory: () => api.request('/image/history'),
  },
};

export default api;