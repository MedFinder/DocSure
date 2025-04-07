import { useState, useCallback } from 'react';
import { searchService } from '@/services/api';
import { Doctor } from '@/types';

interface DoctorSearchState {
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;
}

interface UseDoctorSearchResult extends DoctorSearchState {
  searchDoctors: (lat: number, lng: number, specialty: string) => Promise<any>;
  getPopularDoctors: (lat: number, lng: number) => Promise<Doctor[]>;
}

export const useDoctorSearch = (): UseDoctorSearchResult => {
  const [state, setState] = useState<DoctorSearchState>({
    doctors: [],
    isLoading: false,
    error: null
  });

  // Get popular doctors
  const getPopularDoctors = useCallback(async (lat: number, lng: number): Promise<Doctor[]> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Try to get from session storage first
      if (typeof window !== 'undefined') {
        const storedDoctors = sessionStorage.getItem('popularDoctors');
        if (storedDoctors) {
          const parsedDoctors = JSON.parse(storedDoctors);
          if (parsedDoctors?.length > 0) {
            setState(prev => ({
              ...prev,
              doctors: parsedDoctors,
              isLoading: false
            }));
            return parsedDoctors;
          }
        }
      }
      
      const popularDoctors = await searchService.searchPlaces(lat, lng, 20000, 'Primary Care Physician');
      
      if (popularDoctors?.results?.length > 0) {
        const doctorsList = popularDoctors.results.slice(0, 20);
        setState(prev => ({
          ...prev,
          doctors: doctorsList,
          isLoading: false
        }));
        
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('popularDoctors', JSON.stringify(doctorsList));
        }
        
        return doctorsList;
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
      return [];
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch popular doctors',
        isLoading: false
      }));
      return [];
    }
  }, []);

  // Search for doctors with specific specialty
  const searchDoctors = useCallback(async (lat: number, lng: number, specialty: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const specialtyValue = specialty === 'Prescription / Refill' 
        ? 'Primary Care Physician' 
        : specialty;
        
      const response = await searchService.searchPlaces(lat, lng, 20000, specialtyValue);
      
      setState(prev => ({
        ...prev,
        doctors: response.results || [],
        isLoading: false
      }));
      
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to search doctors',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    searchDoctors,
    getPopularDoctors
  };
};
