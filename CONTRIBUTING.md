# Contributing

If you have any feedback, questions, or feature requests, please feel free to open an issue.

## Setup

1. Fork and clone the repository
2. Install dependencies

## Project Structure

```
 split-type/
    ├── .storybook/   # storybook config
    ├── .github/      # Github actions config
    ├── __tests__/    # unit tests
    ├── __stories__/  # visual examples and tests
    ├── lib/          # library source code
```

## Tests

We use [Jest](https://jestjs.io/), [Storybook](https://storybook.js.org/), and [Puppeteer](https://pptr.dev) for testing.

The project includes two types of tests: unit tests and visual tests.

### Unit Tests

We use [Jest](https://jestjs.io/) for unit testing pure functions

### Visual Tests

To test the overall functionality of the library, we use visual tests that run in a actual browser. This makes it possible to test features that rely on visual rendering (such as splitting text into lines, or applying absolute position to split text nodes.)

We use the following libraries for visual testing:

- [Storybook](https://storybook.js.org/)
- [Puppeteer](https://pptr.dev)
- [@storybook/addon-storyshots-puppeteer](https://storybook.js.org/addons/@storybook/addon-storyshots-puppeteer)

The `__stories__` directory contains a series examples that test different features or scenarios. Each example includes the following variations:

- Not Split (renders the element without splitting text to provide a visual baseline)
- Split Lines, Words, and Characters
- Split Lines and Words
- Split Words and Characters
- Split Lines
- Split Words
- Split Characters

The primary purpose of the visual tests is to ensure that:

1. `SplitType` creates the correct DOM structure for a given set of parameters and target element(s).
2. `SplitType` does not change the visual appearance of the text in any unexpected ways.

Note: in general, there should be no visual difference between the different variations of an example. Only the underlying DOM structure should change. You can toggle the outline feature in the storybook toolbar to outline the individual DOM on the page. This provides a visual representation of how the dom structure changes in each variation.

## Running tests

<br>

**Running unit tests**

To run the unit tests (in the `__tests__` directory):

```sh
$ yarn run test
```

```sh
$ yarn run test:watch
```

<br>

**Running storybook locally**

This will start storybook on a local server. It will update automatically if you make any changes.

```sh
$ yarn run storybook
```

<br>

**Running [Puppeteer](https://pptr.dev) tests in locally**

This runs the [Puppeteer](https://pptr.dev) tests (visual tests) against the local storybook server.

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
