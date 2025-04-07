import axios, { AxiosError } from 'axios';
import { SearchFormValues, Doctor } from '@/types';

// Create typed API error
interface ApiErrorResponse {
  message: string;
  status?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// Create axios instance with common config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    console.error(`API Error: ${errorMessage}`);
    return Promise.reject(error);
  }
);

interface SearchPlacesResponse {
  results: Doctor[];
  status: string;
}

interface GeocodeResponse {
  results: Array<{
    formatted_address: string;
    place_id: string;
    [key: string]: any;
  }>;
  status: string;
}

interface LogRequestResponse {
  request_id: string;
  success: boolean;
}

// Location and doctor search services
export const searchService = {
  searchPlaces: async (lat: number, lng: number, radius: number, keyword: string): Promise<SearchPlacesResponse> => {
    try {
      const response = await apiClient.get<SearchPlacesResponse>(
        `/search_places?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  },
  
  getGeocode: async (lat: number, lng: number): Promise<GeocodeResponse> => {
    try {
      const response = await axios.get<GeocodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting geocode:', error);
      throw error;
    }
  },
  
  logRequestInfo: async (data: Partial<SearchFormValues>): Promise<string | null> => {
    try {
      const response = await apiClient.post<LogRequestResponse>('/log-request-info', data);
      return response.data?.request_id || null;
    } catch (error) {
      console.error('Error logging request info:', error);
      return null;
    }
  }
};
