import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  orders: {
    getAll: () => axios.get(`${API_BASE_URL}/orders`),
    create: (data: any) => axios.post(`${API_BASE_URL}/orders`, data),
    update: (id: string, data: any) => axios.put(`${API_BASE_URL}/orders/${id}`, data),
    delete: (id: string) => axios.delete(`${API_BASE_URL}/orders/${id}`),
  },
  dashboards: {
    getAll: () => axios.get(`${API_BASE_URL}/dashboards`),
    getById: (id: string) => axios.get(`${API_BASE_URL}/dashboards/${id}`),
    create: (data: any) => axios.post(`${API_BASE_URL}/dashboards`, data),
    update: (id: string, data: any) => axios.put(`${API_BASE_URL}/dashboards/${id}`, data),
    delete: (id: string) => axios.delete(`${API_BASE_URL}/dashboards/${id}`),
  },
};
