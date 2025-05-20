
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.09aaf4d1905c43edb00cc706db9b260b',
  appName: 'Voice Notes',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://09aaf4d1-905c-43ed-b00c-c706db9b260b.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  ios: {
    contentInset: "always"
  }
};

export default config;
