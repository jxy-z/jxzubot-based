import { setMode } from "../lib/utils.js";
import config from "../config.js";

export default {
  name: "public",
  description: 'Ubah mode bot to "public"',
  owner: true,
 
  async run(client, event) {
    const msg = event.message;
    
    if (config.mode === "public") {
      await msg.reply({
        message: `Bot sudah dalam mode <b>public</b>`,
        parseMode: "html",
      });
      return;
    }

    const ok = setMode("public");

    await msg.reply({
      message: ok
        ? `✅ Mode update to <b>public mode</b>`
        : `[ warn ] - error`,
      parseMode: "html",
    });
  },
};
