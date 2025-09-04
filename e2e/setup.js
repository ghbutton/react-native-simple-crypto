import { device, element, by, expect } from 'detox';

// Global test setup for Detox E2E tests
global.console = {
  ...console,
  // Uncomment to ignore console.log during E2E tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Setup function that runs before all tests
beforeAll(async () => {
  await device.launchApp();
});

// Setup function that runs before each test
beforeEach(async () => {
  await device.reloadReactNative();
});
