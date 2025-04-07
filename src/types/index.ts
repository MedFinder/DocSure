// Doctor Types
export interface DoctorType {
  value: string;
  label: string;
}

// Insurance Logo Type
export interface InsuranceLogo {
  src: string;
  alt: string;
  carrier: string;
  width?: number;
  height?: number;
}

// Location Types
export interface Location {
  lat: number;
  lng: number;
}

// Google Maps Place Type (simplified)
export interface GooglePlace {
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  name?: string;
  place_id?: string;
}

// Doctor Search Result
export interface Doctor {
  business_status?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  place_id: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  photos?: Array<{
    height: number;
    width: number;
    html_attributions: string[];
    photo_reference: string;
  }>;
  [key: string]: any; // For other properties
}

// Form Data
export interface SearchFormValues {
  specialty: string;
  insurance_carrier: string;
  address?: string;
  request_id?: string;
}
