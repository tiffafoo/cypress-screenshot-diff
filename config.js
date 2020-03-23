const CYPRESS_PATH_QUERYPARAM = 'p=';

let config = {
  // Uses this to find your screenshot path in the root screenshot path
  prefixDifferentiator: '___',
  testIdentifier: '.spec.ts',
  screenshotsFolderName: 'screenshots',
  pixelMatchOptions: {
    threshold: 0.3,
  },
};

/**
 * Allow to user to set the config
 */
function configureCypressScreenshotDiff(newConfig) {
  config = {
    ...config,
    ...newConfig,
  };
}

function getConfig() {
  return config;
}

module.exports = {
  configureCypressScreenshotDiff,
  CYPRESS_PATH_QUERYPARAM,
  getConfig,
};
