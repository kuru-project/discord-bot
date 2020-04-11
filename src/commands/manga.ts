module.exports = {
  name: 'manga',
  description: 'Display Manga Info',
  async execute(message, args) {
    const data = require('../utils/data');

    if (!args.length) {
      return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }

    let search = args.join(' ');

    const query = `
    query ($title: String) {
      Media (search: $title, type: MANGA) {
        title {
          english
          native
        }
        bannerImage
        description
        genres
        chapters
        volumes
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
      message.channel.send('There was an error retrieving manga info.');
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
          name: 'Chapters',
          value: Media.chapters ? Media.chapters : 0,
          inline: true,
        },
        {
          name: 'Volumes',
          value: Media.volumes ? Media.volumes : 0,
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
