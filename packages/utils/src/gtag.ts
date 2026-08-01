declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const sendGAEvent = (action: string, params?: Record<string, string | number | boolean>) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, params);
};
