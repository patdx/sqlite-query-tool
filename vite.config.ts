import react from '@vitejs/plugin-react';
import ssr from 'vite-plugin-ssr/plugin';
import { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [
    react(),
    ssr({
      prerender: true,
    }),
  ],
  ssr: {
    // TODO: needs to be noExternal
    // for build mode
    // but external for dev mode
    noExternal: ['node-sql-parser'],
  },
};

export default config;
