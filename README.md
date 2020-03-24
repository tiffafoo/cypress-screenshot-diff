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
    const { addCommands } = require("cypress-screenshot-diff");
    
    addCommands();
   ```

2. Add/Update these tasks to your project's `cypress/plugins/index.js`

   ```js
   const { addScreenshotDiffPlugin } = require("cypress-screenshot-diff");

   module.exports = (on, config) => {
     addScreenshotDiffPlugin(on,config);
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

## Why
In Cypress' infancy, before visual regression plugins, I made my own for personal use using jimp's diff utility and Cypress. However, as I started working with bigger monorepos, keeping the screenshots in a single folder, which is where Cypress takes screenshots, was getting pretty hefty for devs. Unfortunately, Cypress does not allow for dynamic screenshot folder roots either, and I didn't find any that did what I wanted structure wise. So I reworked my existing implementation to use pixelmatch and allow for different screenshot folders. If you come accross the same problem, hopefully this will help!

## Inspired By
- [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot)
- [cypress-image-snapshot](https://github.com/palmerhq/cypress-image-snapshot)

