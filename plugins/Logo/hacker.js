const axios = require('axios');

module.exports = {
  name: 'hacker',
  aliases: ['hacklogo', 'neonhacker'],
  description: 'Generate a neon hacker-style anonymous logo with your text',
  run: async (context) => {
    const { client, m, text } = context;

    if (!text) {
      return client.sendMessage(m.chat, {
        text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Yo, @${m.sender.split('@')[0]}! 😤 You forgot the text!\n│❒ Example: ${prefix}hacker Toxic-MD\n┗━━━━━━━━━━━━━━━┛`,
        mentions: [m.sender]
      }, { quoted: m });
    }

    try {
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

      const apiUrl = `https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html`;
      const response = await axios.post(
        'https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html',
        new URLSearchParams({
          text: text,
          submit: 'Create'
        }),
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 30000,
        }
      );

     
      const html = response.data;
      const imageMatch = html.match(/<img[^>]+src=["'](.*?)["']/i);
      if (!imageMatch || !imageMatch[1]) {
        throw new Error('Failed to extract logo image');
      }

      const logoUrl = imageMatch[1].startsWith('http') ? imageMatch[1] : `https:${imageMatch[1]}`;

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

      await client.sendMessage(m.chat, {
        image: { url: logoUrl },
        caption: `◈━━━━━━━━━━━━━━━━◈\n│❒ *Hacker Neon Logo Generated*\n│❒ Text: ${text}\n┗━━━━━━━━━━━━━━━┛\n> Pσɯҽɾԃ Ⴆყ ᴀɴᴀᴄᴏɴᴅᴀ-ᴛᴍᴅ`
      }, { quoted: m });

    } catch (error) {
      console.error('Hacker logo error:', error);

      await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

      let errorMsg = 'Failed to generate hacker logo.';
      if (error.message.includes('timeout')) errorMsg += ' Request timed out.';
      if (error.response?.status === 429) errorMsg += ' Rate limit hit. Try again later.';
      if (error.message.includes('extract')) errorMsg += ' Couldn’t find the image. API might be down.';

      await client.sendMessage(m.chat, {
        text: `◈━━━━━━━━━━━━━━━━◈\n│❒ ${errorMsg}\n│❒ Try again or use a shorter text.\n┗━━━━━━━━━━━━━━━┛`
      }, { quoted: m });
    }
  }
};