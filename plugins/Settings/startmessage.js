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
          { text: formatStylishReply("Database is fucked, no settings found. Fix it, loser.") },
          { quoted: m, ad: true }
        );
      }

      const value = args.join(" ").toLowerCase();

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (settings.startmessage === action) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply(`Start message is already ${value.toUpperCase()}, you brain-dead fool! Stop wasting my time. 😈`) },
            { quoted: m, ad: true }
          );
        }

        await updateSetting('startmessage', action);
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply(`Start message ${value.toUpperCase()} activated! 🔥 ${action ? 'Welcome messages will be sent on connection! 🎉' : 'No more annoying welcome messages, you antisocial prick! 🚫'}`) },
          { quoted: m, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}startmessage on`, buttonText: { displayText: "ON 🎉" }, type: 1 },
        { buttonId: `${prefix}startmessage off`, buttonText: { displayText: "OFF 🚫" }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply(`Start message is ${settings.startmessage ? 'ON 🎉' : 'OFF 🚫'}, dumbass. Pick a vibe, noob! 😈`),
          footer: "> Pσɯҽɾԃ Ⴆყ 𝚊𝚗𝚊𝚌𝚘𝚗𝚍𝚊 𝚝𝚖𝚍",
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: m, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("Shit broke, couldn't mess with start message. Database or something's fucked. Try later.") },
        { quoted: m, ad: true }
      );
    }
  });
};