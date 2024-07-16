const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const inventoryDataPath = path.join(__dirname, '../data/inventory.json');
const marketDataPath = path.join(__dirname, '../data/market.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('incele')
    .setDescription('Envanterindeki ürünü detaylarıyla inceler.')
    .addStringOption(option => 
      option.setName('ürün-adı')
        .setDescription('Detaylarını görmek istediğiniz ürünün adı')
        .setRequired(true)),

  async execute(interaction) {
    const ürünAdı = interaction.options.getString('ürün-adı');
    const userId = interaction.user.id;

    let inventoryData = {};
    let marketData = {};

    if (fs.existsSync(inventoryDataPath)) {
      inventoryData = JSON.parse(fs.readFileSync(inventoryDataPath));
    }
    if (fs.existsSync(marketDataPath)) {
      marketData = JSON.parse(fs.readFileSync(marketDataPath));
    }

    if (!inventoryData[userId] || !inventoryData[userId].items.includes(ürünAdı)) {
      return interaction.reply({ content: 'Bu ürün envanterinizde bulunmuyor. 🚫', ephemeral: true });
    }

    const item = Object.values(marketData).find(i => i.name === ürünAdı) || { name: ürünAdı, price: 'Bilinmiyor' };

    const embed = new EmbedBuilder()
      .setTitle('Ürün Detayları 📋')
      .addField('Ürün Adı', item.name, true)
      .addField('Fiyat', `${item.price} pcoin`, true)
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};