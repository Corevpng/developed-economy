const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const moneyDataPath = path.join(__dirname, '../data/money.json');
const inventoryDataPath = path.join(__dirname, '../data/inventory.json');
const marketDataPath = path.join(__dirname, '../data/market.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eşya-al')
    .setDescription('Bir eşya satın alır ve envanterinize ekler.')
    .addStringOption(option => 
      option.setName('eşya')
        .setDescription('Satın alınacak eşya adı')
        .setRequired(true)),

  async execute(interaction) {
    const eşya = interaction.options.getString('eşya');
    const userId = interaction.user.id;

    let moneyData = {};
    let inventoryData = {};
    let marketData = {};

    if (fs.existsSync(moneyDataPath)) {
      moneyData = JSON.parse(fs.readFileSync(moneyDataPath));
    }
    if (fs.existsSync(inventoryDataPath)) {
      inventoryData = JSON.parse(fs.readFileSync(inventoryDataPath));
    }
    if (fs.existsSync(marketDataPath)) {
      marketData = JSON.parse(fs.readFileSync(marketDataPath));
    }

    const item = Object.values(marketData).find(item => item.name === eşya);
    if (!item) {
      return interaction.reply({ content: 'Bu eşya pazar yerinde bulunmuyor. 🚫', ephemeral: true });
    }

    if (!moneyData[userId] || moneyData[userId].balance < item.price) {
      return interaction.reply({ content: 'Yeterli coin bulunmuyor. 😔', ephemeral: true });
    }

    if (!inventoryData[userId]) {
      inventoryData[userId] = { items: [] };
    }

    moneyData[userId].balance -= item.price;
    inventoryData[userId].items.push(eşya);

    fs.writeFileSync(moneyDataPath, JSON.stringify(moneyData, null, 2));
    fs.writeFileSync(inventoryDataPath, JSON.stringify(inventoryData, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('Eşya Satın Alma Başarılı! 🛒')
      .setDescription(`**${eşya}** adlı eşyayı satın aldınız ve envanterinize eklendi! 🎉`)
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};