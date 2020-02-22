import { useEffect, useState } from 'react';

const useWindowSize = () => {
  function getSize() {
    return {
      height: window.innerHeight - 139,
      width: window.innerWidth - 540,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getSize());
    };

    let debounceResize: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', () => {
      clearTimeout(debounceResize);
      debounceResize = setTimeout(handleResize, 1000);
    });
  }, []);

  return windowSize;
};
export { useWindowSize };
