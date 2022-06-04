import path from 'path'
import initStoryshots from '@storybook/addon-storyshots'
import { puppeteerTest } from '@storybook/addon-storyshots-puppeteer'

const isDevelopment = process.env.NODE_ENV === 'development'
// In development mode, run the tests on the local storybook instances.
// This requires storybook to be running on the local dev server.
// When NODE_ENV is not development (CI), the tests will run on a static
// build of the storybook
const storybookUrl = isDevelopment
  ? 'http://localhost:6006/'
  : path.join('file://', __dirname, '../storybook-static/')

initStoryshots({
  suite: 'Puppeteer storyshots',
  test: puppeteerTest({ storybookUrl }),
  framework: 'svelte',
})
