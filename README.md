# WhatsApp Sticker Bot (Clean Rebuild)

A cleaner, modular rewrite of the original project.

## What is new

- Full repository structure rebuilt with modular services and utilities.
- `.env`-first configuration with runtime editing from WhatsApp commands.
- Sticker conversion now supports:
  - images
  - videos (auto-converted to animated WebP sticker)
  - existing stickers (re-send flow)
- Lottie `.was` generation command kept and integrated.
- All user-facing text translated to English.

## Requirements

- **Node.js 26+** (configured in `package.json` engines).
- npm.

## Installation

```bash
npm install
```

## Configuration

Edit `.env`:

```env
PHONE_NUMBER=15551234567
COMMAND_PREFIX=!
BOT_LANGUAGE=en
BOT_NAME=StickerBot
STICKER_PACKNAME=My Sticker Pack
STICKER_AUTHOR=StickerBot
MAX_VIDEO_SECONDS=8
AUTH_FOLDER=auth_info_baileys
LOTTIE_BASE_FOLDER=./Lottie-Whatsapp/src/exemple
LOTTIE_JSON_RELATIVE_PATH=animation/animation_secondary.json
LOTTIE_OUTPUT_FILE=./output/generated_lottie.was
```

### Runtime `.env` updates (while bot is running)

Use these WhatsApp commands:

- `!env list`
- `!env get <KEY>`
- `!env set <KEY> <VALUE>`

Every `!env set` command updates both:
1. `.env` file on disk.
2. `process.env` in memory.

## Run

```bash
npm start
```

## Commands

- `!help`
- `!ping`
- `!sticker` (reply to image/video/sticker)
- `!lottie` (reply to image)
- `!env list`
- `!env get <KEY>`
- `!env set <KEY> <VALUE>`

## Notes

- Video stickers are capped by `MAX_VIDEO_SECONDS`.
- Converted stickers are built as WebP.
- Lottie `.was` generation uses the local `Lottie-Whatsapp` builder.
