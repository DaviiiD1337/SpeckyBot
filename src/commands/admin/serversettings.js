module.exports = {
    name: "serversettings",
    description: "You can edit any serversettings!",
    usage: `<feature> <depends from feature>`,
    category: "admin",
    aliases: ["ss","serversetting","servset","serverset","serversets"],
    userPerms: ['MANAGE_MESSAGES']
}

const { MessageEmbed } = require('discord.js');
const { writeFile } = require("fs");
const { join } = require("path");

const dir = join(process.cwd(),'..','db','s_settings.json');

module.exports.run = async (bot, msg) => {
    const { args } = msg;
    const s_settings = require(dir);

    const channelid = msg.mentions.channels.first().id;

    switch(args[0]){
        case "mte":
        case "messagetoembed":
        case "messagetoembedchannel":
        case "msgtoembchannel":
        case "mtechannel":
            if(!msg.mentions.channels.first()){
                msg.channel.send("You have to tag a channel!")
                return;
            }
            switch(args[1]){

                case "add":
                    if(s_settings[msg.guild.id]){
                        if(s_settings[msg.guild.id].mtechannel){
                            if(!s_settings[msg.guild.id].mtechannel.includes(channelid)){
                                s_settings[msg.guild.id] = {
                                    mtechannel: [...s_settings[msg.guild.id].mtechannel,channelid],
                                };
                            }
                        }
                    }else{
                        s_settings[msg.guild.id] = {
                            mtechannel: [channelid],
                        };
                    }
                    writeFile(dir, JSON.stringify(s_settings, null, 4), err => {
                        if(err) throw err;
                        msg.channel.send("Added! :ok_hand:")
                    });
                    break;

                case "remove":
                case "delete":
                    const rest = s_settings[msg.guild.id].mtechannel.filter(function(number) {
                        return number != channelid;
                    });
                    s_settings[msg.guild.id] = {
                        mtechannel: rest,
                    };
                    writeFile(dir, JSON.stringify(s_settings, null, 4), err => {
                        if(err) throw err;
                        msg.channel.send("Removed! :ok_hand:")
                    });
                    break;

                default:
                    msg.channel.send("You have to define an action (add | remove)")
            }
            break
        default:
            const embed = new MessageEmbed()
            .setTitle("Server Settings Help Page!")
            .setDescription(`Here you can set some weird stuff, which you can't do anywhere else!`)
            .addField('\u200b','\u200b')
            .addField(`Message to Embed feature [mte]`,`\`${bot.config.prefix}serversettings mte add/remove #channel\``);
            msg.channel.send(embed);
            break
    }
}
