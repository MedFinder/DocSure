import { useState, useEffect, useCallback } from 'react';
import { searchService } from '@/services/api';
import { GooglePlace, Location } from '@/types';

interface LocationState {
  lat: number;
  lng: number;
  address: string;
  isLoading: boolean;
  error: string | null;
}

interface UseLocationResult extends LocationState {
  updateLocation: (lat: number, lng: number) => Promise<void>;
  updateAddressFromPlace: (place: GooglePlace) => void;
  setAddress: (address: string) => void;
}

export const useLocation = (): UseLocationResult => {
  const [state, setState] = useState<LocationState>({
    lat: 0,
    lng: 0,
    address: '',
    isLoading: true,
    error: null
  });

  // Function to set address directly
  const setAddress = useCallback((address: string) => {
    setState(prev => ({
      ...prev,
      address
    }));
  }, []);

  // Get address from coordinates
  const fetchAddressFromCoords = useCallback(async (lat: number, lng: number) => {
    try {
      const geocodeResponse = await searchService.getGeocode(lat, lng);
      const address = geocodeResponse.results[0]?.formatted_address || '';
      
      setState(prev => ({
        ...prev,
        lat,
        lng,
        address,
        isLoading: false
      }));
      
      // Store in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedAddress', address);
        sessionStorage.setItem('selectedLocation', JSON.stringify({ lat, lng }));
      }
      
      return address;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch address',
        isLoading: false
      }));
      return '';
    }
  }, []);

  // Update location with new coordinates
  const updateLocation = useCallback(async (lat: number, lng: number) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await fetchAddressFromCoords(lat, lng);
  }, [fetchAddressFromCoords]);

  // Update from a Google Place object
  const updateAddressFromPlace = useCallback((place: GooglePlace) => {
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const formattedAddress = place.formatted_address;
      
      setState(prev => ({
        ...prev,
        lat,
        lng,
        address: formattedAddress,
        isLoading: false
      }));
      
      // Store in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedAddress', formattedAddress);
        sessionStorage.setItem('selectedLocation', JSON.stringify({ lat, lng }));
      }
    }
  }, []);

  // Initialize location on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedAddress = sessionStorage.getItem('selectedAddress');
    const storedLocation = sessionStorage.getItem('selectedLocation');
    
    if (storedAddress && storedLocation) {
      try {
        const { lat, lng } = JSON.parse(storedLocation);
        setState({
          lat,
          lng,
          address: storedAddress,
          isLoading: false,
          error: null
        });
        return;
      } catch (e) {
        // Continue with geolocation if parsing fails
      }
    }
    
    // Default location (San Francisco)
    const defaultLat = 37.7749;
    const defaultLng = -122.4194;
    
    if (!navigator.geolocation) {
      fetchAddressFromCoords(defaultLat, defaultLng);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        await fetchAddressFromCoords(lat, lng);
      },
      async (error) => {
        console.error('Geolocation error:', error);
        await fetchAddressFromCoords(defaultLat, defaultLng);
      }
    );
  }, [fetchAddressFromCoords]);

  return {
    ...state,
    updateLocation,
    updateAddressFromPlace,
    setAddress
  };
};
