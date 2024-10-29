/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/shared/utils/test-utils.ts',
    include: ['src/**/*.spec.{ts,tsx}'],
    coverage: {
      enabled: true,
      reportsDirectory: 'coverage',
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/shared/utils/test-utils.ts',
        '**/*.d.ts',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/types.ts',
        '**/interfaces/**',
        '**/index.ts'
      ]
      // thresholds: {
      //   lines: 80,
      //   functions: 80,
      //   branches: 80,
      //   statements: 80
      // }
    }
  }
})
