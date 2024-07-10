import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode
 }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.apiKey': JSON.stringify(env.apiKey),
      'process.env.authDomain': JSON.stringify(env.authDomain),
      'process.env.projectId': JSON.stringify(env.projectId),
      'process.env.storageBucket': JSON.stringify(env.storageBucket),
      'process.env.messagingSenderId': JSON.stringify(env.messagingSenderId),
      'process.env.appId': JSON.stringify(env.appId),
      'process.env.measurementId': JSON.stringify(env.measurementId),
      'process.env.maintenance': JSON.stringify(env.maintenance),
    },
    plugins: [react()],
    rollupOptions: {
      input: './api/dist/index.js',
    },
  }
})
