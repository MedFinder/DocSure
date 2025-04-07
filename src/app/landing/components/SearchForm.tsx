import { useCallback } from 'react';
import { FormikProps } from 'formik';
import { Search, MapPin, BookText, Loader2 } from 'lucide-react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Autocomplete } from '@/components/ui/autocomplete';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { medicalSpecialtiesOptions, insuranceCarrierOptions } from '@/constants/store-constants';
import { doctorTypes } from '@/constants/doctor-types';
import { SearchFormValues, GooglePlace } from '@/types';

interface SearchFormProps {
  formik: FormikProps<SearchFormValues>;
  isLoaded: boolean;
  isLoading: boolean;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  handleDoctorTypeClick: (value: string) => void;
  inputRefs: React.MutableRefObject<any[]>;
  handleOnPlacesChanged: (index: number) => void;
  locationAddress: string;
  setLocationAddress: (address: string) => void;
  isLocationValid: boolean;
}

const SearchForm = ({
  formik,
  isLoaded,
  isLoading,
  selectedSpecialty,
  setSelectedSpecialty,
  handleDoctorTypeClick,
  inputRefs,
  handleOnPlacesChanged,
  locationAddress,
  setLocationAddress,
  isLocationValid
}: SearchFormProps) => {
  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="flex gap-2 w-full pt-4"
      >
        <div className="flex flex-col md:flex-row w-full bg-white rounded-md border border-black">
          {/* Specialty section */}
          <div className="flex flex-col sm:flex-row flex-grow w-full">
            <div className="flex items-center w-full sm:w-auto sm:flex-1">
              <div className="flex items-center justify-center px-3">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1 border-b border-gray-400 md:border-none">
                <Autocomplete
                  id="specialty"
                  name="specialty"
                  className="w-full"
                  options={medicalSpecialtiesOptions}
                  placeholder="Medical specialty"
                  value={selectedSpecialty}
                  selected={formik.values.specialty}
                  onChange={(value) => {
                    formik.setFieldValue("specialty", value);
                    setSelectedSpecialty(value);
                  }}
                  clearable={false}
                />
              </div>
            </div>
            
            {/* Insurance carrier section */}
            <div className="flex items-center w-full sm:w-auto sm:flex-1">
              <div className="flex items-center justify-center px-3">
                <BookText className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1 border-b border-gray-400 md:border-none">
                <Autocomplete
                  id="insurance_carrier"
                  name="insurance_carrier"
                  className="w-full"
                  options={insuranceCarrierOptions}
                  placeholder="Insurance carrier (optional)"
                  value={formik.values.insurance_carrier}
                  selected={formik.values.insurance_carrier}
                  onChange={(value) => {
                    formik.setFieldValue("insurance_carrier", value);
                  }}
                  clearable={false}
                />
              </div>
            </div>
            
            {/* Location section */}
            <div className="flex items-center w-full sm:flex-1">
              <div className="flex items-center justify-center px-3 h-full">
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={(ref) => (inputRefs.current[0] = ref)}
                    onPlacesChanged={() => handleOnPlacesChanged(0)}
                  >
                    <Input
                      type="text"
                      placeholder="Address, city, zip code"
                      className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 shadow-none"
                      value={locationAddress || ""}
                      onChange={(e) => setLocationAddress(e.target.value)}
                      autoComplete="off"
                      aria-autocomplete="none"
                    />
                  </StandaloneSearchBox>
                )}
              </div>
            </div>
            
            {/* Mobile search button */}
            <div className="mx-3">
              <Button 
                disabled={isLoading || !formik.values.specialty || !isLocationValid}
                type="submit"
                className="bg-[#E5573F] rounded-md text-white space-x-2 px-6 my-4 h-12 items-center justify-center w-full md:w-auto md:hidden"
              >
                <Search className="w-5 h-5 text-white" /> Search
              </Button>
            </div>
          </div>
        </div>
        
        {/* Desktop search button */}
        <Button
          disabled={isLoading || !formik.values.specialty || !isLocationValid}
          type="submit"
          className="bg-[#E5573F] rounded-md text-white space-x-2 px-6 h-12 md:flex items-center justify-center w-full md:w-auto hidden"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 text-white animate-spin" /> Searching
            </>
          ) : (
            <>
              <Search className="w-5 h-5 text-white" /> Search
            </>
          )}
        </Button>
      </form>

      {/* Specialty Selection */}
      <ScrollArea className="w-full whitespace-nowrap md:flex gap-4 md:pt-4 pt-0 hidden">
        <div className="flex gap-4 px-1 pb-2 md:max-w-full max-w-[50%] justify-center">
          {doctorTypes.map((value, index) => (
            <Button
              key={index}
              className={`rounded-full text-xs px-3 py-2 w-auto flex-shrink-0 ${
                selectedSpecialty === value.value
                  ? "bg-slate-800 text-white"
                  : "bg-[#EFEADE] text-[#202124] hover:text-white hover:bg-slate-800"
              }`}
              onClick={() => handleDoctorTypeClick(value.value)}
            >
              {value.label}
            </Button>
          ))}
        </div>
        <ScrollBar
          orientation="horizontal"
          className="block md:block lg:hidden"
        />
      </ScrollArea>
    </>
  );
};

export default SearchForm;
