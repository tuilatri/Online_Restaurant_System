import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const login = (data) => api.post('/auth/login', data);
export const register = (user) => api.post('/auth/register', user);
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (product) => api.post('/products', product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, order) => api.put(`/orders/${id}`, order);
export const getUsers = () => api.get('/users');
export const getUserByPhone = (phone) => api.get(`/users/${phone}`);
export const createUser = (user) => api.post('/users', user);
export const updateUser = (phone, user) => api.put(`/users/${phone}`, user);
export const deleteUser = (phone) => api.delete(`/users/${phone}`);