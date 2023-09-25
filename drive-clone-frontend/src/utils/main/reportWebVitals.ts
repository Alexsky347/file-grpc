import { onLCP, onFID, onCLS, onFCP, onTTFB } from 'web-vitals/attribution';
import { ReportHandler } from "web-vitals";

export const reportWebVitals = (onPerfEntry: ReportHandler | undefined): void => {
    if (onPerfEntry && typeof onPerfEntry === 'function') {
        onCLS(onPerfEntry);
        onFID(onPerfEntry);
        onFCP(onPerfEntry);
        onTTFB(onPerfEntry);
        onLCP(onPerfEntry);
    }
};
