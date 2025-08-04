import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_APP_SUPABASE_URL),
      'process.env.VITE_APP_SUPABASE_KEY': JSON.stringify(env.VITE_APP_SUPABASE_KEY),
      'process.env.VITE_APP_BASE_URL': JSON.stringify(env.VITE_APP_BASE_URL)
    },
    plugins: [react(), tailwindcss()],
    server: {
        host: '0.0.0.0',
        port: 5173,
    }
  }
})
