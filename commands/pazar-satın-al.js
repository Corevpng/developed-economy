const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const moneyDataPath = path.join(__dirname, '../data/money.json');
const inventoryDataPath = path.join(__dirname, '../data/inventory.json');
const marketDataPath = path.join(__dirname, '../data/market.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pazar-satın-al')
    .setDescription('Pazar yerinden bir ürün satın alır.')
    .addIntegerOption(option => 
      option.setName('ürün-id')
        .setDescription('Satın alınacak ürünün ID\'si')
        .setRequired(true)),

  async execute(interaction) {
    const ürünId = interaction.options.getInteger('ürün-id');
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

    const item = marketData[ürünId];
    if (!item) {
      return interaction.reply({ content: 'Bu ürün pazar yerinde bulunmuyor. 🚫', ephemeral: true });
    }

    if (!moneyData[userId] || moneyData[userId].balance < item.price) {
      return interaction.reply({ content: 'Yeterli coin bulunmuyor. 😔', ephemeral: true });
    }

    if (!inventoryData[userId]) {
      inventoryData[userId] = { items: [] };
    }

    moneyData[userId].balance -= item.price;
    inventoryData[userId].items.push(item.name);
    delete marketData[ürünId];

    fs.writeFileSync(moneyDataPath, JSON.stringify(moneyData, null, 2));
    fs.writeFileSync(inventoryDataPath, JSON.stringify(inventoryData, null, 2));
    fs.writeFileSync(marketDataPath, JSON.stringify(marketData, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('Ürün Satın Alma Başarılı! 🛒')
      .setDescription(`**${item.name}** adlı ürünü satın aldınız ve envanterinize eklendi! 🎉`)
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};