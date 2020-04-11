module.exports = {
  name: 'Anime',
  description: 'Display Anime Info',
  async execute(message, args) {
    const data = require('../utils/data');
    
    if (!args.length) {
      return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }

    let search = args.join(' ');

    const query = `
    query ($title: String) {
      Media (search: $title, type: ANIME) {
        title {
          english
          native
        }
        bannerImage
        description
        genres
        episodes
      }
    }
    `;

    const variables = {
      title: search
    };

    const res = await data(
      'POST',
      'https://graphql.anilist.co',
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify({
        query: query,
        variables: variables
      })
    );

    if (!res.data) {
      message.channel.send('There was an error retrieving anime info.');
      return;
    }

    const Media = res.data.data.Media;

    const embed = {
      title: Media.title.english ? Media.title.english : Media.title.native,
      description: Media.description.replace(/<br>/g, ''),
      fields: [
        {
          name: 'Genres',
          value: Media.genres.join(', '),
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: 'Episodes',
          value: Media.episodes ? Media.episodes : 0,
          inline: true,
        }
      ],
      image: {
        url: Media.bannerImage,
      }
    };

    message.channel.send({ embed });

},
};
