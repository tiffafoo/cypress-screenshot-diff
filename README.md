🚧This project is currently under development and may undergo changes 🚧

# cypress-screenshot-diff
📸Cypress screenshot diffing commands with multiple screenshot folders ability

## Installation
This module is distributed via npm which is bundled with node and should be installed as one of your project's `devDependencies`:

```bash
npm install --save-dev cypress-screenshot-diff
```

## Usage
cypress-screenshot-diff extends Cypress' cy command and adds `matchScreenshot()`.

Add this line to your project's `cypress/support/commands.js`:

```js
import 'cypress-screenshot-diff';
```

## Configuration
To configure cypress-screenshot-diff, use the following custom command:

```js
cy.configureCypressScreenshotDiff(config)
```

### Example
```js
cy.matchScreenshot();
cy.get("h1").matchScreenshot();
```
