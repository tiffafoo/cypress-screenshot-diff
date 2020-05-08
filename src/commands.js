const {
  configureCypressScreenshotDiff,
  getConfig, CYPRESS_PATH_QUERYPARAM,
} = require('./config');

function getParentIndex(context) {
  const currentId = context.test.parent.id;
  let { parent } = context.test;

  while (parent.parent) {
    parent = parent.parent;
  }

  return parent.suites.findIndex((suite) => suite.id === currentId);
}

/**
 * Gets the scripts from the Cypress browser and return the path of the test
 * script that is currently trying to match the screenshot
 * @param {Context} context
 * @param {string?} rawName
 * @returns {{name: string, screenshotsFolder: string}}
 */
function getTestFolderPathFromScripts(context, rawName) {
  const config = getConfig();
  let scriptIndex = getParentIndex(context);
  const scripts = document.querySelectorAll('script');
  let actualScript;

  if (scriptIndex === null || scriptIndex === -1) {
    throw new Error(
      '❌ Could not find scripts in the Cypress DOM to infer the test folder path',
    );
  }

  for (let i = 0; i < scripts.length; i += 1) {
    const script = scripts[i];

    if (!script.src || !script.src.match('.spec.ts')) {
      scriptIndex += 1;
    } else if (i === scriptIndex) {
      actualScript = script;
      break;
    }
  }

  if (!actualScript) {
    throw new Error(
      '❌ Could not find matching script in the Cypress DOM to infer the test folder path',
    );
  }

  // Examples:
  // src = "http://localhost:3000/__cypress/tests?p=packages/flights/forced-choice/test/e2e/forced-choice.spec.ts-350"
  // src = "http://localhost:3000/__cypress/tests?p=cypress/support/index.js-379"
  const { src } = actualScript;
  const testName = src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf(config.testIdentifier));
  const name = rawName || testName;

  return {
    name,
    screenshotsFolder: `${src.substring(
      src.indexOf(CYPRESS_PATH_QUERYPARAM) + CYPRESS_PATH_QUERYPARAM.length,
      src.lastIndexOf(testName),
    )}/${config.screenshotsFolderName}/${name}/`,
  };
}

/**
 * @param {Cypress.PrevSubject} subject - Provided by Cypress, the element to screenshot
 * @param {string?} rawName - (optional) Name to use for the screenshot folder
 * @param {Partial<Cypress.ScreenshotOptions>} options - options to pass to cy.screenshot
 */
function matchScreenshot(subject, args) {
  const config = getConfig();
  const rawName = args && args.rawName;
  const options = args && args.options;

  const { name, screenshotsFolder } = getTestFolderPathFromScripts(this, rawName);

  cy.task('baseExists', screenshotsFolder).then((hasBase) => {
    const type = hasBase ? 'actual' : 'base';
    
    if (!subject) {
      throw new Error(`❌Error: given subject was undefined, please check the selectors. baseExists was ${hasBase}.`);
    }

    subject.each((el) => {
      const target = el ? cy.wrap(el) : cy;
      // For easy slicing of path ignoring the root screenshot folder
      target.screenshot(`${config.prefixDifferentiator}${screenshotsFolder}/${type}`, options);

      if (!hasBase) {
        cy.log(`✅Successfully created new base image of ${name}. Check out ${screenshotsFolder}/base.png`);

        return;
      }

      cy.task('compareScreenshots', screenshotsFolder).then((diffPixels) => {
        if (diffPixels === 0) {
          cy.log(`✅Actual image of ${name} was the same as base`);

          return null;
        }

        throw new Error(
          `❌Actual image of ${name} differed by ${diffPixels} pixels. Check out `,
          `${screenshotsFolder}/diff.png for more information.`,
        );
      });
    });

    return null;
  });
}

function addCommands() {
  Cypress.Commands.add('configureCypressScreenshotDiff', configureCypressScreenshotDiff);

  Cypress.Commands.add(
    'matchScreenshot',
    {
      prevSubject: ['optional', 'element', 'window', 'document'],
    },
    matchScreenshot,
  );
}

module.exports = { addCommands };
