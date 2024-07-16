const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const moneyDataPath = path.join(__dirname, '../data/money.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cüzdan')
    .setDescription('Mevcut coin miktarınızı gösterir.'),

  async execute(interaction) {
    const userId = interaction.user.id;

    let moneyData = {};
    if (fs.existsSync(moneyDataPath)) {
      moneyData = JSON.parse(fs.readFileSync(moneyDataPath));
    }

    const balance = moneyData[userId] ? moneyData[userId].balance : 0;

    const embed = new EmbedBuilder()
      .setTitle('Cüzdanınız 🏦')
      .setDescription(`Mevcut coin miktarınız: **${balance}** 💰`)
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};