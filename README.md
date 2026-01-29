## Project Structure

The repository follows a **Page Object Model (POM)** design pattern, ensuring that locators and actions are well-organized and reusable.

See the [POM docs](https://github.com/hmcts/tcoe-playwright-example/blob/master/docs/PAGE_OBECT_MODEL.md) for more info

```sh
├── tests/                  # Test files
├── user-flow/              # User flows that makeup the entire journey
├── api-client/             # Setting up test data via api
├── page-objects/           # Page objects containing page elements and functions
├── utils/                  # Utility functions or common tasks (e.g., login, generating data etc)
├── fixtures/               # Test files/payloads for sending api requests or uploading documents
```

TCoE Best Practices for setting up playwright in your service can be found in the [playwright-e2e/readme.md](https://github.com/hmcts/tcoe-playwright-example/blob/master/docs/BEST_PRACTICE.md).

## Contributing

We all share the responsibility of ensuring this repo is up to date and accurate in terms of best practice. If you would like to contribute you can raise a github issue with the improvement you are suggesting or raise a PR yourself. See the [contribution guide](https://github.com/hmcts/tcoe-playwright-example/blob/master/CONTRIBUTING.md) for more info.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v14+)
- Yarn

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/hmcts/ia-citizen-ui-e2e.git
```

Once cloned, run the following command to install dev dependencies:

```bash
yarn install
```

run the following command after running yarn install in order to install playwright browsers

```bash
yarn setup
```

### Env Config

Run the following command found in package.json to fetch secrets for aat env, Ensure you have azure cli installed and logged in.

AAT

```bash
yarn load-secrets-aat
```

### Running Tests

Run all tests using the Playwright test runner:

```bash
yarn playwright test
```

To run a specific test file:

```bash
yarn playwright test tests/specific_test_file.spec.ts
```

To run tests on a specific browser:

```bash
yarn playwright test --project=chrome
yarn playwright test --project=firefox
yarn playwright test --project=webkit
```

### Test Tagging

You can use tags to group tests, for example:

```bash
yarn playwright test --grep @smoke
```

### Debugging Tests

To run tests with tracing, screenshots, and video recording for debugging purposes:

```bash
yarn playwright test --trace on --video on --screenshot on
```

Alternatively, you can use `page.pause()` inside your test whilst in `--headed` mode to pause execution at a specific point.

### Accessibility Tests

Run accessibility checks as part of your tests using Axe Core:

```bash
yarn playwright test --grep @a11y
```
