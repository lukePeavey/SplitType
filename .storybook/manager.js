// .storybook/manager.js

import { addons } from '@storybook/addons'
import { themes } from '@storybook/theming'
import theme from './theme'

addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: false,
  panelPosition: 'bottom',
  sidebarAnimations: true,
  enableShortcuts: true,
  isToolshown: true,
  theme: theme,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  sidebar: {
    showRoots: true,
  },
})
