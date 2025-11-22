import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { 
  profileService, 
  experienceService, 
  educationService, 
  projectService, 
  skillService 
} from '../services/portfolioService';
import { Profile, Experience, Education, Project, Skill } from '../types';

// Profile Hook
export const useProfile = (): UseQueryResult<Profile, Error> => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// Experiences Hook
export const useExperiences = (): UseQueryResult<Experience[], Error> => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: experienceService.getAll,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// Education Hook
export const useEducation = (): UseQueryResult<Education[], Error> => {
  return useQuery({
    queryKey: ['education'],
    queryFn: educationService.getAll,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// Projects Hook
export const useProjects = (params?: { category?: string; featured?: boolean }): UseQueryResult<Project[], Error> => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectService.getAll(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// Skills Hook
export const useSkills = (params?: { category?: string; grouped?: boolean }): UseQueryResult<Skill[] | Record<string, Skill[]>, Error> => {
  return useQuery({
    queryKey: ['skills', params],
    queryFn: () => skillService.getAll(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Skills Grouped Hook (for easier typing)
export const useSkillsGrouped = (): UseQueryResult<Record<string, Skill[]>, Error> => {
  return useQuery({
    queryKey: ['skills', { grouped: true }],
    queryFn: skillService.getGrouped,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
