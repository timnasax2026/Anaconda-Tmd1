module.exports = async (context) => {
  const { client, m } = context;

  const message = `
╭━━〔 *ᴀɴᴀᴄᴏɴᴅᴀ-ᴛᴍᴅ Support Links* 〕━━━━╮

> 👑 *Owner*  
https://wa.me/255655173048

> 📢 *Channel Link*  
https://whatsapp.com/channel/0029Vb6uo9yJ3juwi9GYgS47

> 👥 *Group*  
https://chat.whatsapp.com/ENv1ZaXf6gp6AQXtxhhlC7?mode=gi_t

╰━━━━━━━━━━━━━━━━━━━━━━━╯
> Pσɯҽɾԃ Ⴆყ ᴀɴᴀᴄᴏɴᴅᴀ-ᴛᴍᴅ
`;

  try {
    await client.sendMessage(
      m.chat,
      { text: message },
      { quoted: m }
    );
  } catch (error) {
    console.error("Support command error:", error);
    await m.reply("⚠️ Failed to send support links. Please try again.");
  }
};