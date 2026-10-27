import { useEffect, useState } from 'react';

// Global simulation flag for testing in development/preview
let globalSimulatedOffline = false;

export function setSimulatedOffline(val: boolean) {
  globalSimulatedOffline = val;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('mam_connectivity_change', {
        detail: { isSimulatedOffline: val },
      })
    );
  }
}

export function getSimulatedOffline(): boolean {
  return globalSimulatedOffline;
}

/**
 * Reactive hook returning whether the app is effectively online.
 * Returns false if:
 * 1. The browser's native navigator.onLine is false, OR
 * 2. Simulated offline mode is toggled for testing preview
 */
export function useOnlineStatus(): boolean {
  const [isSystemOnline, setIsSystemOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSimulated, setIsSimulated] = useState<boolean>(globalSimulatedOffline);

  useEffect(() => {
    const handleOnline = () => setIsSystemOnline(true);
    const handleOffline = () => setIsSystemOnline(false);
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isSimulatedOffline?: boolean }>;
      if (customEvent?.detail?.isSimulatedOffline !== undefined) {
        setIsSimulated(customEvent.detail.isSimulatedOffline);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('mam_connectivity_change', handleCustomChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('mam_connectivity_change', handleCustomChange);
    };
  }, []);

  return isSystemOnline && !isSimulated;
}
