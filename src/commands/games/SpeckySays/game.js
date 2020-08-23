const randomStart = require('.\\randomStart.js')
const discord = require('discord.js')
const fs = require('fs')

module.exports.runGame = async (channel, players_, bot) => {

    bot.minigames = []
    const gameFiles = fs.readdirSync('.\\commands\\games\\SpeckySays\\minigames').filter(file => file.match(bot.supportedFiles))

    for (const file of gameFiles) {
        const game = require(`.\\minigames\\${file}`)
        bot.minigames.push(game)
    }

    let players = players_, time = 1, winners, gameOn, prematurelyEnd;
    if(players_.length < 1){
        prematurelyEnd = true
        gameOn = false
    }else{
        prematurelyEnd = false
        gameOn = true
    }
    let rounds = 1
    let lastGame = null
    // example of how to start a game
    let settings = require('.\\settings');

    while (gameOn) {

        // chooses a random minigame

        const enabledGames = []
        for(const game of bot.minigames){
            if(settings.minigames[game.name]){
                if(game.name == 'oppositeDay' && rounds < 5) continue
                enabledGames.push(game)
            }
        }

        if(enabledGames.length == 0){
            channel.send('You need to have at least one game enabled to play. Enable/disable with the config command.')
            return
        }
        let currentGame  = enabledGames.pick();

        while(currentGame == lastGame){
            currentGame = enabledGames.pick();
        }

        // picks a random start of startmessage (67% chance of getting "Simon says")
        let start
        if (currentGame.name == 'oppositeDay') {
            start = {
                string: settings.opposite_day ? 'Good morning,' : 'Simon says',
                real: true
            }
        } else if(rounds < 3){
            start = {
                string: 'Simon says',
                real: true
            }
        } else {
            start = randomStart(channel.guild.id, settings)
        }

        const actualTime = (time * currentGame.defTime).clamp(5000, 15000)
        // sends startmessage
        const startMessage = await channel.send(`**${start.string} ${currentGame.startMessage.toLowerCase()}** *(You have ${Math.floor(actualTime / 1000)} seconds)*`)
        // runs the game

        const res = await currentGame.run(channel, players, actualTime, bot, {
            simonSaid: start.real,
            startMessage: startMessage,
            settings: settings
        })

        let { playersOut } = res;
        const { playersLeft, settingsOut } = res;

        settings = settingsOut

        await sleep(1000)
        playersOut = [...new Set(playersOut)]
        // say whos out
        const embed = new discord.RichEmbed()
        if (playersOut.length > 0) {
            embed.setDescription(`${playersOut.join(', ')} ${playersOut.length > 1 ? "are" : "is"} out!`)
            .setColor(`#FF230F`)
        } else {
            embed.setTitle('Good job! Nobody fell out!')
            .setColor(`#33CC14`)
        }

        channel.send(embed)
        await sleep(1000)


        if (playersLeft.length < 1) {
            winners = playersOut
            gameOn = false
            break
        }
        time *= 0.93
        players = playersLeft
        rounds++
        lastGame = currentGame
    }

    if(!prematurelyEnd){
        const embed = new discord.RichEmbed()
        .setTitle('The game has ended!')
        .setDescription(`${winners.join(', ')} won with ${rounds} point${rounds !== 1 ? 's' : ''}! GG!`)
        .setColor('#FFBE11')
        channel.send(embed)
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
