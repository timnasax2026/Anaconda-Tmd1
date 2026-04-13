const { getSettings } = require('../../Database/config');

module.exports = {
  name: 'listonline',
  aliases: ['online', 'active', 'onlineusers'],
  description: 'List currently online group members',
  run: async (context) => {
    const { client, m } = context;

    if (!m.isGroup) {
      return client.sendMessage(m.chat, {
        text: `◈━━━━━━━━━━━━━━━━◈\n│❒ This command is for groups only, idiot.\n│❒ Use it in a WhatsApp group.\n┗━━━━━━━━━━━━━━━┛`
      }, { quoted: m });
    }

    try {
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

    
      const groupMetadata = await client.groupMetadata(m.chat);
      const participants = groupMetadata.participants || [];

     
      const onlineUsers = participants
        .filter(p => p.presence && (p.presence === 'available' || p.presence === 'composing'))
        .map(p => p.id);

      if (onlineUsers.length === 0) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return client.sendMessage(m.chat, {
          text: `◈━━━━━━━━━━━━━━━━◈\n│❒ No one is online right now... or they all have privacy on like cowards.\n│❒ Try again later, loser.\n┗━━━━━━━━━━━━━━━┛`
        }, { quoted: m });
      }

  
      const onlineList = onlineUsers
        .map((jid, index) => `\( {index + 1}. 🟢 @ \){jid.split('@')[0]}`)
        .join('\n');

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

      await client.sendMessage(m.chat, {
        text: `◈━━━━━━━━━━━━━━━━◈\n` +
              `│❒ *Online Members (${onlineUsers.length})*\n` +
              `│\n` +
              `${onlineList}\n` +
              `┗━━━━━━━━━━━━━━━┛\n` +
              `> Pσɯҽɾԃ Ⴆყ ᴀɴᴀᴄᴏɴᴅᴀ-ᴛᴍᴅ`,
        mentions: onlineUsers
      }, { quoted: m });

    } catch (error) {
      console.error('ListOnline error:', error);

      await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

      await client.sendMessage(m.chat, {
        text: `◈━━━━━━━━━━━━━━━━◈\n` +
              `│❒ Failed to fetch online users.\n` +
              `│❒ Error: ${error.message || 'Unknown'}\n` +
              `┗━━━━━━━━━━━━━━━┛`
      }, { quoted: m });
    }
  }
};