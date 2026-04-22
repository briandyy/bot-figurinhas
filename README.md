# WhatsApp Sticker Bot (English-Only Edition)

A clean, modular WhatsApp bot for:
- static sticker conversion (`image -> webp`)
- animated sticker conversion (`video -> webp`)
- Lottie `.was` sticker generation from editable templates
- runtime `.env` editing directly from WhatsApp

---

## Features

- Full English codebase and documentation.
- Modular architecture (`config`, `services`, `utils`).
- Runtime environment management:
  - `!env list`
  - `!env get <KEY>`
  - `!env set <KEY> <VALUE>`
- Sticker input support:
  - image
  - video
  - existing sticker (forward/re-send)
- Lottie `.was` generation with selectable animation profile:
  - `main`
  - `secondary`
  - custom JSON relative path

---

## Requirements

- Node.js (see `package.json` engines)
- npm
- ffmpeg binary via `ffmpeg-static` (installed as dependency)

---

## Installation

```bash
npm install
```

---

## Configuration (`.env`)

Use `.env.example` as your base.

```env
PHONE_NUMBER=15551234567
COMMAND_PREFIX=!
BOT_NAME=StickerBot
STICKER_PACKNAME=My Sticker Pack
STICKER_AUTHOR=StickerBot
MAX_VIDEO_SECONDS=8
AUTH_FOLDER=auth_info_baileys
LOTTIE_BASE_FOLDER=./Lottie-Whatsapp/src/exemple
LOTTIE_MAIN_JSON_RELATIVE_PATH=animation/animation.json
LOTTIE_SECONDARY_JSON_RELATIVE_PATH=animation/animation_secondary.json
LOTTIE_OUTPUT_FILE=./output/generated_lottie.was
```

---

## Run

```bash
npm start
```

When connected, send `!help` in WhatsApp.

---

## Commands

- `!help` — list commands
- `!tutorial` — practical quick-start instructions
- `!ping` — health check
- `!sticker` — reply to image/video/sticker
- `!lottie [main|secondary|relative-json-path]` — reply to image
- `!config` — show active runtime config
- `!env list`
- `!env get <KEY>`
- `!env set <KEY> <VALUE>`

---

## Easy workflow for changing Lottie animation (main + secondary)

If the default JSON templates feel confusing, use this workflow:

1. Open your animation in **LottieFiles Editor** (web) or **Adobe After Effects + Bodymovin**.
2. Edit keyframes visually (position, scale, rotation, opacity).
3. Export as Lottie JSON.
4. Replace one of these files in `Lottie-Whatsapp/src/exemple/animation/`:
   - `animation.json` (main profile)
   - `animation_secondary.json` (secondary profile)
5. Run bot and use:
   - `!lottie main`
   - `!lottie secondary`

You can also keep multiple JSON files and call a specific one directly:

```text
!lottie animation/my_custom_profile.json
```

(That path is relative to `LOTTIE_BASE_FOLDER`.)

---

## Troubleshooting

- **"Reply to an image/video/sticker"**: you must reply to a message that contains media.
- **Video rejected**: increase `MAX_VIDEO_SECONDS` with `!env set MAX_VIDEO_SECONDS <N>`.
- **Lottie errors**: verify the JSON file exists under `LOTTIE_BASE_FOLDER` and contains an embedded base64 image asset.

---

## Project structure

- `index.js` — bootstrap
- `src/config/env.js` — read/write `.env`
- `src/config/runtime.js` — runtime config mapping
- `src/services/bot.js` — command router and handlers
- `src/utils/media.js` — media extraction/download/conversion
- `Lottie-Whatsapp/` — `.was` builder utilities and templates
