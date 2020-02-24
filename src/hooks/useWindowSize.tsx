import { useEffect, useState } from 'react';

const useWindowSize = () => {
  function getSize() {
    return {
      x: window.innerWidth - 540,
      y: window.innerHeight - 139,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getSize());
    };

    let debounceResize: ReturnType<typeof setTimeout>;
    window.addEventListener('fullscreenchange', handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', () => {
        clearTimeout(debounceResize);
        debounceResize = setTimeout(handleResize, 1000);
      });
    };
  }, []);

  return windowSize;
};
export { useWindowSize };
