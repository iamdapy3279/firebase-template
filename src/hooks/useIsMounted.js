import { useRef, useEffect } from 'react';

export const useIsMounted = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Component is mounted
    isMountedRef.current = true;
    
    return () => {
      // Component is unmounting
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
};