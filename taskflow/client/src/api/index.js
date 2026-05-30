import API from './axios';

export const getTasks     = (params)    => API.get('/tasks', { params });
export const getTask      = (id)        => API.get(`/tasks/${id}`);
export const createTask   = (data)      => API.post('/tasks', data);
export const updateTask   = (id, data)  => API.patch(`/tasks/${id}`, data);
export const deleteTask   = (id)        => API.delete(`/tasks/${id}`);

export const getProjects  = ()          => API.get('/projects');
export const createProject = (data)     => API.post('/projects', data);

export const register     = (data)      => API.post('/auth/register', data);
export const login        = (data)      => API.post('/auth/login', data);
export const getMe        = ()          => API.get('/auth/me');
