import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const searchProviders = async (query: string) => {
  const response = await api.post('/api/search', { query });
  return response.data;
};

export const getHistory = async (search?: string, sort?: string) => {
  const response = await api.get('/api/history', {
    params: { search, sort },
  });
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
