const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const moneyDataPath = path.join(__dirname, '../data/money.json');
const inventoryDataPath = path.join(__dirname, '../data/inventory.json');
const marketDataPath = path.join(__dirname, '../data/market.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('iade-et')
    .setDescription('Bir ürünü geri iade eder ve parasını geri alır.')
    .addIntegerOption(option => 
      option.setName('ürün-id')
        .setDescription('İade edilecek ürünün ID\'si')
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

    if (!inventoryData[userId] || !inventoryData[userId].items.includes(ürünId)) {
      return interaction.reply({ content: 'Bu ürün envanterinizde bulunmuyor. 🚫', ephemeral: true });
    }

    const item = marketData[ürünId] || { name: 'Bilinmeyen', price: 0 };
    inventoryData[userId].items = inventoryData[userId].items.filter(item => item !== ürünId);
    moneyData[userId].balance += item.price;
    marketData[ürünId] = item;

    fs.writeFileSync(moneyDataPath, JSON.stringify(moneyData, null, 2));
    fs.writeFileSync(inventoryDataPath, JSON.stringify(inventoryData, null, 2));
    fs.writeFileSync(marketDataPath, JSON.stringify(marketData, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('Ürün İade Edildi! 🔄')
      .setDescription(`**${item.name}** adlı ürünü iade ettiniz ve **${item.price} pcoin** geri aldınız! 🎉`)
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};