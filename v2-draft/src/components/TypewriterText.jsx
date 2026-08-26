import React, { useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

export const TypewriterText = ({ 
  text, 
  speed = 38, 
  delay = 120, 
  className = "", 
  cursorColor = "text-cyan-400",
  showCursor = true,
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!isInView || !text) return;

    setDisplayedText('');
    setIsDone(false);

    let currentIndex = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsDone(true);
          if (onComplete) onComplete();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [isInView, text, speed, delay]);

  return (
    <span ref={ref} className={`font-mono inline ${className}`}>
      <span>{displayedText}</span>
      {showCursor && (
        <span className={`inline-block font-mono font-black ml-0.5 ${cursorColor} ${isDone ? 'animate-cursor opacity-80' : 'opacity-100'}`}>
          _
        </span>
      )}
    </span>
  );
};

export default TypewriterText;
