import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Test file patterns
    include: [
      'scripts/tests/**/*.test.{ts,mjs}',
      'src/**/*.test.{ts,tsx}',
    ],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      'templates',
    ],
    
    // Environment
    environment: 'node',
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: [
        'src/**/*.{ts,tsx}',
        'scripts/**/*.mjs',
      ],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'scripts/tests/**',
        'node_modules',
        'dist',
      ],
      thresholds: {
        // Start with low thresholds, increase over time
        statements: 10,
        branches: 10,
        functions: 10,
        lines: 10,
      },
    },
    
    // Globals for cleaner test syntax
    globals: true,
    
    // Timeout
    testTimeout: 10000,
  },
  
  // Resolve aliases matching the main project
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
