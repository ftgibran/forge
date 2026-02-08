import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vitest-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/generated/**',
        'src/**/*.spec.ts',
        'src/**/*.module.ts',
        'src/main.ts',
      ],
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
    tsconfigPaths(),
  ],
})
