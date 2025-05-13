"use client";
import { useEffect, useRef, useState } from 'react';
import { Popover } from '@typeform/embed-react';

const ExitIntentPopup: React.FC = () => {
  const [popupShown, setPopupShown] = useState(false);
  // console.log(popupShown)
  const popupRef = useRef<any>(null);

  useEffect(() => {
    const handleMouseOut = (event: MouseEvent) => {
      // console.log(event.clientY)
      // Check if mouse is leaving towards the top (within 50px) and popup hasn't been shown
      if (event.clientY < 50 && !popupShown && event.relatedTarget === null) {
        setPopupShown(true);
        setTimeout(() => {
          popupRef.current?.open();
        }, 500);
      }
    };

    document.addEventListener('mouseout', handleMouseOut);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [popupShown]);

  return (
    !popupShown ? null : (
    <Popover
      embedRef={popupRef}
      fullScreen={true} // Set to true for full-screen popup
      id="eOmYMh2B" // Replace with your actual Typeform form ID
      size={80} // Popup size as a percentage of the screen
      hidden={{ foo: 'bar' }} // Optional: hidden fields to pass to Typeform
    />
  ));
};

export default ExitIntentPopup;