const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

// 👇 Importando a ferramenta do Pedrozz (tem que estar dentro da pasta Lottie-Whatsapp)
const { buildLottieSticker } = require('./Lottie-Whatsapp/src/index.js');

const MEU_NUMERO = 'SEU-NUMERO-AQUI'; // Deixe o seu número aqui

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
    
    const { version } = await fetchLatestBaileysVersion();
    console.log(`\nIniciando com a versão do WA Web: ${version.join('.')}`);

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false
    });

    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            console.log('\n⏳ Solicitando código...');
            try {
                const codigo = await sock.requestPairingCode(MEU_NUMERO);
                console.log(`\n🔥 SEU CÓDIGO É: ${codigo} 🔥`);
            } catch (erro) {
                console.log('\n❌ Erro ao pedir o código.', erro.message);
            }
        }, 3000); 
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) setTimeout(startBot, 2000); 
        } else if (connection === 'open') {
            console.log('\n✅ Bot conectado! Pode mandar o comando !testar no zap.');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;
        const text = m.message.conversation || m.message.extendedTextMessage?.text;

        if (text === '!testar') {
            console.log('\n🚀 Comando recebido! Construindo a figurinha WAS do zero...');
            
            try {
                // 1. Cria a figurinha usando o script do Pedrozz
                await buildLottieSticker({
                    baseFolder: path.resolve(__dirname, "Lottie-Whatsapp", "src", "exemple"),
                    imagePath: path.resolve(__dirname, "minha_foto.jpg"), // Sua foto aqui
                    output: path.resolve(__dirname, "figurinha_perfeita.was")
                });

                console.log('📦 Figurinha gerada e empacotada! Enviando pro WhatsApp...');
                
                // 2. Lê a figurinha recém-criada
                const stickerBuffer = fs.readFileSync('./figurinha_perfeita.was'); 
                
                // 3. Envia com todos os disfarces ligados
                await sock.sendMessage(m.key.remoteJid, {
                    sticker: stickerBuffer,
                    mimetype: 'application/was',
                    isLottie: true,      // Forçando o motor de animação pro celular aceitar
                    isAnimated: true
                });
                console.log('✨ Sucesso absoluto! Olha o celular!');
            } catch (erro) {
                console.log('❌ Deu ruim na hora de construir ou enviar.', erro);
            }
        }
    });
}

startBot();