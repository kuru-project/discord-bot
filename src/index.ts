// Guide: https://discordjs.guide/
// Current Point: https://discordjs.guide/command-handling/#individual-command-files
// DiscordJS Import
const discord = require('discord.js');
const client = new discord.Client();

const prefix = ':';

// Bot Mount Event Trigger
client.on('ready', () => {
  console.log('Bot is ready.');
});

// Bot Message Event Trigger
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.channel.send('Pong.');
  }
  else if (command === 'beep') {
    message.channel.send('Boop.');
  }
  else if (command === 'server') {
    message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
  }
  else if (command === 'user-info') {
    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
  }
  else if (command === 'args-info') {
    if (!args.length) {
      return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }
    else if (args[0] === 'foo') {
      return message.channel.send('bar');
    }
    message.channel.send(`First argument: ${args[0]}`);
  }
  else if (command === 'kick') {
    if (!message.mentions.users.size) {
      return message.reply('you need to tag a user in order to kick them!');
    }
    else {
      // grab the "first" mentioned user from the message
      // this will return a `User` object, just like `message.author`
      const taggedUser = message.mentions.users.first();
      message.channel.send(`You wanted to kick: ${taggedUser.username}`);
    }
  }
  else if (command === 'avatar') {
    if (!message.mentions.users.size) {
      return message.channel.send(`Your avatar: ${message.author.avatar}`);
    }
    const avatarList = message.mentions.users.map(user => {
      return `${user.username}'s avatar: ${message.author.avatar}`;
    });
    // send the entire array of strings as a message
    // by default, discord.js will `.join()` the array with `\n`
    message.channel.send(avatarList);
  }
  else if (command === 'prune') {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.reply('that doesn\'t seem to be a valid number.');
    }
    else if (amount <= 1 || amount > 100) {
      return message.reply('you need to input a number between 1 and 99.');
    }

    message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      message.channel.send('there was an error trying to prune messages in this channel!');
    });
  }
});

// Discord Login
client.login(process.env.BOT_TOKEN);
