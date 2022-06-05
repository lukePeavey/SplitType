import Example from '../components/Example.svelte'

export default function getTemplate(defaultArgs) {
  return (args) => {
    const { children, className = '', ...options } = { ...defaultArgs, ...args }
    return {
      Component: Example,
      props: { children, className, options },
    }
  }
}
