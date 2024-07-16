const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const moneyDataPath = path.join(__dirname, '../data/money.json');
const bankDataPath = path.join(__dirname, '../data/bank.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banka-yatır')
    .setDescription('Banka hesabınıza coin yatırır.')
    .addIntegerOption(option => 
      option.setName('miktar')
        .setDescription('Yatırılacak coin miktarı')
        .setRequired(true)),

  async execute(interaction) {
    const miktar = interaction.options.getInteger('miktar');
    const userId = interaction.user.id;

    if (miktar <= 0) {
      return interaction.reply({ content: 'Miktar 0 veya daha düşük olamaz. 🚫', ephemeral: true });
    }

    let moneyData = {};
    let bankData = {};
    if (fs.existsSync(moneyDataPath)) {
      moneyData = JSON.parse(fs.readFileSync(moneyDataPath));
    }
    if (fs.existsSync(bankDataPath)) {
      bankData = JSON.parse(fs.readFileSync(bankDataPath));
    }

    if (!moneyData[userId] || moneyData[userId].balance < miktar) {
      return interaction.reply({ content: 'Yeterli coin bulunmuyor. 😔', ephemeral: true });
    }

    if (!bankData[userId]) {
      bankData[userId] = { balance: 0 };
    }

    moneyData[userId].balance -= miktar;
    bankData[userId].balance += miktar;

    fs.writeFileSync(moneyDataPath, JSON.stringify(moneyData, null, 2));
    fs.writeFileSync(bankDataPath, JSON.stringify(bankData, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('Banka Yatırma Başarılı! 💳')
      .setDescription(`**${miktar} coin** banka hesabınıza yatırıldı. 💰`)
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};