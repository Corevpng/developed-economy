const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const inventoryDataPath = path.join(__dirname, '../data/inventory.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('envanter')
    .setDescription('Sahip olduğunuz eşyaları gösterir.'),

  async execute(interaction) {
    const userId = interaction.user.id;

    let inventoryData = {};
    if (fs.existsSync(inventoryDataPath)) {
      inventoryData = JSON.parse(fs.readFileSync(inventoryDataPath));
    }

    const items = inventoryData[userId] ? inventoryData[userId].items : [];

    const embed = new EmbedBuilder()
      .setTitle('Envanteriniz 🎒')
      .setDescription(items.length > 0 ? items.join('\n') : 'Envanterde hiç eşya bulunmuyor. 🛒')
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};