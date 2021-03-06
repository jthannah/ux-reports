import { config } from '@vue/test-utils'

// This is so that Vue transition tags are not stubbed.
// When they are stubbed, access to containing elements is lost
config.global.stubs = {
  transition: false,
}

// Mocking the virtual:generated-pages module that is generated by vite-plugin-pages
jest.mock('virtual:generated-pages', () => [], { virtual: true })
