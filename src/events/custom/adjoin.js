module.exports = {
    event: "guildMemberAdd"
}

// server limiter
const limited = ["265505748413448193"]

module.exports.call = async (bot, member) => {
    // server limiter
    if(!limited.includes(member.guild.id)) return;

    const memberRole = '265519525041143809'
    const adInStatusRole = '638091940545560639'

    setTimeout(() => {
        if(!member.roles) return;
        try{
            if(member.roles.includes(adInStatusRole)){
                try{
                    member.removeRole(memberRole)
                }catch{}
            }
        }catch{}
    },7500)
}
