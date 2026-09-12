import { isOwner } from "../lib/utils.js";
import config from "../config.js";

const DELAY_MS = config.broadcastDelayMs ?? 700;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default {
  name: "bc",
  aliases: ["broadcast"],
  description: "Broadcast pesan ke semua GRUP",
  owner: true,

  async run(client, event, parsed) {
    const msg = event.message;
    const senderId = msg.senderId;

    let html = parsed.args?.trim();
    let sourceMessage = null;

    if (!html && msg.replyTo) {
      sourceMessage = await msg.getReplyMessage();
      html = sourceMessage?.message || "";
    }

    if (!html) {
      await msg.reply({
        message: `Ex: /bc <b>pesan nya (atau reply)</b>`
        parseMode: "html",
      });
      return;
    }

    const statusMsg = await msg.reply({
      message: "📡 Memulai broadcast ke grup...",
    });

    const dialogs = await client.getDialogs({});

    const targets = dialogs.filter((d) => d.isGroup);

    let success = 0;
    let failed = 0;

    for (const dialog of targets) {
      try {
        if (sourceMessage && sourceMessage.media) {
          await client.forwardMessages(dialog.entity, {
            messages: [sourceMessage.id],
            fromPeer: sourceMessage.chatId,
          });
        } else {
          await client.sendMessage(dialog.entity, {
            message: html,
            parseMode: "html",
            linkPreview: true,
          });
        }
        success++;
      } catch (err) {
        failed++;
        console.error(`[bc] Gagal kirim ke ${dialog.title || dialog.id}:`, err.message);
      }

      await sleep(DELAY_MS);
    }

    await client.editMessage(statusMsg.chatId, {
      message: statusMsg.id,
      text:
        `✅ <b>Broadcast selesai.</b>\n\n` +
        `Berhasil: <code>${success}</code>\n` +
        `Gagal: <code>${failed}</code>\n` +
        `Total grup: <code>${targets.length}</code>`,
      parseMode: "html",
    });
  },
};