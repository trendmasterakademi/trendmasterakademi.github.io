import React, { useState, useEffect, useRef } from 'react';

export const useInView = (ref, options = { once: true }) => {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (options.once) observer.disconnect();
      } else if (!options.once) {
        setIsInView(false);
      }
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options.once]);
  return isInView;
};

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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
  }, [isInView, text, speed, delay, onComplete]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {displayedText}
      {showCursor && !isDone && (
        <span className={`inline-block w-2 h-4 sm:h-5 ml-1 bg-cyan-400 animate-pulse ${cursorColor} align-middle`} />
      )}
    </span>
  );
};

export default TypewriterText;
