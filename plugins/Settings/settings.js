const { getSettings, getSudoUsers, getBannedUsers } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, prefix } = context;

    const settings = await getSettings();
    const botName = process.env.BOTNAME || settings.botname || 'Toxic-MD';
    const sudoUsers = await getSudoUsers();
    const bannedUsers = await getBannedUsers();
    const groupCount = Object.keys(await client.groupFetchAllParticipating()).length;

    const formatSetting = (title, value, command, example) => {
      return `╭─ *${title}* \n│\n│❒ Status: ${value}\n│❒ Change: \`${command}\`\n│❒ Example: \`${example}\`\n╰─\n`;
    };

    const message = 
      `╭─ *ANACONDA SETTINGS* ─╮\n` +
      `│\n` +
      `│❒ Bot Name: ${botName}\n` +
      `│❒ Sudo Users: ${sudoUsers.length || 0}\n` +
      `│❒ Banned Users: ${bannedUsers.length || 0}\n` +
      `│❒ Total Groups: ${groupCount || 0}\n` +
      `│\n` +
      `╰───────────────────────╯\n\n` +
      
      formatSetting(
        'AUTOLIKE SETTING',
        settings.autolike ? '✅ ON' : '❌ OFF',
        `${prefix}autolike on/off`,
        `${prefix}autolike on`
      ) +
      
      formatSetting(
        'AUTOVIEWSTATUS SETTING',
        settings.autoview ? '✅ ON' : '❌ OFF',
        `${prefix}autoview on/off`,
        `${prefix}autoview off`
      ) +
      
      formatSetting(
        'AUTOREAD SETTING',
        settings.autoread ? '✅ ON' : '❌ OFF',
        `${prefix}autoread on/off`,
        `${prefix}autoread on`
      ) +
      
      formatSetting(
        'REACTION EMOJI',
        settings.autolikeemoji || 'random ❤️',
        `${prefix}reaction <emoji>`,
        `${prefix}reaction 🔥`
      ) +
      
      formatSetting(
        'BOT PREFIX',
        settings.prefix || '.',
        `${prefix}prefix <symbol>`,
        `${prefix}prefix !`
      ) +
      
      formatSetting(
        'AUTOBIO SETTING',
        settings.autobio ? '✅ ON' : '❌ OFF',
        `${prefix}autobio on/off`,
        `${prefix}autobio on`
      ) +
      
      formatSetting(
        'ANTICALL SETTING',
        settings.anticall ? '✅ ON' : '❌ OFF',
        `${prefix}anticall on/off`,
        `${prefix}anticall on`
      ) +
      
      formatSetting(
        'CHATBOT PM',
        settings.chatbotpm ? '✅ ON' : '❌ OFF',
        `${prefix}chatbotpm on/off`,
        `${prefix}chatbotpm on`
      ) +
      
      formatSetting(
        'BOT MODE',
        settings.mode || 'public',
        `${prefix}mode <public/private>`,
        `${prefix}mode private`
      ) +
      
      formatSetting(
        'PRESENCE',
        settings.presence || 'online',
        `${prefix}presence <online/typing/recording>`,
        `${prefix}presence typing`
      ) +
      
      formatSetting(
        'ANTIDELETE',
        settings.antidelete ? '✅ ON' : '❌ OFF',
        `${prefix}antidelete on/off`,
        `${prefix}antidelete on`
      ) +
      
      formatSetting(
        'STICKER PACKNAME',
        settings.packname || 'Toxic-MD',
        `${prefix}setpackname <text>`,
        `${prefix}setpackname YourName`
      ) +
      
      `╭─ *QUICK TIPS* ─╮\n` +
      `│❒ Use exact commands as shown\n` +
      `│❒ No spaces in emojis: ${prefix}reaction🔥\n` +
      `│❒ Only owner can change settings\n` +
      `│❒ Settings save instantly\n` +
      `╰─ *𝚊𝚗𝚊𝚌𝚘𝚗𝚍𝚊 𝚝𝚖𝚍* ─╯`;

    await client.sendMessage(
      m.chat,
      {
        text: message
      },
      { quoted: m }
    );
  });
};