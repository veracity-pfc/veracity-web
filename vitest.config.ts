import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,

    setupFiles: ['src/tests/setupTests.ts'],

    include: ['src/tests/**/*.test.ts', 'src/tests/**/*.test.tsx'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],

      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/api/**',
        'src/setupTests.ts',     
        'src/App.tsx',
        'src/pages/PrivacyPolicy/**',
        'src/pages/TermsOfUse/**',
        'src/pages/About/**',
        'src/pages/Home/**',
        'src/pages/Profile/**',
        'src/pages/AdminDashboard/**',
        '**/*.d.ts',
        '**/__tests__/**',
        '**/*.test.*',
      ],

      thresholds: {
        statements: 50,
        branches: 40,
        functions: 50,
        lines: 50,
      },
    },
  },
})
