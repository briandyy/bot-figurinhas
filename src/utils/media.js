const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
const ffmpegPath = require('ffmpeg-static');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function extractMessageContent(message) {
  const direct = message.message || {};
  const quoted = direct.extendedTextMessage?.contextInfo?.quotedMessage || {};

  if (direct.imageMessage) return { kind: 'image', content: direct.imageMessage };
  if (direct.videoMessage) return { kind: 'video', content: direct.videoMessage };
  if (direct.stickerMessage) return { kind: 'sticker', content: direct.stickerMessage };

  if (quoted.imageMessage) return { kind: 'image', content: quoted.imageMessage };
  if (quoted.videoMessage) return { kind: 'video', content: quoted.videoMessage };
  if (quoted.stickerMessage) return { kind: 'sticker', content: quoted.stickerMessage };

  return null;
}

async function downloadMessageMedia(payload) {
  const contentType = payload.kind === 'sticker' ? 'sticker' : payload.kind;
  const stream = await downloadContentFromMessage(payload.content, contentType);
  const buffer = await streamToBuffer(stream);

  const mimeType = payload.content.mimetype || '';
  const extension = mimeType.split('/')[1]?.split(';')[0] || (payload.kind === 'video' ? 'mp4' : 'jpg');

  return {
    buffer,
    mimeType,
    extension,
    kind: payload.kind,
    seconds: payload.content.seconds || 0
  };
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) return reject(new Error('ffmpeg-static binary was not found.'));

    const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) return resolve();
      reject(new Error(`ffmpeg failed with code ${code}: ${stderr}`));
    });
  });
}

async function convertToWebp({ inputPath, outputPath, isVideo, maxVideoSeconds }) {
  const scalePad = 'scale=min(512,iw):min(512,ih):force_original_aspect_ratio=decrease,pad=512:512:-1:-1:color=white@0.0';

  if (isVideo) {
    await runFfmpeg([
      '-y', '-i', inputPath,
      '-an', '-t', String(maxVideoSeconds), '-loop', '0',
      '-vf', `${scalePad},fps=15`,
      '-preset', 'default', '-vsync', '0',
      outputPath
    ]);
    return;
  }

  await runFfmpeg([
    '-y', '-i', inputPath,
    '-vf', scalePad,
    '-loop', '0',
    outputPath
  ]);
}

async function prepareStickerBuffer(media, maxVideoSeconds) {
  if (media.kind === 'sticker') return media.buffer;

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sticker-bot-'));
  const inputPath = path.join(tempDir, `input.${media.extension}`);
  const outputPath = path.join(tempDir, 'output.webp');

  try {
    fs.writeFileSync(inputPath, media.buffer);
    await convertToWebp({
      inputPath,
      outputPath,
      isVideo: media.kind === 'video',
      maxVideoSeconds
    });
    return fs.readFileSync(outputPath);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

module.exports = { extractMessageContent, downloadMessageMedia, prepareStickerBuffer };
