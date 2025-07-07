/*global process*/
import path from 'path'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'

const { root } = path.parse(process.cwd())

function external(id) {
  return !id.startsWith('.') && !id.startsWith(root)
}

export default {
  input: {
    index: `src/index.ts`,
    utils: `src/utils.ts`,
    effect: `src/effect.ts`,
  },
  output: {
    dir: 'dist',
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: 'src',
    entryFileNames: '[name].js',
  },
  external,
  plugins: [
    replace({
      'import.meta.env?.MODE': 'process.env.NODE_ENV',
      delimiters: ['\\b', '\\b(?!(\\.|/))'],
      preventAssignment: true,
    }),
    typescript({
      declaration: true,
      emitDeclarationOnly: true,
      outDir: 'dist',
      exclude: ['tests/**/*'],
    }),
  ],
}
