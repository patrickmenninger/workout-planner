import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
        "VITE_SUPABASE_URL": JSON.stringify(process.env.VITE_SUPABASE_URL),
        "VITE_SUPABASE_KEY": JSON.stringify(process.env.VITE_SUPABASE_KEY),
    },
    plugins: [react(), tailwindcss()],
    server: {
        host: '0.0.0.0',
        port: 5173,
    }
  }
})
