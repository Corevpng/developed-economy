const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const marketDataPath = path.join(__dirname, '../data/market.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('market')
    .setDescription('Market içerisindeki ürünleri listeler.'),

  async execute(interaction) {
    let marketData = {};
    if (fs.existsSync(marketDataPath)) {
      marketData = JSON.parse(fs.readFileSync(marketDataPath));
    }

    const items = Object.entries(marketData).slice(0, 30).map(([id, item]) => 
      `**${item.name}** - Fiyat: ${item.price} pcoin - ID: ${id}`
    );

    const embed = new EmbedBuilder()
      .setTitle('Market Ürünleri 🛒')
      .setDescription(items.length > 0 ? items.join('\n') : 'Market boş! 🚫')
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed] });
  },
};