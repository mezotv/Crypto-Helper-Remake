const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get a list of all commands supported by the bot'),

  async execute(interaction, client) {
    const pingembed = new MessageEmbed()
      .setAuthor({
        name: `${client.user.username}`,
        iconURL: client.user.avatarURL(),
      })
      .setColor('#5865f4')
      .setTitle(':newspaper: Commands!')
      .addFields(
        {
          name: '**/gas [selected coin]**',
          value: '> Shows the current transaction fee of the selected coin',
          inline: true,
        },
        {
          name: '**/miner [selected miner]**',
          value: '> Shows a setup for the selected miner',
          inline: true,
        },
        {
          name: '**/lhr**',
          value: '> Shows info about Nvidias LHR Graphics Cards',
          inline: true,
        },
        {
          name: '**/info**',
          value: '> Shows some info about the bot',
          inline: true,
        },
        {
          name: '**/ping**',
          value: '> Shows the api and shard latency',
          inline: true,
        },
        {
          name: '**/vote**',
          value: '> Shows the link to vote for the bot',
          inline: true,
        },
      )
      .setFooter({ text: 'Crypto Helper made by Developer Dungeon Studios' })
      .setTimestamp();

    await interaction.reply({
      embeds: [pingembed],
    });
  },
};
