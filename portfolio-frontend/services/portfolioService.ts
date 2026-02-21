import { apiClient } from './api';
import { API_ENDPOINTS, API_CONFIG } from '../config/api.config';
import { Profile, Experience, Education, Project, Skill, BlogPost } from '../types';

// Resume Service
export const resumeService = {
  download: async (): Promise<void> => {
    const downloadUrl = `${API_CONFIG.baseURL}${API_ENDPOINTS.resumeDownload}`;

    // Open in new tab to trigger browser download
    window.open(downloadUrl, '_blank');
  },
};

// Profile Service
export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const response = await apiClient.get(API_ENDPOINTS.profile);
    return response.data.data;
  },
};

// Experience Service
export const experienceService = {
  getAll: async (): Promise<Experience[]> => {
    const response = await apiClient.get(API_ENDPOINTS.experiences);
    return response.data.data;
  },

  getById: async (id: string): Promise<Experience> => {
    const response = await apiClient.get(`${API_ENDPOINTS.experiences}/${id}`);
    return response.data.data;
  },
};

// Education Service
export const educationService = {
  getAll: async (): Promise<Education[]> => {
    const response = await apiClient.get(API_ENDPOINTS.education);
    return response.data.data;
  },

  getById: async (id: string): Promise<Education> => {
    const response = await apiClient.get(`${API_ENDPOINTS.education}/${id}`);
    return response.data.data;
  },
};

// Project Service
export const projectService = {
  getAll: async (params?: { category?: string; featured?: boolean }): Promise<Project[]> => {
    const response = await apiClient.get(API_ENDPOINTS.projects, { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get(`${API_ENDPOINTS.projects}/${id}`);
    return response.data.data;
  },

  getFeatured: async (): Promise<Project[]> => {
    const response = await apiClient.get(API_ENDPOINTS.projects, {
      params: { featured: true },
    });
    return response.data.data;
  },
};

// Skill Service
export const skillService = {
  getAll: async (params?: { category?: string; grouped?: boolean }): Promise<Skill[] | Record<string, Skill[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.skills, { params });
    return response.data.data;
  },

  getGrouped: async (): Promise<Record<string, Skill[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.skills, {
      params: { grouped: true },
    });
    return response.data.data;
  },

  getByCategory: async (category: string): Promise<Skill[]> => {
    const response = await apiClient.get(API_ENDPOINTS.skills, {
      params: { category },
    });
    return response.data.data;
  },
};

// Blog Service
export const blogService = {
  getAll: async (params?: { category?: string; tag?: string; page?: number; per_page?: number }): Promise<{ data: BlogPost[]; meta: any }> => {
    const response = await apiClient.get(API_ENDPOINTS.blog, { params });
    return { data: response.data.data, meta: response.data.meta };
  },

  getBySlug: async (slug: string): Promise<BlogPost> => {
    const response = await apiClient.get(`${API_ENDPOINTS.blog}/${slug}`);
    return response.data.data;
  },

  getFeatured: async (limit?: number): Promise<BlogPost[]> => {
    const response = await apiClient.get(API_ENDPOINTS.blogFeatured, { params: { limit } });
    return response.data.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get(API_ENDPOINTS.blogCategories);
    return response.data.data;
  },
};
