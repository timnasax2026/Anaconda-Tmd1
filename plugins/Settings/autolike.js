const { getSettings, updateSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;

    try {
      const settings = await getSettings();
      const prefix = settings.prefix || '.';
      const value = args[0]?.toLowerCase();

      if (value === 'on' || value === 'off') {
        const newValue = value === 'on';

        if (settings.autolike === newValue) {
          await m.reply(`Autolike is already ${value.toUpperCase()}, you brain-dead fool!`);
          return;
        }

        await updateSetting('autolike', newValue);

        await m.reply(`Autolike ${value.toUpperCase()}! ${value === 'on' ? 'Bot will now like statuses!' : 'Bot will ignore statuses like they ignore you.'}`);
        return;
      }

    
      const isAutolikeOn = settings.autolike === true;
      const currentEmoji = settings.autolikeemoji || 'random';
      
      const statusText = isAutolikeOn ? 
                        `✅ ON (${currentEmoji === 'random' ? 'Random emojis' : currentEmoji + ' emoji'})` : 
                        '❌ OFF';

      await client.sendMessage(m.chat, {
        interactiveMessage: {
          header: `🔧 Autolike Settings\n\nCurrent: ${statusText}\n\n• Use "${prefix}autolike on" to turn ON\n• Use "${prefix}autolike off" to turn OFF\n• Use "${prefix}reaction <emoji>" to change emoji`,
          footer: "Powered by ᴀɴᴀᴄᴏɴᴅᴀ-ᴛᴍᴅ",
          buttons: [
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "🟢 TURN ON",
                id: `${prefix}autolike on`
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "🔴 TURN OFF",
                id: `${prefix}autolike off`
              })
            }
          ]
        }
      }, { quoted: m });

    } catch (error) {
      console.error('Autolike command error:', error);
      await m.reply(`Failed to update autolike. Database might be drunk.`);
    }
  });
};