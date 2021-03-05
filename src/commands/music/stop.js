module.exports = {
    name: "stop",
    description: "Stops the music!",
    category: "music",
    aliases: []
}

module.exports.run = async (bot, msg) => {
    if(!bot.music.isPlaying(msg.guild.id)) throw new Error('Not playing');
    await bot.music.stop(msg.guild.id);
    return bot.cmdSuccess('Playback stopped.');
}
