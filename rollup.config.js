import resolve  from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble    from 'rollup-plugin-buble';
import { terser } from "rollup-plugin-terser";
import { version, author, license, description, name } from './package.json';
import fs from 'fs';

const moduleName = 'greinerHormann';

const banner = `\
/**
 * ${name} v${version}
 * ${description}
 *
 * @author ${author}
 * @license ${license}
 * @preserve
 */
`;

module.exports = [{
  input: 'src/index.js',
  output: {
    file: `dist/${name}.js`,
    name: moduleName,
    sourcemap: true,
    format: 'umd',
    banner
  },
  plugins: [
    resolve(),  // so Rollup can find external libs
    commonjs(), // so Rollup can convert commonJS to an ES module
    buble()
  ]
}, {
  input: 'src/leaflet.js',
  output: {
    file: `dist/${name}.leaflet.js`,
    name: moduleName,
    sourcemap: true,
    format: 'umd',
    banner
  },
  plugins: [
    resolve(),  // so Rollup can find external libs
    commonjs(), // so Rollup can convert commonJS to an ES module
    buble()
  ]
}, {
  input: `test/js/test.js`,
  output: {
    file: `test/js/bundle.js`,
    name: moduleName,
    sourcemap: true,
    format: 'iife',
    banner,
    globals: { 'leaflet': 'L', 'leaflet-draw': 'L.Draw' }
  },
  plugins: [
    buble()
  ]
}, {
  input: `src/index.js`,
  output: {
    file: `dist/${name}.min.js`,
    name: moduleName,
    sourcemap: true,
    format: 'umd',
    banner
  },
  plugins: [
    buble(),
    terser({
      sourcemap: true,
      output: {
        comments: 'some'
      }
    })
  ]
}, {
  input: `src/leaflet.js`,
  output: {
    file: `dist/${name}.leaflet.min.js`,
    name: moduleName,
    sourcemap: true,
    format: 'umd',
    banner
  },
  plugins: [
    buble(),
    terser({
      sourcemap: true,
      output: {
        comments: 'some'
      }
    })
  ]
}];
