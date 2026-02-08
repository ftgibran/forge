import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vitest-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false,
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
    tsconfigPaths(),
  ],
})
