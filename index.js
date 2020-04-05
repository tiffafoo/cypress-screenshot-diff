const { addCommands } = require('./src/commands');

const {
  baseExists,
  compareScreenshots,
  onAfterScreenshot,
  addScreenshotDiffPlugin,
} = require('./src/plugins');

module.exports = {
  addCommands,
  baseExists,
  compareScreenshots,
  onAfterScreenshot,
  addScreenshotDiffPlugin,
};
