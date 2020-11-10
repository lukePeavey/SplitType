import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default [
  // UMD bundle
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/split-type.js',
      format: 'umd',
      name: 'SplitType',
    },
    plugins: [babel({ babelHelpers: 'bundled' })],
  },
  // Minified UMD bundle
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/split-type.min.js',
      format: 'umd',
      name: 'SplitType',
    },
    plugins: [babel({ babelHelpers: 'bundled' }), terser()],
  },
]
