export const baseArgTypes = {
  types: {
    description: 'Specify what units text will be split into',
    control: 'select',
    options: [
      'none',
      'lines, words, chars',
      'lines, words',
      'lines, chars',
      'words, chars',
      'lines',
      'words',
      'chars',
    ],
  },
  position: {
    description: 'Choose the type of positioning used for split text elements',
    options: ['relative', 'absolute'],
    control: 'select',
  },
  children: {
    description: 'The inner HTML of the element',
    control: 'text',
  },
}

export const defaults = {}
