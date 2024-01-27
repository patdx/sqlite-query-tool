import react from '@vitejs/plugin-react';
import ssr from 'vike/plugin';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [
    react(),
    ssr({
      prerender: true,
    }),
  ],
};

export default config;
