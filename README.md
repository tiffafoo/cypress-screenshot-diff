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

1. Add this line to your project's `cypress/support/commands.js`:

   ```js
    import 'cypress-screenshot-diff';
   ```

2. Add/Update these tasks to your project's `cypress/plugins/index.js`

   ```js
   const {
     onAfterScreenshot,
     baseExists,
     compareScreenshots
   } = require("cypress-screenshot-diff");

   module.exports = (on, config) => {
     // `on` is used to hook into various events Cypress emits
     // `config` is the resolved Cypress config
     on('after:screenshot', onAfterScreenshot);
     on('task', {
       baseExists,
       compareScreenshots,
     });
   };
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
