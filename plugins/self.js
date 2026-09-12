import { setMode } from "../lib/utils.js";
import config from "../config.js";

export default {
  name: "self",
  description: 'Ubah mode bot to "self".',
  owner: true,

  async run(client, event) {
    const msg = event.message;

    if (config.mode === "self") {
      await msg.reply({
        message: `Bot sudah dalam mode <b>self</b>`,
        parseMode: "html",
      });
      return;
    }

    const ok = setMode("self");

    await msg.reply({
      message: ok
        ? `✅ Mode update to <b>self mode</b>`
        : `[ warn ] - error`,
      parseMode: "html",
    });
  },
};
