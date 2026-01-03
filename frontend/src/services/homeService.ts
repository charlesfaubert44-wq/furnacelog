import axios from 'axios';
import type { Home, CreateHomeDto, UpdateHomeDto, HomeResponse, HomesResponse } from '../types/home';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests (when auth is implemented)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const homeService = {
  /**
   * Create a new home
   */
  createHome: async (homeData: CreateHomeDto): Promise<Home> => {
    const response = await api.post<HomeResponse>('/homes', homeData);
    return response.data.data;
  },

  /**
   * Get all homes for authenticated user
   */
  getHomes: async (includeArchived = false): Promise<Home[]> => {
    const response = await api.get<HomesResponse>('/homes', {
      params: { includeArchived },
    });
    return response.data.data;
  },

  /**
   * Get a single home by ID
   */
  getHome: async (homeId: string): Promise<Home> => {
    const response = await api.get<HomeResponse>(`/homes/${homeId}`);
    return response.data.data;
  },

  /**
   * Update a home
   */
  updateHome: async (homeId: string, updates: UpdateHomeDto): Promise<Home> => {
    const response = await api.patch<HomeResponse>(`/homes/${homeId}`, updates);
    return response.data.data;
  },

  /**
   * Delete a home (soft delete by default)
   */
  deleteHome: async (homeId: string, permanent = false): Promise<void> => {
    await api.delete(`/homes/${homeId}`, {
      params: { permanent },
    });
  },

  /**
   * Restore an archived home
   */
  restoreHome: async (homeId: string): Promise<Home> => {
    const response = await api.patch<HomeResponse>(`/homes/${homeId}/restore`);
    return response.data.data;
  },

  /**
   * Upload home cover photo
   */
  uploadCoverPhoto: async (homeId: string, file: File): Promise<Home> => {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await api.post<HomeResponse>(`/homes/${homeId}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Get home statistics
   */
  getHomeStats: async (): Promise<any> => {
    const response = await api.get('/homes/stats');
    return response.data.data;
  },
};

export default homeService;
