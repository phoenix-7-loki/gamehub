import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const getCurrentUser = () => api.get('/auth/me');

export const getGames = () => api.get('/games').then(res => res.data);
export const getGameById = (id) => api.get(`/games/${id}`).then(res => res.data);
export const createGame = (game) => api.post('/games', game).then(res => res.data);
export const updateGame = ({ id, ...game }) => api.put(`/games/${id}`, game).then(res => res.data);
export const deleteGame = (id) => api.delete(`/games/${id}`).then(res => res.data);

export const getOrders = () => api.get('/orders').then(res => res.data);
export const getOrderById = (id) => api.get(`/orders/${id}`).then(res => res.data);
export const createOrder = (order) => api.post('/orders', order).then(res => res.data);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}`, { status }).then(res => res.data);