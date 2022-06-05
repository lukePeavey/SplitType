import { Data, removeData } from '../../lib/Data'

describe(`Data(owner)`, () => {
  it(`Returns empty object when owner is undefined`, () => {
    expect(Data(undefined)).toEqual({})
  })
})
