module.exports = async (context) => {
const { client, m, text, botname, prefix = '' } = context;

const toFancyFont = (text, isUpperCase = false) => {
const fonts = {
'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
};
return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
.split('')
.map(char => fonts[char] || char)
.join('');
};

if (text) {
return client.sendMessage(m.chat, { text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Yo, ${m.pushName}, what’s with the extra garbage? Just say !repo, you idiot.` }, { quoted: m });
}

try {
const repoUrl = 'https://api.github.com/repos/timnasax2026/Anaconda-Tmd1';
const response = await fetch(repoUrl);
const repoData = await response.json();

if (!response.ok) {  
  throw new Error('Failed to fetch repository data');  
}  

const repoInfo = {  
  stars: repoData.stargazers_count,  
  forks: repoData.forks_count,  
  lastUpdate: repoData.updated_at,  
  owner: repoData.owner.login,  
  createdAt: repoData.created_at,  
  htmlUrl: repoData.html_url  
};  

const createdDate = new Date(repoInfo.createdAt).toLocaleDateString('en-GB');  
const lastUpdateDate = new Date(repoInfo.lastUpdate).toLocaleDateString('en-GB');  

const replyText = `◈━━━━━━━━━━━━━━━━◈\n│❒ *${botname} Repo*\n\n` +  
                 `🌟 *Sƚαɾʂ*: ${repoInfo.stars} (y’all better star)\n` +  
                 `🔗 *Fσɾƙʂ*: ${repoInfo.forks} (do fork)\n` +  
                 `📅 *Cɾҽαƚҽԃ*: ${createdDate} (born to rule)\n` +  
                 `🕒 *Lαʂƚ Uρԃαƚҽԃ*: ${lastUpdateDate} (still fresh)\n` +  
                 `👤 *Oɯɳҽɾ*: ${repoInfo.owner} (that’s me)\n` +  
                 `🔍 *Vιʂιƚ*: ${repoInfo.htmlUrl} (check the repo)\n\n` +  
                 `│❒ Wanna know the genius behind this? Hit the button below!`;  

await client.sendMessage(m.chat, {  
  text: replyText,  
  footer: `Pσɯҽɾҽԃ Ⴆყ ${botname}`,  
  buttons: [  
    { buttonId: `${prefix}dev`, buttonText: { displayText: `👤 ${toFancyFont('DEV')}` }, type: 1 }  
  ],  
  headerType: 1,  
  viewOnce: true,  
  contextInfo: {  
    externalAdReply: {  
      showAdAttribution: false,  
      title: `${botname}`,  
      body: `Yo! Don’t fuck this up.`,  
      sourceUrl: `https://github.com/timnasax2026/Anaconda-Tmd1`,  
      mediaType: 1,  
      renderLargerThumbnail: true  
    }  
  }  
}, { quoted: m });

} catch (error) {
console.error('Error in repo command:', error);
await client.sendMessage(m.chat, { text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Couldn’t grab repo info, something’s fucked up. Check it yourself: https://github.com/timnasax2026/Anaconda-Tmd1` }, { quoted: m });
}
};