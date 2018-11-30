const Discord   = require('discord.js');
const ApiAI     = require('apiai');
const firebase  = require('firebase');

const Client    = new Discord.Client();
const App       = ApiAI(process.env.DF_CLIENT_ACCESS_TOKEN);

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_PROJECT_ID + '.firebaseapp.com',
    databaseURL: 'https://' + process.env.FIREBASE_DATABASE_NAME + '.firebaseio.com',
    storageBucket: process.env.FIREBASE_BUCKET + '.appspot.com',
};
firebase.initializeApp(firebaseConfig);

// App Title
const appTitle = 'Kuru Anime';

// Rules Text
const rulesText = `**1.** Please do not be an asshole!
**2.** Do not post outside links.
**3.** Please talk in English only.
**4.** Only talk to the bots on their own channels.`;

// Welcome Message
const welcomeText = 'Hello! Thanks for joining ' + appTitle + '! Feel free to talk to me here or if you prefer, talk to me on the #kuru-anime channel.';

// Fun Help Command
const funHelp = 'Help command is under maintenance';

// Symbol Command of Fun
const symbolCommand = '%';

// Bot Ready Message
Client.on('ready', () => {
    console.log('Bot is ready.');
});

// New User
Client.on('guildMemberAdd', member => {
    member.send(welcomeText)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
});

// Main Code
Client.on('message', message => {
    // Kuru Fun
    if (message.channel.name === 'kuru-fun' && Client.user.id !== message.author.id) {
        switch(message.cleanContent) {
            // Rules Text
            case symbolCommand + 'rules':
                const rulesEmbed = new Discord.RichEmbed()
                    .setTitle('Rules to obey')
                    .setColor(0xcd3c2a)
                    .setThumbnail('https://i.imgur.com/5q2WR9V.png')
                    .setDescription(rulesText);
                message.channel.send(rulesEmbed);
                break;
            // Show Avatar
            case symbolCommand + 'avatar':
                message.reply('Here\'s your avatar!');
                const avatarEmbed = new Discord.RichEmbed()
                    .setTitle('Avatar Full View')
                    .setColor(0xcd3c2a)
                    .setImage(message.author.avatarURL);
                message.channel.send(avatarEmbed);
                break;
            case symbolCommand + 'help':
                message.reply(funHelp);
                break;
            // Normal Message
            default:
                message.reply("Command not found!");
        }
    }
    // Kuru Election
    if (message.channel.name === 'kuru-election' && Client.user.id !== message.author.id) {
        message.reply('#kuru-election is under maintenance.');
    }
    // Dialogflow
    if ((message.channel.name === 'kuru-anime' || message.channel.type === 'dm') && Client.user.id !== message.author.id) {
        let promise = new Promise((resolve, reject) => {
            let request = App.textRequest(message.cleanContent, {
                sessionId: message.author.id
            });
            request.on('response', (response) => {
                console.log(response);
                let rep = response.result.fulfillment.speech;
                resolve(rep);
            });
            request.on('error', (error) => {
                resolve(null);
            });
            request.end();
        });
        (async function () {
            let result = await promise;
            if (result) {
                message.reply(result);
            } else {
                message.reply('nothing here');
            }
        }());
    }
});

// Discord Login
Client.login(process.env.BOT_TOKEN);