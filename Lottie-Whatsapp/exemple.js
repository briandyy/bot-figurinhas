const fs = require('fs');
const path = require('path');
const { buildLottieSticker } = require('./src/index');

/**
 * Example helper that builds a .was sticker from an incoming image buffer.
 */
async function buildStickerFromBuffer(imageBuffer) {
  const outputPath = path.resolve(__dirname, 'example_output.was');

  await buildLottieSticker({
    baseFolder: path.resolve(__dirname, 'src', 'exemple'),
    buffer: imageBuffer,
    mime: 'image/jpeg',
    output: outputPath,
    jsonRelativePath: 'animation/animation_secondary.json'
  });

  return fs.readFileSync(outputPath);
}

module.exports = { buildStickerFromBuffer };
