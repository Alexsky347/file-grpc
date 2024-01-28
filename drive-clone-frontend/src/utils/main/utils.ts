import { useEffect, useMemo, useRef } from 'react';

function debounce(callback: () => void, delay: number): () => void {
  let timer: number;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
    }, delay);
  };
}

const useDebounce = (callback: () => void) => {
  const reference = useRef<() => void>();

  useEffect(() => {
    reference.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const function_ = () => {
      reference.current?.();
    };

    return debounce(function_, 1000);
  }, []);

  return debouncedCallback;
};

export { debounce, useDebounce };
