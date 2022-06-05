import Example from '../components/Example.svelte'

export default function getTemplate(defaultArgs) {
  return (args) => {
    const { children, ...options } = { ...defaultArgs, ...args }
    return {
      Component: Example,
      props: { children, options },
    }
  }
}
