const bible = require('./lib/bible');
const config = require('config');
const colors = require('./lib/roles/colors');
const Discord = require('discord.js');
const logger = require('./lib/common/logger');
const ages = require('./lib/roles/ages');
const games = require('./lib/roles/games');
const genders = require('./lib/roles/genders');
const orientations = require('./lib/roles/orientations');
const registration = require('./lib/registration');
const roles = require('./lib/roles');
const prompt = require('./lib/prompt');
const LeagueOfLegends = require('./lib/league-of-legends');

const client = new Discord.Client({disableEveryone: true});
bible.setClient(client);

client.on('ready', async () => {
    logger.info(`Logged in as ${client.user.tag}!`);

    try {
        let link = await client.generateInvite(['ADMINISTRATOR']);
        logger.debug('link:', link);
        const channel = client.channels.get('510082804655063060');
        await channel.fetchMessage(roles.age);
        await channel.fetchMessage(roles.color);
        await channel.fetchMessage(roles.gender);
        await channel.fetchMessage(roles.orientation);

        new LeagueOfLegends(client);
        registration.init(client);
        roles.init(client);
        prompt.init(client);
    } catch (e) {
        logger.error(e);
    }
});

const handleMessage = async (message, messageUpdate = false) => {
    message = messageUpdate || message;
    const {author, channel, content} = message;
    // if (author.client) {
    //     return;
    // }

    logger.debug(channel.name);
    logger.debug(`${author.username}: ${content}`);

    switch(true) {
        case content.toLowerCase() === 'i love rachel':
            return message.reply(':heart: :heart: :heart:');
        case content.toLowerCase() === 'rachel is a real person':
        case content.toLowerCase() === 'i think rachel is a real person':
        case content.toLowerCase() === 'i think rachel bot is a real person':
        case content.toLowerCase() === 'rachel bot is a real person':
            logger.verbose(`${bot.user.username}: 😉`);
            return message.reply('You can think that~ 😉');
        case content.toLowerCase() === 'hi shibi':
        case content.toLowerCase() === 'hi matt':
        case content.toLowerCase() === 'hi kuri':
        case content.toLowerCase() === 'hi jayxd':
            return message.channel.send(content);
        case content.toLowerCase() === 'ping':
            logger.verbose(`${client.user.username}: pong`);
            return message.reply('pong');
        case content.startsWith('bible h '):
        case content.startsWith('bible help '):
        case content.startsWith('bible --help '):
            return bible.help();
        case content.startsWith('--verse'):
        case content.startsWith('bible t '):
        case content.startsWith('bible text '):
        case content.startsWith('bible --text '):
            return bible.sendVerse(message);
        case content.startsWith('bible a '):
        case content.startsWith('bible audio '):
        case content.startsWith('bible --audio '):
            return bible.playAudio(message);
        case content.startsWith('game a '):
        case content.startsWith('game add '):
        case content.startsWith('game --add '):
            return games.add(message);
        case content.startsWith('game h'):
        case content.startsWith('game help'):
        case content.startsWith('game --help'):
            return games.help(message);
        case content.startsWith('game r '):
        case content.startsWith('game remove '):
        case content.startsWith('game --remove '):
            return games.remove(message);
        default:
            return void 0;
    }
};

client.on('message', handleMessage);
client.on('messageUpdate', handleMessage);

const reactions = action => (reaction, user) => {
    console.log(action, 'emoji:', reaction._emoji.name);
    switch(reaction.message.id) {
        case roles.age:
            return ages[action](reaction, user.id);
        case roles.color:
            return colors[action](reaction, user.id);
        case roles.gender:
            return genders[action](reaction, user.id);
        case roles.orientation:
            return orientations[action](reaction, user.id);
        default:
            return void 0;
    }
};

client.on('messageReactionAdd', reactions('set'));
client.on('messageReactionRemove', reactions('remove'));

client.on('error', logger.error);

client.login(config.get('discord.token'))
    .catch(error => logger.error('Failed to login!', error));

process.on('uncaughtException', error => logger.error('Caught exception:', error));
