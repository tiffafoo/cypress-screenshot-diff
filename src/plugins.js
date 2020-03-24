const fs = require('fs');
const { PNG } = require('pngjs');
const getDiffPixels = require('./utils/images');
const createImageFileName = require('./utils/files');

/**
 * Checks if a base image exists
 * @param {string} path - Folder path where you can find the base.png image
 * @returns {boolean} true if path/base.png exists, false if not.
 */
function baseExists(path) {
  const fileName = createImageFileName(path, 'base');
  const exists = fs.existsSync(fileName);

  if (!exists) {
    console.log(
      'Base image does not exist. This means a new one will be created. If your base should exist, something went wrong.',
    );
  }
  return exists;
}

/**
 * Runs a visual regression test.
 * @param {string} screenshotFolder - Full screenshots folder where the base/actual/diff
 *                           images will be compared and written to.
 *
 * @returns {number} - Number of pixels which the base and actual image differ
 */
function compareScreenshots(screenshotFolder) {
  const basePath = createImageFileName(screenshotFolder, 'base');
  const actualPath = createImageFileName(screenshotFolder, 'actual');
  const { diffPixels, diff } = getDiffPixels(basePath, actualPath);

  if (diffPixels) {
    // Create diff.png next to base and actual for review
    fs.writeFile(
      createImageFileName(screenshotFolder, 'diff'),
      PNG.sync.write(diff),
      (err) => {
        if (err) {
          console.error('❌Diff exists but unable to create diff.png', err);
        }
      },
    );
  } else {
    // Delete created actual.png. Not needed if there's no diff
    fs.unlink(actualPath, (err) => {
      if (err) {
        console.error('❌No diff but unable to deleteactualPath}', err);
      }
    });
  }

  return diffPixels;
}

/**
 * Renames all root cypress screenshots to where the test was actually run.
 * Should NOT be used standalone. Works with the matchScreenshot task.
 * @param {Cypress.ScreenshotDetails} details
 */
function onAfterScreenshot(details) {
  console.log('🧸 Screenshot was saved to:', details.path);
  if (!details.path.match('cypress')) {
    return new Promise();
  }

  const getNewPath = (path) => {
    let newPath = path
      .slice(path.lastIndexOf('___') + 3);
    console.log(newPath);

    if (newPath.startsWith('/')) {
      newPath = `.${newPath}`;
    }

    return newPath;
  };

  const newPath = getNewPath(details.path);
  const newPathDir = newPath.substring(0, newPath.lastIndexOf('/'));

  try {
    fs.mkdirSync(newPathDir, { recursive: true });
    console.log('🧸 No screenshot folder found in the package. Created new screenshot folder:', newPathDir);
  } catch (err) {
    console.error('❌ Error creating new screenshot folder:', newPathDir, err);
  }

  return new Promise((resolve, reject) => {
    fs.rename(details.path, newPath, (err) => {
      if (err) { reject(err); }

      // because we renamed/moved the image, resolve with the new path
      // so it is accurate in the test results
      resolve({ path: newPath });
    });
  });
}

module.exports = {
  baseExists,
  compareScreenshots,
  onAfterScreenshot,
};
