# 🧩 Lottie Sticker Builder (`.was`) — Beta

Convert an image (**buffer** or **file path**) into a WhatsApp-ready animated `.was` sticker.

---

## Installation

### 1) Clone or copy this folder

```bash
git clone https://github.com/Pedrozz13755/Lottie-Whatsapp.git
cd Lottie-Whatsapp
```

Or copy this folder into your existing project.

### 2) Install system requirement

This module uses Node.js built-ins plus `adm-zip`, and needs a working environment that can write temporary files.

---

## Expected template structure

You need a base folder that contains a Lottie JSON file with an embedded base64 image asset.

Example:

```text
src/
 └── exemple/
      └── animation/
           └── animation_secondary.json
```

The builder replaces that embedded base64 image with your input image.

---

## Usage

### Import

```js
const { buildLottieSticker } = require('./src/index');
```

### Minimal example

```js
const path = require('path');
const { buildLottieSticker } = require('./src/index');

const output = await buildLottieSticker({
  baseFolder: path.resolve(__dirname, 'src', 'exemple'),
  buffer: imageBuffer,
  mime: 'image/jpeg',
  output: path.resolve(__dirname, 'sticker.was')
});
```

### Send with Baileys

```js
const fs = require('fs');

await client.sendMessage(chatId, {
  sticker: fs.readFileSync('./sticker.was'),
  mimetype: 'application/was'
});
```

---

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `baseFolder` | string | ✅ | Base Lottie template folder |
| `buffer` | Buffer | ❌ | Input image buffer |
| `imagePath` | string | ❌ | Input image file path |
| `mime` | string | ❌ | Image MIME (auto-detected when using `imagePath`) |
| `output` | string | ❌ | Output `.was` path |
| `jsonRelativePath` | string | ❌ | JSON path inside base folder |

---

## Important rules

- Provide either `buffer` or `imagePath`.
- Supported formats:
  - PNG
  - JPG / JPEG
  - WEBP
- JSON must already contain an embedded base64 image asset.
- The builder replaces an existing image asset; it does not create a full animation from scratch.

---

## Common errors

- `Mime type not detected. Provide imagePath or mime.`
- `JSON without assets.`
- `No base64 image found in the Lottie asset list.`
- `Unsupported format. Use PNG, JPG, JPEG, or WEBP.`

---

## Project status

> Beta quality.
>
> Depending on template complexity, some animations may not render exactly as expected on every WhatsApp client.

---

## Credits

Created by **Pedrozz Mods**.

If you fork or redistribute, keep original credit lines.
