import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals/attribution';

export const reportWebVitals = (onPerfEntry: any | undefined): void => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onLCP(onPerfEntry);
  }
};
