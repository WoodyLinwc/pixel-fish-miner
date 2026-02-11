// Type declarations for Capacitor
interface Window {
  Capacitor?: {
    getPlatform: () => string;
    isNativePlatform: () => boolean;
  };
}
