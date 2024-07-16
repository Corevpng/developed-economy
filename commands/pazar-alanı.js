const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const marketDataPath = path.join(__dirname, '../data/market.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pazar-alanı')
    .setDescription('Pazar yerindeki ürünleri listeler.'),

  async execute(interaction) {
    let marketData = {};
    if (fs.existsSync(marketDataPath)) {
      marketData = JSON.parse(fs.readFileSync(marketDataPath));
    }

    const items = Object.values(marketData).map(item => 
      `**${item.name}** - Fiyat: ${item.price} coin - Satıcı: ${item.seller} - ID: ${Object.keys(marketData).find(key => marketData[key] === item)}`
    );

    const embed = new EmbedBuilder()
      .setTitle('Pazar Alanı 🏬')
      .setDescription(items.length > 0 ? items.join('\n') : 'Pazar yerinde ürün bulunmuyor. 🚫')
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};