/**
 * Helpers for handling images. Most of the resizing logic was taken from
 * https://github.com/americanexpress/jest-image-snapshot/pull/42
 */
const fs = require('fs');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const { getConfig } = require('../config');

/**
 * Helper function to create reusable image resizer
 */
const createImageResizer = (width, height) => (source) => {
  const resized = new PNG({ width, height, fill: true });
  PNG.bitblt(source, resized, 0, 0, source.width, source.height, 0, 0);
  return resized;
};

/**
 * Fills new area added after resize with transparent black color.
 */
const fillSizeDifference = (width, height) => (image) => {
  const inArea = (x, y) => y > height || x > width;
  const newImage = image;

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      if (inArea(x, y)) {
        // eslint-disable-next-line no-bitwise
        const idx = ((image.width * y) + x) << 2;
        newImage.data[idx] = 0;
        newImage.data[idx + 1] = 0;
        newImage.data[idx + 2] = 0;
        newImage.data[idx + 3] = 64;
      }
    }
  }
  return newImage;
};

/**
 * Aligns images sizes to biggest common value
 * and fills new pixels with transparent pixels
 */
function alignImagesToSameSize(firstImage, secondImage) {
  // Keep original sizes to fill extended area later
  const firstImageWidth = firstImage.width;
  const firstImageHeight = firstImage.height;
  const secondImageWidth = secondImage.width;
  const secondImageHeight = secondImage.height;
  // Calculate biggest common values
  const resizeToSameSize = createImageResizer(
    Math.max(firstImageWidth, secondImageWidth),
    Math.max(firstImageHeight, secondImageHeight),
  );
  // Resize both images
  const resizedFirst = resizeToSameSize(firstImage);
  const resizedSecond = resizeToSameSize(secondImage);
  // Fill resized area with black transparent pixels
  return [
    fillSizeDifference(firstImageWidth, firstImageHeight)(resizedFirst),
    fillSizeDifference(secondImageWidth, secondImageHeight)(resizedSecond),
  ];
}

/**
 * Compares a base and actual image and returns the pixel difference
 * and diff PNG for writing the diff image to.
 * @param {string} basePath - Full file path to base image
 * @param {string} actualPath - Full file path to actual image
 */
function getDiffPixels(basePath, actualPath) {
  const { pixelMatchOptions } = getConfig();
  const rawBase = PNG.sync.read(fs.readFileSync(basePath));
  const rawActual = PNG.sync.read(fs.readFileSync(actualPath));

  const hasSizeMismatch = (
    rawBase.height !== rawActual.height
    || rawBase.width !== rawActual.width
  );

  const [base, actual] = hasSizeMismatch
    ? alignImagesToSameSize(rawBase, rawActual)
    : [rawBase, rawActual];

  const diff = new PNG({ width: base.width, height: base.height });

  const diffPixels = pixelmatch(
    actual.data,
    base.data,
    diff.data,
    diff.width,
    diff.height,
    pixelMatchOptions,
  );

  return { diffPixels, diff };
}

module.exports = getDiffPixels;
