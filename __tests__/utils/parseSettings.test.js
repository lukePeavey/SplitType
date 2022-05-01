import parseSettings from '../../lib/utils/parseSettings'

describe(`utils.parseSettings`, () => {
  it(`Accepts \`split\` as an alias for \`types\``, () => {
    expect(parseSettings({ split: 'words' }).types).toEqual(['words'])
  })
})
