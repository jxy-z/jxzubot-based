export default {
  name: "ping",
  aliases: ["p"],
  description: "Cek kecepatan respon bot",

  async run(client, event, parsed) {
    const msg = event.message;
    const start = Date.now();

    const sent = await msg.reply({
      message: "🏓 Pong...",
    });

    const ms = Date.now() - start;

    await client.editMessage(sent.chatId, {
      message: sent.id,
      text: `🏓 <b>Pong!</b> <code>${ms}ms</code>`,
      parseMode: "html",
    });
  },
};
