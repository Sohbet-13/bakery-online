import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.103:8000/api/v1', 
  headers: {
    'Accept': 'application/json',
  },
});

export const getCatalog = async () => {
  const response = await api.get('/catalog');
  return response.data;
};

export const getProductBySlug = async (slug: string) => {
  const response = await api.get(`/catalog/${slug}`);
  return response.data;
};

// НОВАЯ ФУНКЦИЯ
export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export default api;