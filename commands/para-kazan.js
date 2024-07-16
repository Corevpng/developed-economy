const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const moneyDataPath = path.join(__dirname, '../data/money.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('para-kazan')
    .setDescription('Belirli bir miktar coin kazanın.')
    .addIntegerOption(option => 
      option.setName('miktar')
        .setDescription('Kazandırılacak coin miktarı')
        .setRequired(true)),

  async execute(interaction) {
    const miktar = interaction.options.getInteger('miktar');
    const userId = interaction.user.id;

    if (miktar <= 0) {
      return interaction.reply({ content: 'Miktar 0 veya daha düşük olamaz. 💸', ephemeral: true });
    }

    let moneyData = {};
    if (fs.existsSync(moneyDataPath)) {
      moneyData = JSON.parse(fs.readFileSync(moneyDataPath));
    }

    if (!moneyData[userId]) {
      moneyData[userId] = { balance: 0 };
    }

    moneyData[userId].balance += miktar;

    fs.writeFileSync(moneyDataPath, JSON.stringify(moneyData, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('Para Kazanma Başarılı! 🎉')
      .setDescription(`**${miktar} coin** kazandınız! 💰`)
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};