"use client";
import { useEffect, useRef, useState } from 'react';
import {  Widget } from '@typeform/embed-react';

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

  return (
    <>
    <Widget
        //onHeightChanged={height => console.log(height)}
        //fullScreen
        style={{display:popupShown?'block': "none",width: "50%", height: "50%", position: "fixed", top: '2%', left: '22%', zIndex: 9999}}
        id="eOmYMh2B" // Replace with your actual Typeform form ID
      />
    </>

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