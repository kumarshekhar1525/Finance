import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

function customBannerPlugin() {
  return {
    name: 'custom-banner',
    configureServer(server: any) {
      server.httpServer?.once('listening', () => {
        setTimeout(() => {
          console.log('\x1b[36m%s\x1b[0m', '─────────────────────────────────────────────────────────────');
          console.log('\x1b[1m\x1b[32m 🏛️  JanDhan Finance Portal Link:  \x1b[4mhttp://finance:3000\x1b[0m');
          console.log('\x1b[36m 🔗 Local Domain Link:             http://finance.local:3000\x1b[0m');
          console.log('\x1b[36m%s\x1b[0m', '─────────────────────────────────────────────────────────────\n');
        }, 200);
      });
    },
  };
}

export default defineConfig(() => {
  return {
    envDir: path.resolve(__dirname, '..'),
    plugins: [react(), tailwindcss(), customBannerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: true,
      allowedHosts: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
