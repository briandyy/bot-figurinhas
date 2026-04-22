function getRuntimeConfig() {
  return {
    phoneNumber: process.env.PHONE_NUMBER,
    commandPrefix: process.env.COMMAND_PREFIX || '!',
    botName: process.env.BOT_NAME || 'StickerBot',
    stickerPackname: process.env.STICKER_PACKNAME || 'Sticker Pack',
    stickerAuthor: process.env.STICKER_AUTHOR || 'StickerBot',
    maxVideoSeconds: Number(process.env.MAX_VIDEO_SECONDS || 8),
    authFolder: process.env.AUTH_FOLDER || 'auth_info_baileys',
    lottieBaseFolder: process.env.LOTTIE_BASE_FOLDER || './Lottie-Whatsapp/src/exemple',
    lottieMainJsonRelativePath: process.env.LOTTIE_MAIN_JSON_RELATIVE_PATH || 'animation/animation.json',
    lottieSecondaryJsonRelativePath:
      process.env.LOTTIE_SECONDARY_JSON_RELATIVE_PATH || 'animation/animation_secondary.json',
    lottieOutputFile: process.env.LOTTIE_OUTPUT_FILE || './output/generated_lottie.was'
  };
}

module.exports = { getRuntimeConfig };
