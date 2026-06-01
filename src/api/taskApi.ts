import axios from 'axios';
import type { Task, FormSettings } from '../types';

const BASE_URL = '/api';
const ORGANIZATION_ID = import.meta.env.VITE_ORGANIZATION_ID || 'default';

const api = axios.create({ baseURL: BASE_URL });

// Tasks
export const getTasks = () =>
    api.get<Task[]>('/GetTasks', { params: { organizationId: ORGANIZATION_ID } });

export const getTask = (id: string) =>
    api.get<Task>('/GetTask', { params: { id, organizationId: ORGANIZATION_ID } });

export const insertTask = (task: Omit<Task, 'id' | 'organizationId'>) =>
    api.post<Task>('/InsertTask', { ...task, organizationId: ORGANIZATION_ID });

export const updateTask = (id: string, data: Partial<Task>) =>
    api.patch<Task>('/UpdateTask', data, { params: { id, organizationId: ORGANIZATION_ID } });

export const deleteTask = (id: string) =>
    api.delete('/DeleteTask', { params: { id, organizationId: ORGANIZATION_ID } });

export const bulkDeleteTasks = (ids: string[]) =>
    api.delete('/BulkDeleteTasks', { data: ids, params: { organizationId: ORGANIZATION_ID } });

// Form Settings
export const getFormSettings = () =>
    api.get<FormSettings>('/GetFormSettings', { params: { organizationId: ORGANIZATION_ID } });

export const saveFormSettings = (settings: FormSettings) =>
    api.post<FormSettings>('/SaveFormSettings', settings, { params: { organizationId: ORGANIZATION_ID } });