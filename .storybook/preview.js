import { themes } from '@storybook/theming'
import theme from './theme'

// or global addParameters
export const parameters = {
  docs: {
    theme: theme,
  },
  previewTabs: {
    'storybook/docs/panel': {
      hidden: true,
    },
  },
}
