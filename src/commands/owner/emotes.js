module.exports = {
    name: "allemotes",
    description: "Sends all emotes which the bot can access to.",
    category: "owner",
    aliases: ["allemojis"]
}

module.exports.run = async (bot, msg) => {
    let arr = [];
    bot.emojis.cache.forEach(emoji => {
        arr.push(emoji);
        if(arr.join('').length > 1950){
            msg.channel.send(arr.join(''));
            arr = [];
        }
    })
    if(arr.length){
        return msg.channel.send(arr.join(''));
    }
}
