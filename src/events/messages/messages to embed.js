module.exports = {
    event: "message"
}

const { RichEmbed } = require('discord.js');

module.exports.call = async (bot, msg) => {
    if (msg.author.bot) return;

    await bot.loadSettings();

    const s_settings = bot.settings.server || {};
    const u_settings = bot.settings.user || {};

    let color;

    if(u_settings[msg.author.id] ? u_settings[msg.author.id].embedcolor : false){
        color = `${u_settings[msg.author.id].embedcolor}`;
    }else{
        color = `${(Math.random()*0xFFFFFF<<0).toString(16)}`;
    }

    const perms = msg.guild ? msg.guild.me.permissionsIn(msg.channel).toArray() : [];
    if(perms.includes('MANAGE_MESSAGES') && perms.includes('SEND_MESSAGES') || !msg.guild){
        if(msg.content.includes(':EMB:')){
            await msg.delete().catch(()=>{})
            msg.content = msg.content.replace(/\s?(:EMB:)\s?/g,' ').trim();
            if(msg.content){
                const embed = new RichEmbed()
                .setAuthor(`${msg.author.username}`, `${msg.author.avatarURL}`)
                .setDescription(`${msg.content}`)
                .setColor(`${color}`);
                await msg.channel.send(embed);
            }
            await atts(msg,color)
            return;
        }
    }else{
        return;
    }

    if(!msg.guild) return

    try{
        if(s_settings[msg.guild.id] ?
            (s_settings[msg.guild.id].mtechannel ?
                s_settings[msg.guild.id].mtechannel.includes(msg.channel.id) : false)
            : false){
            try{
                await msg.delete();
                if(msg.content){
                    const embed = new RichEmbed()
                    .setAuthor(`${msg.author.username}`, `${msg.author.avatarURL}`)
                    .setDescription(`${msg.content}`)
                    .setColor(`${color}`);
                    await msg.channel.send(embed);
                }
                await atts(msg,color)
            }catch(e){}
        }
    }catch(err){
        console.error(err)
    }
}

async function atts(msg,color) {
    msg.attachments.forEach(async att  => {
        const emb = new RichEmbed()
        .setAuthor(`${msg.author.username}`, `${msg.author.avatarURL}`)
        .setImage(`${att.proxyURL}`)
        .setColor(color);
        msg.channel.send(emb);
    })
}
