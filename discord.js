const discord = require("discord.js");
const bot = new discord.Client();
const token = "af";

bot.login(token);


bot.on("ready", function () {
    console.log("ready");
});

bot.on("message", function (message) {
    if (message.content === "!test") {
        const ch1 = bott.chann
        ch1.send()
    }
    console.log("ready");
});