const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const bankDataPath = path.join(__dirname, '../data/bank.json');
const moneyDataPath = path.join(__dirname, '../data/money.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banka-çek')
    .setDescription('Banka hesabınızdan coin çeker.')
    .addIntegerOption(option => 
      option.setName('miktar')
        .setDescription('Çekilecek coin miktarı')
        .setRequired(true)),

  async execute(interaction) {
    const miktar = interaction.options.getInteger('miktar');
    const userId = interaction.user.id;

    if (miktar <= 0) {
      return interaction.reply({ content: 'Miktar 0 veya daha düşük olamaz. 🚫', ephemeral: true });
    }

    let bankData = {};
    let moneyData = {};
    if (fs.existsSync(bankDataPath)) {
      bankData = JSON.parse(fs.readFileSync(bankDataPath));
    }
    if (fs.existsSync(moneyDataPath)) {
      moneyData = JSON.parse(fs.readFileSync(moneyDataPath));
    }

    if (!bankData[userId] || bankData[userId].balance < miktar) {
      return interaction.reply({ content: 'Banka hesabınızda yeterli coin bulunmuyor. 😔', ephemeral: true });
    }

    if (!moneyData[userId]) {
      moneyData[userId] = { balance: 0 };
    }

    bankData[userId].balance -= miktar;
    moneyData[userId].balance += miktar;

    fs.writeFileSync(bankDataPath, JSON.stringify(bankData, null, 2));
    fs.writeFileSync(moneyDataPath, JSON.stringify(moneyData, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('Banka Çekme Başarılı! 💵')
      .setDescription(`**${miktar} coin** cüzdanınıza eklendi. 💰`)
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};