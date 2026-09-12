import config from "../config.js";
import { isOwner } from "../lib/utils.js";

export default {
  name: "menu",
  aliases: ["help"],
  description: "Menampilkan menu / daftar command bot",

  async run(client, event, parsed, loader) {
    const msg = event.message;
    const sender = await msg.getSender().catch(() => null);
    const username = sender?.username ? `@${sender.username}` : "-";
    const senderId = msg.senderId;
    const owner = senderId ? isOwner(senderId) : false;

    const seen = new Set();
    const list = [];
    for (const plugin of loader.commands.values()) {
      if (seen.has(plugin.name)) continue;
      seen.add(plugin.name);
      list.push(plugin);
    }
    list.sort((a, b) => a.name.localeCompare(b.name));

    let body = list.map((p) => {
      const aliasText = p.aliases?.length ? `(${p.aliases.join(", ")})` : "";
      return `  • ${config.prefix}${p.name} ${aliasText}
  └ <b>${p.description || "-"}</b>`;
      })
      .join("\n\n");

    const text = `<i>Haii 👋 ${username}</i>
    
 <b>Your info 👤</b>
  • username: ${username}
  • user id: <code>${senderId}</code>
  • status: ${owner ? `<b>owner</b>` : `<b>free user</b>`}

 <b>Bot info 🐣</b>
  • botname: <b>${config.botname}</b> 
  • version: <code>v${config.versi}</code>
  • bot mode: <code>${config.mode}</code>
  • prefix: [ ${config.prefix} ]
 
${body}
  
  <i>© powered by @jarroffc2</i>`;

    await msg.reply({ message: text, parseMode: "html" });
  },
};
