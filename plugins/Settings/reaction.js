const { getSettings, updateSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;

    try {
      const settings = await getSettings();
      const prefix = settings.prefix || '.';
      const newEmoji = args[0];
      const currentEmoji = settings.autolikeemoji || 'random';

      if (newEmoji) {
        if (newEmoji === 'random') {
          if (currentEmoji === 'random') {
            await m.reply(`Already using random emojis, you brain-dead fool!`);
            return;
          }
          await updateSetting('autolikeemoji', 'random');
          await m.reply(`Reaction emoji set to random!`);
        } else {
          if (currentEmoji === newEmoji) {
            await m.reply(`Already using ${newEmoji} emoji, moron!`);
            return;
          }
          await updateSetting('autolikeemoji', newEmoji);
          await m.reply(`Reaction emoji set to ${newEmoji}!`);
        }
        return;
      }

      const currentText = currentEmoji === 'random' ? '🎲 Random emojis' : `${currentEmoji} emoji`;

      await client.sendMessage(m.chat, {
        interactiveMessage: {
          header: `Status Reaction Emoji Settings\n\nCurrent: ${currentText}\n\n• Use "${prefix}reaction random" for random emojis\n• Use "${prefix}reaction <emoji>" for specific emoji`,
          footer: "Powered by ᴀɴᴀᴄᴏɴᴅᴀ-ᴛᴍᴅ",
          buttons: [
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "🎲 RANDOM",
                id: `${prefix}reaction random`
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "❤️ LOVE",
                id: `${prefix}reaction ❤️`
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "🔥 FIRE",
                id: `${prefix}reaction 🔥`
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "😂 LAUGH",
                id: `${prefix}reaction 😂`
              })
            }
          ]
        }
      }, { quoted: m });

    } catch (error) {
      console.error('Reaction command error:', error);
      await m.reply(`Failed to update reaction settings. Something's broken.`);
    }
  });
};