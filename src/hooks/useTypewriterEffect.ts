import { useState, useEffect } from "react";

const useTypewriterEffect = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => {
      clearInterval(interval);
      setDisplayedText(""); // Clear text at the end
    };
  }, [text, speed]);

  return displayedText;
};

export default useTypewriterEffect;
