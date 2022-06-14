const { readdirSync } = require('fs');
const { hashify } = require('hashify-matchify');
const guildcreate = require('../db/Models/guildModel.ts');
const userModel = require('../db/Models/userModel.ts');

module.exports = async (interaction) => {
  const { hash } = await hashify(interaction.user.id);

  if (!interaction.guild) {
    interaction.reply({
      content: 'You need to be in a server to use this command.',
      ephemeral: true,
    });
  } else {
    guildcreate.findOne({ guildID: interaction.guild.id }).then(async (result) => {
      if (!result) {
        await guildcreate.create({
          guildID: interaction.guild.id,
          botJoined: (Date.now() / 1000) | 0,
          fistCommandUse: (Date.now() / 1000) | 0,
        });
      } else {}
      userModel.findOne({ userID: interaction.user.id }).then(async (result) => {
        if (!result) {
          await userModel.create({
            userID: interaction.user.id,
            userHash: hash,
          });
        } else {}

        const { client } = interaction;
        const commandFiles = readdirSync('./src/commands/').filter((file) => file.endsWith('.js'));
        const commands = [];
        for (const file of commandFiles) {
          const command = require(`../commands/${file}`);
          commands.push(command.data.toJSON());
          client.commands.set(command.data.name, command);
        }
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
          command.execute(interaction, client);
        } catch (err) {
          if (err) console.error(err);
          interaction.reply({
            content: 'An error occurred while executing that command.',
            ephemeral: true,
          });
        }
      });
    });
  }
};
