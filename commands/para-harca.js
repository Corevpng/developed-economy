const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const moneyDataPath = path.join(__dirname, '../data/money.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('para-harcama')
    .setDescription('Belirli bir miktar coin harcayın.')
    .addIntegerOption(option => 
      option.setName('miktar')
        .setDescription('Harcayacağınız coin miktarı')
        .setRequired(true)),

  async execute(interaction) {
    const miktar = interaction.options.getInteger('miktar');
    const userId = interaction.user.id;

    if (miktar <= 0) {
      return interaction.reply({ content: 'Miktar 0 veya daha düşük olamaz. 🚫', ephemeral: true });
    }

    let moneyData = {};
    if (fs.existsSync(moneyDataPath)) {
      moneyData = JSON.parse(fs.readFileSync(moneyDataPath));
    }

    if (!moneyData[userId] || moneyData[userId].balance < miktar) {
      return interaction.reply({ content: 'Yeterli coin bulunmuyor. 😔', ephemeral: true });
    }

    moneyData[userId].balance -= miktar;
    fs.writeFileSync(moneyDataPath, JSON.stringify(moneyData, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('Para Harcama Başarılı! 💳')
      .setDescription(`**${miktar} coin** harcadınız. 🏷️`)
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};
