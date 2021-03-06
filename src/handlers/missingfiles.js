const { existsSync, appendFileSync } = require('fs');

module.exports = async () => {
    const template =
    {
        token: "TOKEN_HERE",
        prefix: "PREFIX_HERE",
        owner: ["BOT_OWNER1_ID_HERE", "BOT_OWNER2_ID_HERE"]
    }

    if (!existsSync('..\\config.json')) {
        appendFileSync('..\\config.json', JSON.stringify(template,null,4))
    }
    ['s_settings','u_settings','economy'].forEach(file => {
        if (!existsSync(`..\\db\\${file}.json`)) {
            appendFileSync(`..\\db\\${file}.json`, '{}')
        }
    });
    ["commands.log"].forEach(file => {
        if (!existsSync(`..\\${file}`)) {
            appendFileSync(`..\\${file}`, '')
        }
    });
}
