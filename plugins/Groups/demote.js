const middleware = require('../../utility/botUtil/middleware');
const { getSettings } = require('../../Database/config');

module.exports = {
  name: 'demote',
  aliases: ['unadmin', 'removeadmin'],
  description: 'Demotes a user from admin in a group',
  run: async (context) => {
    await middleware(context, async () => {
      const { client, m, botname, prefix } = context;

      if (!m.isGroup) {
        return m.reply(`◈━━━━━━━━━━━━━━━◈\n│❒ this ain't a group! use in group only\n◈━━━━━━━━━━━━━━━◈`);
      }

      let groupMetadata;
      try {
        groupMetadata = await client.groupMetadata(m.chat);
      } catch (e) {
        return m.reply(`◈━━━━━━━━━━━━━━━◈\n│❒ can't get group data\n│❒ error: ${e.message}\n◈━━━━━━━━━━━━━━━◈`);
      }

      const members = groupMetadata.participants;
      const admins = members.filter(p => p.admin != null).map(p => p.id);
      const botId = client.user.id;

      if (!admins.includes(botId)) {
        return m.reply(`◈━━━━━━━━━━━━━━━◈\n│❒ i'm not admin! make me admin first\n◈━━━━━━━━━━━━━━━◈`);
      }

      if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
        return m.reply(`◈━━━━━━━━━━━━━━━◈\n│❒ mention or quote a user to demote\n│❒ example: ${prefix}demote @user\n◈━━━━━━━━━━━━━━━◈`);
      }

      const user = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
      if (!user) {
        return m.reply(`◈━━━━━━━━━━━━━━━◈\n│❒ invalid user specified\n◈━━━━━━━━━━━━━━━◈`);
      }

      const userNumber = user.split('@')[0];

      const settings = await getSettings();
      const ownerNumber = settings.owner || '254735342808@s.whatsapp.net';
      if (user === ownerNumber) {
        return m.reply(`◈━━━━━━━━━━━━━━━◈\n│❒ can't demote the owner\n◈━━━━━━━━━━━━━━━◈`);
      }

      if (!admins.includes(user)) {
        return m.reply(`◈━━━━━━━━━━━━━━━◈\n│❒ @${userNumber} is not admin\n◈━━━━━━━━━━━━━━━◈`, {
          mentions: [user]
        });
      }

      try {
        await client.groupParticipantsUpdate(m.chat, [user], 'demote');
        await m.reply(`◈━━━━━━━━━━━━━━━◈\n│❒ @${userNumber} demoted ✅\n│❒ ᴀɴᴀᴄᴏɴᴅᴀ-ᴛᴍᴅ\n◈━━━━━━━━━━━━━━━◈`, {
          mentions: [user]
        });
      } catch (error) {
        await m.reply(`◈━━━━━━━━━━━━━━━◈\n│❒ failed to demote\n│❒ error: ${error.message}\n◈━━━━━━━━━━━━━━━◈`);
      }
    });
  },
};