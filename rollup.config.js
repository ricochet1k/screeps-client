
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
// import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';

export default {
  entry: 'src/app.js',
  dest: 'static/js/main.min.js',
  format: 'iife',
  sourceMap: true, //'inline',
  plugins: [
    builtins(),
    //typescript(),
    vue(),
    babel({
      "runtimeHelpers": true,
      exclude: 'node_modules/**',
    }),
    commonjs({
      // ignoreGlobal: true,
      // namedExports: { 'node_modules/pixi.js': [ 'utils' ] }
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
	    preferBuiltins: false,
    }),
    globals(),
  ],
};