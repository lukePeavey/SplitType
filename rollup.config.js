import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import banner from 'rollup-plugin-banner'

const fileHeader = `SplitType
https://github.com/lukePeavey/SplitType
@version <%= pkg.version %>
@author Luke Peavey <lwpeavey@gmail.com>`

export default [
  // UMD bundle
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/split-type.js',
      format: 'umd',
      name: 'SplitType',
    },
    plugins: [babel({ babelHelpers: 'bundled' }), banner(fileHeader)],
  },
  // Minified UMD bundle
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/split-type.min.js',
      format: 'umd',
      name: 'SplitType',
    },
    plugins: [babel({ babelHelpers: 'bundled' }), terser(), banner(fileHeader)],
  },
]
