import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import banner from 'rollup-plugin-banner'

const fileHeader = `SplitType
https://github.com/lukePeavey/SplitType
@version <%= pkg.version %>
@author Luke Peavey <lwpeavey@gmail.com>`

export default [
  // Minified UMD bundle
  {
    input: 'lib/index.js',
    output: {
      file: 'umd/index.min.js',
      format: 'umd',
      name: 'SplitType',
    },
    plugins: [babel({ babelHelpers: 'bundled' }), terser(), banner(fileHeader)],
  },
  // UMD bundle
  {
    input: 'lib/index.js',
    output: {
      file: 'umd/index.js',
      format: 'umd',
      name: 'SplitType',
    },
    plugins: [babel({ babelHelpers: 'bundled' }), banner(fileHeader)],
  },
  // ESM Module
  {
    input: 'lib/SplitType.js',
    output: {
      file: 'dist/index.js',
      format: 'esm',
      name: 'SplitType',
    },
    plugins: [babel({ babelHelpers: 'bundled' }), banner(fileHeader)],
  },
]
