module.exports = {
    event: "filteredMessage"
}

const { evaluate } = require('mathjs');

module.exports.call = (bot, msg) => {
    const set = bot.settings.user;
    if(!msg.content) return;
    const scope = bot.cache.math[msg.author.id] || {}
    if((set||{})[msg.author.id] ? set[msg.author.id].math : false){
        try{
            const res = String(evaluate(msg.content, scope));
            if(Object.keys(scope).length > 0){
                bot.cache.math[msg.author.id] = scope
            }
            if(res.length < 50 && res != msg.content && res !== "undefined"){
                msg.channel.send(String(res).code('js'));
            }
        }catch(err){}
    }
}
