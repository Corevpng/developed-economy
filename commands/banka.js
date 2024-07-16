const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const bankDataPath = path.join(__dirname, '../data/bank.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banka')
    .setDescription('Banka hesabınızdaki coin miktarını gösterir.'),

  async execute(interaction) {
    const userId = interaction.user.id;

    let bankData = {};
    if (fs.existsSync(bankDataPath)) {
      bankData = JSON.parse(fs.readFileSync(bankDataPath));
    }

    const balance = bankData[userId] ? bankData[userId].balance : 0;

    const embed = new EmbedBuilder()
      .setTitle('Banka Hesabınız 🏦')
      .setDescription(`Banka hesabınızdaki coin miktarı: **${balance}** 💰`)
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};