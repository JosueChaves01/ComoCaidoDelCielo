import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno (incluidas las que no tienen el prefijo VITE_)
  const env = loadEnv(mode, process.cwd(), '')
  const n8nTarget = env.N8N_HOST_URL || 'https://jotech.mytry.dev/'
  
  if (mode !== 'test') {
    console.log('🔄 N8N Proxy Target:', n8nTarget)
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    assetsInclude: ['**/*.svg', '**/*.csv'],

    server: {
      cors: true, // Permite CORS globalmente para cualquier petición
      proxy: {
        // Enrutamiento local de los webhooks normales
        '/webhook': {
          target: n8nTarget,
          changeOrigin: true,
          secure: false,
        },
        // Enrutamiento exclusivo para el webhook remoto (evita bloqueos de navegador)
        '/jotech-webhook': {
          target: 'https://jotech.mytry.dev',
          changeOrigin: true,
          secure: true,
          headers: {
            'Host': 'jotech.mytry.dev',
            'Origin': 'https://jotech.mytry.dev',
          },
          rewrite: (path) => path.replace(/^\/jotech-webhook/, '/webhook')
        }
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  }
})
