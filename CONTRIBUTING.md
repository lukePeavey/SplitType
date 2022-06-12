# Contributing

If you have any feedback, questions, or feature requests, please feel free to open an issue.

## Setup

1. Fork and clone the repository
2. Install dependencies

## Project Structure

```
 split-type/
    ├── .storybook/   # storybook config
    ├── .github/      # Github workflows
    ├── __tests__/    # unit tests
    ├── __stories__/  # Visual tests
    ├── lib/          # library source code
```

## Tests

We use [Jest](https://jestjs.io/), [Storybook](https://storybook.js.org/), [Puppeteer](https://pptr.dev) and [Chromatic]() for testing.

The project includes two types of tests: unit tests and visual tests.

### Unit Tests

### Visual Tests

To test the overall functionality of the library, we use visual tests that run in an actual browser. This makes it possible to test features that rely on visual rendering (such as splitting text into lines based on natural line breaks, or applying absolute position to split text nodes).

We use the following libraries for visual testing:

- [Storybook](https://storybook.js.org/)
- [Puppeteer](https://pptr.dev)
- [@storybook/addon-storyshots-puppeteer](https://storybook.js.org/addons/@storybook/addon-storyshots-puppeteer)

The `__stories__` directory contains a series examples that server as test cases. Each example includes the following variations.

- Not Split (renders the element without splitting text to provide a visual baseline)
- Split Lines, Words, and Characters
- Split Lines and Words
- Split Lines and characters
- Split Words and Characters
- Split Lines
- Split Words
- Split Characters

The primary purpose of the visual tests is to ensure that 1) SplitType creates the correct HTML structure when splitting text, and 2) that the split text in rendered correctly, without changing the visual appearance of the text.

When things are working correctly, there should be no visible difference between the different variations of a story. Only the underlying HTML structure should change. We use Puppeteer to run tests on the storybook examples to check that each variant has the expected HTML structure.

## Running tests

**Running storybook locally**

This will start storybook on a local server. It will update automatically when you make changes to the code.

```sh
$ yarn run storybook
```

<br>

**Running [Puppeteer](https://pptr.dev) tests in locally**

This runs the [Puppeteer](https://pptr.dev) tests against the local storybook server.

Note: you must start storybook before running this command

```sh
yarn run puppeteer
```

```sh
yarn run puppeteer:watch
```

<br>

**Running [Puppeteer](https://pptr.dev) tests on a static build**

This command will create a static build of the storybook site, then run the puppeteer tests in a headless browser. This command is used to run the puppeteer tests in a CI environment.

```sh
$ yarn run puppeteer:static
```
