// .storybook/main.js

module.exports = {
  stories: [
    '../__stories__/**/*.stories.mdx',
    '../__stories__/**/*.stories.js',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-mdx-gfm'
  ],

  staticDirs: ['../__stories__/assets'],

  framework: {
    name: '@storybook/svelte-webpack5',
    options: {}
  },

  docs: {
    autodocs: true
  }
}
