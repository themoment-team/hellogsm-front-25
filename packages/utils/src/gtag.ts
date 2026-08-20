declare global {
  interface Window {
    gtag?: (command: string, ...args: [string | object, ...unknown[]]) => void;
  }
}

type QueuedGAEvent = {
  action: string;
  params?: Record<string, string | number | boolean>;
};

let gaEventQueue: QueuedGAEvent[] = [];

export const sendGAEvent = (action: string, params?: Record<string, string | number | boolean>) => {
  if (typeof window === 'undefined') return;

  if (!window.gtag) {
    gaEventQueue.push({ action, params });
    return;
  }

  window.gtag('event', action, params);
};

export const flushGAEventQueue = () => {
  if (typeof window === 'undefined' || !window.gtag) return;

  gaEventQueue.forEach(({ action, params }) => window.gtag!('event', action, params));
  gaEventQueue = [];
};
