const {
    default: Toxic_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const pino = require('pino');

module.exports = async (context) => {
    const { client, m, text, prefix } = context;

    try {
        if (!text) {
            return await client.sendMessage(m.chat, {
                text: `📱 *Please provide a number to pair!*\n\nExample:\n*${prefix}pair 255655173048*`
            }, { quoted: m });
        }

        const number = text.replace(/[^0-9]/g, '');
        if (number.length < 6 || number.length > 20) {
            return await client.sendMessage(m.chat, {
                text: `❌ *Invalid number!* Please enter a valid WhatsApp number (6–20 digits).`
            }, { quoted: m });
        }

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        const tempPath = path.join(__dirname, 'temps', number);
        if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath, { recursive: true });

        const { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState(tempPath);

        const Anaconda_Tmd_Client = Anaconda_Tech({
            version,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
            },
            printQRInTerminal: false,
            logger: pino({ level: 'silent' }),
            browser: ["Ubuntu", "Chrome", "125"],
            syncFullHistory: false,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: true,
            connectTimeoutMs: 120000,
            keepAliveIntervalMs: 30000,
            defaultQueryTimeoutMs: 60000,
            transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
            retryRequestDelayMs: 10000
        });

        Anaconda_Tmd_Client.ev.on('creds.update', saveCreds);

        await delay(2000);
        const code = await Anaconda_Tmd_Client.requestPairingCode(number);

        if (!code) throw new Error("Failed to generate pairing code.");

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        await client.sendMessage(m.chat, {
            text: `✅ *Pairing code for \( {number}:*\n\n> * \){code}*\n\n` +
                  `Copy the code above and use it in your pairing site/app.\n\n` +
                  `◈━━━━━━━━━━━◈\n` +
                  `SESSION CONNECTED\n\n` +
                  `The code above is your pairing code. Use it to connect your bot!\n\n` +
                  `Need help? Contact:\n` +
                  `> Owner: https://wa.me/255655173048\n` +
                  `> Group: https://chat.whatsapp.com/ENv1ZaXf6gp6AQXtxhhlC7?mode=gi_t\n` +
                  `> https://whatsapp.com/channel/0029Vb6uo9yJ3juwi9GYgS47\n` +
                  `> Instagram: https://www.instagram.com/timnasa2026\n` +
                  `> Repo: https://github.com/timnasax/Anaconda_Tmd\n\n` +
                  `Don't forget to ⭐ the repo!\n` +
                  `◈━━━━━━━━━━━◈`
        }, { quoted: m });

        await Anaconda_Tmd_Client.ws.close();

        setTimeout(() => {
            if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { recursive: true, force: true });
        }, 5000);

    } catch (error) {
        console.error("Error in pair command:", error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await client.sendMessage(m.chat, {
            text: `⚠️ *Failed to generate pairing code.*\n\n> ${error.message || "Unknown error"}\n\n` +
                  `Try again later or check your number.\n` +
                  `Repo: https://github.com/timnasax/Anaconda_Tmd`
        }, { quoted: m });
    }
};