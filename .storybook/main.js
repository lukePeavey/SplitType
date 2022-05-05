// .storybook/main.js

module.exports = {
  stories: [
    '../__stories__/**/*.stories.mdx',
    '../__stories__/**/*.stories.js',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  staticDirs: ['../__stories__/assets'],
}
