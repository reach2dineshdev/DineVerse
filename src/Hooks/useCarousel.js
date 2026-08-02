import { useRef, useState, useEffect } from 'react';

export const useCarousel = (dependencies = []) => {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);

  const checkEdges = (newPos) => {
    const el = trackRef.current;
    if (!el) return;
    
    const containerWidth = el.parentElement.clientWidth;
    const trackWidth = el.scrollWidth;
    const maxScroll = Math.max(0, trackWidth - containerWidth);
    
    setAtStart(newPos >= 0);
    setAtEnd(newPos <= -maxScroll);
  };

  useEffect(() => {
    setScrollPos(0);
    setAtStart(true);
    const timeout = setTimeout(() => {
      if (trackRef.current) {
        const el = trackRef.current;
        setAtEnd(el.scrollWidth <= el.parentElement.clientWidth);
      }
    }, 100);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    
    const containerWidth = el.parentElement.clientWidth;
    const maxScroll = -(Math.max(0, el.scrollWidth - containerWidth));
    const scrollAmount = containerWidth * 0.8;
    
    let newPos = scrollPos + (-dir * scrollAmount);
    
    if (newPos > 0) newPos = 0;
    if (newPos < maxScroll) newPos = maxScroll;
    
    setScrollPos(newPos);
    checkEdges(newPos);
  };

  return { trackRef, atStart, atEnd, scrollPos, scroll };
};
