import { api } from "../api/axios.js";
export const createCrudApi = (endpoint) => ({
  getAll: (params = {}) =>
    api.get(`api${endpoint}`, { params }).then((response) => response.data),

  getById: (id) => api.get(`api${endpoint}/${id}`).then((r) => r.data),

  create: (data) =>
    api.post(`api${endpoint}`, data).then((response) => response.data),

  update: (id, data) =>
    api.put(`api${endpoint}/${id}`, data).then((response) => response.data),

  patch: (id, data) =>
    api.patch(`api${endpoint}/${id}`, data).then((response) => response.data),

  delete: (id) =>
    api.delete(`api${endpoint}/${id}`).then((response) => response.data),
});
