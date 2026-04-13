const { getSettings, getGroupSettings, updateGroupSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

const formatStylishReply = (message) => {
    return `◈━━━━━━━━━━━━━━━◈\n│❒ ${message}\n◈━━━━━━━━━━━━━━━◈`;
};

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const value = args[0]?.toLowerCase();
        const jid = m.chat;
        
        const settings = await getSettings();
        const prefix = settings.prefix || '.';
        
        let groupSettings = {};
        let isEnabled = false;
        
        if (jid.endsWith('@g.us')) {
            groupSettings = await getGroupSettings(jid);
            isEnabled = groupSettings.gcpresence === true;
        }
        
        if (value === 'on' || value === 'off') {
            const action = value === 'on';
            
            if (isEnabled === action) {
                return await m.reply(formatStylishReply(`Already ${value.toUpperCase()}`));
            }
            
            if (jid.endsWith('@g.us')) {
                await updateGroupSetting(jid, 'gcpresence', action);
                await m.reply(formatStylishReply(`Group: ${value.toUpperCase()}`));
            } else {
                await m.reply(formatStylishReply(`DMs: Always ON`));
            }
            
        } else {
            const status = jid.endsWith('@g.us') ? (isEnabled ? '✅ ON' : '❌ OFF') : '✅ ON (DMs)';
            
            await client.sendMessage(jid, {
                interactiveMessage: {
                    header: formatStylishReply(`GCPresence Settings\n\nStatus: ${status}\n\n• Group: Fake typing/recording\n• DMs: Always enabled`),
                    footer: "ᴀɴᴀᴄᴏɴᴅᴀ-ᴛᴍᴅ",
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🟢 TURN ON",
                                id: `${prefix}gcpresence on`
                            })
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🔴 TURN OFF",
                                id: `${prefix}gcpresence off`
                            })
                        }
                    ]
                }
            }, { quoted: m });
        }
    });
};