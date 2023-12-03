import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import info from './package.json' assert { type:  'json' }

const banner = `/**
* SplitType ${info.version}
* https://github.com/lukePeavey/SplitType
* Author: Luke Peavey
* License: https://opensource.org/license/isc-license-txt/
*/`

export default [
  // Minified UMD bundle
  {
    input: 'lib/index.js',
    output: {
      banner,
      file: 'umd/index.min.js',
      format: 'umd',
      name: 'SplitType',
    },
    plugins: [babel({ babelHelpers: 'bundled' }), terser()],
  },
  // UMD bundle
  {
    input: 'lib/index.js',
    output: {
      banner,
      file: 'umd/index.js',
      format: 'umd',
      name: 'SplitType',
    },
    plugins: [babel({ babelHelpers: 'bundled' })],
  },
  // ESM Module
  {
    input: 'lib/index.js',
    output: {
      banner,
      file: 'dist/index.js',
      format: 'esm',
      name: 'SplitType',
    },
    plugins: [babel({ babelHelpers: 'bundled' })],
  },
]
