const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

const ENV_PATH = path.resolve(process.cwd(), '.env');

function ensureEnvFile() {
  if (!fs.existsSync(ENV_PATH)) {
    fs.writeFileSync(ENV_PATH, '', 'utf8');
  }
}

function loadEnv() {
  ensureEnvFile();
  const parsed = dotenv.parse(fs.readFileSync(ENV_PATH, 'utf8'));

  for (const [key, value] of Object.entries(parsed)) {
    process.env[key] = value;
  }

  return parsed;
}

function readEnvEntries() {
  ensureEnvFile();
  return dotenv.parse(fs.readFileSync(ENV_PATH, 'utf8'));
}

function setEnvValue(key, value) {
  if (!key || !/^[A-Z0-9_]+$/.test(key)) {
    throw new Error('Invalid env key format. Use uppercase letters, numbers, and underscores only.');
  }

  ensureEnvFile();
  const envMap = readEnvEntries();
  envMap[key] = String(value);

  const content = Object.entries(envMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';

  fs.writeFileSync(ENV_PATH, content, 'utf8');
  process.env[key] = String(value);
}

module.exports = {
  ENV_PATH,
  loadEnv,
  readEnvEntries,
  setEnvValue
};
