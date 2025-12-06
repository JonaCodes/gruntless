import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const isDev = mode === 'development';
  const backendUrl = isDev ? 'http://localhost:3000' : env.VITE_BACKEND_URL;

  return {
    plugins: [react()],
    worker: {
      format: 'es',
    },
    server: {
      proxy: {
        '^/auth/(?!callback).*': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
      fs: {
        strict: false,
      },
      allowedHosts: ['semidiaphanously-chondritic-robbie.ngrok-free.dev'],
    },
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, '../shared'),
        'public/src': path.resolve(__dirname, 'src'),
      },
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
  };
});
