const fs = require('node:fs');
const path = require('node:path');
const qrcode = require('qrcode-terminal');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const { buildLottieSticker } = require('../../Lottie-Whatsapp/src/index.js');
const { getRuntimeConfig } = require('../config/runtime');
const { loadEnv, readEnvEntries, setEnvValue } = require('../config/env');
const { extractMessageContent, downloadMessageMedia, prepareStickerBuffer } = require('../utils/media');

function getText(message) {
  return (
    message.message?.conversation ||
    message.message?.extendedTextMessage?.text ||
    message.message?.imageMessage?.caption ||
    message.message?.videoMessage?.caption ||
    ''
  );
}

function parseCommand(text, prefix) {
  if (!text.startsWith(prefix)) return null;

  const normalized = text.slice(prefix.length).trim();
  const [command, ...args] = normalized.split(/\s+/g);

  return {
    command: (command || '').toLowerCase(),
    args
  };
}

async function sendHelp(sock, jid, m, prefix) {
  const body = [
    '*Sticker Bot Commands*',
    `${prefix}help - Show this help menu`,
    `${prefix}ping - Health check`,
    `${prefix}sticker - Reply to an image/video/sticker to convert/send as sticker`,
    `${prefix}lottie - Reply to an image and generate a .was Lottie sticker`,
    `${prefix}env get <KEY> - Read key from .env`,
    `${prefix}env set <KEY> <VALUE> - Update .env while bot is running`,
    `${prefix}env list - List available .env keys`
  ].join('\n');

  await sock.sendMessage(jid, { text: body }, { quoted: m });
}

async function handleEnvCommand(sock, jid, m, args) {
  const [action, key, ...valueParts] = args;

  if (!action) {
    await sock.sendMessage(jid, { text: 'Usage: !env get <KEY> | !env set <KEY> <VALUE> | !env list' }, { quoted: m });
    return;
  }

  if (action === 'list') {
    const entries = readEnvEntries();
    const payload = Object.keys(entries).sort().join('\n') || '(empty .env)';
    await sock.sendMessage(jid, { text: `Current .env keys:\n${payload}` }, { quoted: m });
    return;
  }

  if (action === 'get') {
    if (!key) {
      await sock.sendMessage(jid, { text: 'Usage: !env get <KEY>' }, { quoted: m });
      return;
    }

    const value = readEnvEntries()[key];
    if (typeof value === 'undefined') {
      await sock.sendMessage(jid, { text: `Key ${key} was not found in .env.` }, { quoted: m });
      return;
    }

    await sock.sendMessage(jid, { text: `${key}=${value}` }, { quoted: m });
    return;
  }

  if (action === 'set') {
    if (!key || valueParts.length === 0) {
      await sock.sendMessage(jid, { text: 'Usage: !env set <KEY> <VALUE>' }, { quoted: m });
      return;
    }

    const value = valueParts.join(' ');
    setEnvValue(key, value);
    await sock.sendMessage(jid, { text: `Updated ${key} in .env and memory.` }, { quoted: m });
    return;
  }

  await sock.sendMessage(jid, { text: 'Unknown env action. Use get, set, or list.' }, { quoted: m });
}

async function handleStickerCommand(sock, jid, m, config) {
  const payload = extractMessageContent(m);
  if (!payload) {
    await sock.sendMessage(jid, { text: 'Reply to an image, video, or sticker and use !sticker.' }, { quoted: m });
    return;
  }

  const media = await downloadMessageMedia(payload);

  if (media.kind === 'video' && media.seconds > config.maxVideoSeconds) {
    await sock.sendMessage(
      jid,
      { text: `Video is too long (${media.seconds}s). Max allowed: ${config.maxVideoSeconds}s.` },
      { quoted: m }
    );
    return;
  }

  const stickerBuffer = await prepareStickerBuffer(media, config.maxVideoSeconds);

  await sock.sendMessage(
    jid,
    {
      sticker: stickerBuffer,
      mimetype: 'image/webp'
    },
    { quoted: m }
  );
}

async function handleLottieCommand(sock, jid, m, config) {
  const payload = extractMessageContent(m);
  if (!payload || payload.kind === 'video') {
    await sock.sendMessage(jid, { text: 'Reply to an image to build a Lottie .was sticker.' }, { quoted: m });
    return;
  }

  const media = await downloadMessageMedia(payload);

  const outputPath = path.resolve(process.cwd(), config.lottieOutputFile);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await buildLottieSticker({
    baseFolder: path.resolve(process.cwd(), config.lottieBaseFolder),
    output: outputPath,
    buffer: media.buffer,
    mime: media.mimeType,
    jsonRelativePath: config.lottieJsonRelativePath
  });

  const wasBuffer = fs.readFileSync(outputPath);

  await sock.sendMessage(
    jid,
    {
      sticker: wasBuffer,
      mimetype: 'application/was',
      isLottie: true,
      isAnimated: true
    },
    { quoted: m }
  );
}

async function startBot() {
  loadEnv();
  const config = getRuntimeConfig();

  if (!config.phoneNumber) {
    throw new Error('PHONE_NUMBER is missing in .env');
  }

  const { state, saveCreds } = await useMultiFileAuthState(path.resolve(process.cwd(), config.authFolder));
  const { version } = await fetchLatestBaileysVersion();

  console.log(`[BOOT] Using WA Web version ${version.join('.')}`);

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log('[AUTH] Scan the QR code above with WhatsApp.');
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(`[CONN] Closed. Reconnect=${shouldReconnect}`);
      if (shouldReconnect) {
        setTimeout(startBot, 2000);
      }
      return;
    }

    if (connection === 'open') {
      console.log('[CONN] Bot connected. Send !help to see commands.');

      if (!sock.authState.creds.registered) {
        const code = await sock.requestPairingCode(config.phoneNumber);
        console.log(`[AUTH] Pairing code: ${code}`);
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m?.message || m.key.fromMe) return;

    const latestConfig = getRuntimeConfig();
    const text = getText(m).trim();
    const parsed = parseCommand(text, latestConfig.commandPrefix);

    if (!parsed) return;

    const jid = m.key.remoteJid;

    try {
      switch (parsed.command) {
        case 'help':
          await sendHelp(sock, jid, m, latestConfig.commandPrefix);
          break;
        case 'ping':
          await sock.sendMessage(jid, { text: 'pong' }, { quoted: m });
          break;
        case 'sticker':
          await handleStickerCommand(sock, jid, m, latestConfig);
          break;
        case 'lottie':
          await handleLottieCommand(sock, jid, m, latestConfig);
          break;
        case 'env':
          await handleEnvCommand(sock, jid, m, parsed.args);
          break;
        default:
          await sock.sendMessage(
            jid,
            { text: `Unknown command: ${parsed.command}. Use ${latestConfig.commandPrefix}help.` },
            { quoted: m }
          );
      }
    } catch (error) {
      await sock.sendMessage(jid, { text: `Error: ${error.message}` }, { quoted: m });
      console.error('[ERROR]', error);
    }
  });
}

module.exports = { startBot };
