import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'mbti-running',
  brand: {
    displayName: 'MBTI 러닝',
    primaryColor: '#3182F6',
    icon: 'https://static.toss.im/appsintoss/29713/1d57bb0e-f4b5-4f5e-bfa5-9fe725b807a7.png',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
});