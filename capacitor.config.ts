import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.planner',
  appName: 'Planner',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
