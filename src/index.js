require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');
const { Events, Client, GatewayIntentBits } = require('discord.js');

const client = new ExtendedClient();

client.start();

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

// Handles errors and avoids crashes, better to not remove them.
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

module.exports = client;

//Counting
const counting = require('./schemas/CountingSchema')
client.on(Events.MessageCreate, async message => {
    if (!message.guild) return;
    if (message.author.bot) return;

    const data = await counting.findOne({ Guild: message.guild.id});
    if (!data) return;
    else {

        if (message.channel.id !== data.Channel) return;

        const number = Number(message.content);

        if (number !== data.Number) {
            return message.react(`❌`);
        } else if (data.LastUser === message.author.id) {
            message.react(`❌`);
            await message.reply(`❌ Ai đó đã đếm số này (có thể là bạn điếm 2 lần liên tiếp)!`);
        } else {
            await message.react(`✅`);

            data.LastUser = message.author.id;
            data.Number++;
            await data.save();
        }
    }
})