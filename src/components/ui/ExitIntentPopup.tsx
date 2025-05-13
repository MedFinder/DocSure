"use client";
import { useEffect, useRef, useState } from 'react';
import { Popover, Widget } from '@typeform/embed-react';

const ExitIntentPopup: React.FC = () => {
  const [popupShown, setPopupShown] = useState(false);
  // console.log(popupShown)
  const popupRef = useRef<any>(null);

  useEffect(() => {
    const handleMouseOut = (event: MouseEvent) => {
      // console.log(event.clientY)
      // Check if mouse is leaving towards the top (within 50px) and popup hasn't been shown
      console.log(event.clientY, popupShown)
      if (event.clientY < 0 && !popupShown && event.relatedTarget === null) {
        setPopupShown(true);
        // setTimeout(() => {
        //   popupRef.current?.open();
        // }, 500);
      }
    };

    document.addEventListener('mouseout', handleMouseOut);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [popupShown]);

  const handleClose = () => {
    setPopupShown(false);
  };

  return (
    <div style={{  display: popupShown ? 'block' : 'none', width: '50%', height: '50%', margin: '0 auto', position: "fixed", top: '2%', left: '22%', zIndex: 9999 }}>
      <button 
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          background: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
        aria-label="Close"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L4 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 4L12 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <Widget
        style={{ width: '100%', height: '100%' }}
        id="eOmYMh2B" // Replace with your actual Typeform form ID
      />
    </div>
  );
};

export default ExitIntentPopup;


{/* <Popover
embedRef={popupRef}
fullScreen={true} // Set to true for full-screen popup
id="eOmYMh2B" // Replace with your actual Typeform form ID
size={80} // Popup size as a percentage of the screen
hidden={{ foo: 'bar' }} // Optional: hidden fields to pass to Typeform
/> */}