const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const marketDataPath = path.join(__dirname, '../data/market.json');
const inventoryDataPath = path.join(__dirname, '../data/inventory.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pazar-ekle')
    .setDescription('Kendi eşyanızı pazar yerine ekler.')
    .addStringOption(option => 
      option.setName('isim')
        .setDescription('Eşyanın adı')
        .setRequired(true))
    .addIntegerOption(option => 
      option.setName('fiyat')
        .setDescription('Eşyanın fiyatı')
        .setRequired(true)),

  async execute(interaction) {
    const isim = interaction.options.getString('isim');
    const fiyat = interaction.options.getInteger('fiyat');
    const userId = interaction.user.id;

    let marketData = {};
    let inventoryData = {};

    if (fs.existsSync(marketDataPath)) {
      marketData = JSON.parse(fs.readFileSync(marketDataPath));
    }
    if (fs.existsSync(inventoryDataPath)) {
      inventoryData = JSON.parse(fs.readFileSync(inventoryDataPath));
    }

    if (!inventoryData[userId] || !inventoryData[userId].items.includes(isim)) {
      return interaction.reply({ content: 'Bu eşya envanterinizde bulunmuyor. 🚫', ephemeral: true });
    }

    const productId = Math.floor(1000 + Math.random() * 9000); // 4 haneli rastgele ID

    marketData[productId] = {
      name: isim,
      price: fiyat,
      seller: interaction.user.username
    };

    fs.writeFileSync(marketDataPath, JSON.stringify(marketData, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('Pazar Eşyası Ekleme Başarılı! 🛍️')
      .setDescription(`**${isim}** adlı eşyayı pazar yerine **${fiyat} coin** fiyatıyla eklediniz! 🎉`)
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};