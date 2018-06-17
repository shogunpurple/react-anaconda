import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import external from 'rollup-plugin-peer-deps-external';
import uglify from 'rollup-plugin-uglify-es';

export default {
  input: 'src/index.js',
  output: [
    {
      format: 'cjs',
      file: pkg.main
    },
    {
      format: 'es',
      file: pkg.module
    }
  ],
  plugins: [
    external(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
};
