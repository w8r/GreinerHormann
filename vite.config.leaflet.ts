import { defineConfig } from 'vite';
import { resolve } from 'path';
import pkg from './package.json';

const banner = `\
/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 *
 * @author ${pkg.author}
 * @license ${pkg.license}
 * @preserve
 */
`;

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/leaflet.ts'),
      name: 'greinerHormann',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') {
          return 'leaflet.js';
        }
        return `leaflet.${format}.js`;
      },
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        banner,
      },
    },
  },
});
