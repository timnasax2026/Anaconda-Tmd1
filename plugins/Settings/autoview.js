const { getSettings, updateSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;

    const formatStylishReply = (message) => {
      return `◈━━━━━━━━━━━━━━━━◈\n│❒ ${message}\n┗━━━━━━━━━━━━━━━┛`;
    };

    try {
      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply('Database is down, no settings found. Fix it, loser. 😴') },
          { quoted: m, ad: true }
        );
      }

      const value = args[0]?.toLowerCase();
      const validOptions = ['on', 'off'];

      if (validOptions.includes(value)) {
        const newState = value === 'on';
        if (settings.autoview === newState) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply(`Autoview Status is already ${value.toUpperCase()}, you brainless fool! 😈 Stop wasting my time! 🖕`) },
            { quoted: m, ad: true }
          );
        }

        await updateSetting('autoview', newState);
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply(`Autoview Status ${value.toUpperCase()}! 🔥 ${newState ? 'I’ll view every status like a king! 😈' : 'I’m done with your boring statuses. 😴'}`) },
          { quoted: m, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}autoview on`, buttonText: { displayText: 'ON ✅' }, type: 1 },
        { buttonId: `${prefix}autoview off`, buttonText: { displayText: 'OFF ❌' }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply(`Autoview Status: ${settings.autoview ? 'ON ✅ (Watching all statuses)' : 'OFF ❌ (Ignoring statuses)'}\n\nPick an option, noob! 😈`),
          footer: '> Pσɯҽɾԃ Ⴆყ ᴀɴᴀᴄᴏɴᴅᴀ-ᴛᴍᴅ',
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: m, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply('Something broke, couldn’t update Autoview. Database is probably drunk. Try later. 😴') },
        { quoted: m, ad: true }
      );
    }
  });
};