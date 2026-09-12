import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { NewMessage } from "telegram/events/index.js";

import input from "input";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import chalk from "chalk";

import config from "./config.js";
import { PluginLoader } from "./lib/plugin.js";
import { parseCommand, isOwner } from "./lib/utils.js";

const { apiId, apiHash } = config;

const SESSIONS_DIR = path.resolve(process.cwd(), "sessions");
const SESSION_FILE = path.join(SESSIONS_DIR, "session.txt");

function loadSessionString() {
  if (!existsSync(SESSION_FILE)) return "";
  return readFileSync(SESSION_FILE, "utf-8").trim();
}

function saveSessionString(sessionString) {
  try {
    if (!existsSync(SESSIONS_DIR)) mkdirSync(SESSIONS_DIR, { recursive: true });
    writeFileSync(SESSION_FILE, sessionString, "utf-8");
    console.log(chalk.green.bold(`[ system ] - sessionString tersimpan ke sessions/session.txt\n`));
  } catch (err) {
    console.log(chalk.red.bold(`[ warn ] Gagal simpan session ke file\n\n${err.message}`));
    console.log(chalk.red.bold("Copy manual string di bawah ke sessions/session.txt:\n"));
    console.log(sessionString, "\n");
  }
}

async function main() {
  const existingSession = loadSessionString();
  const stringSession = new StringSession(existingSession);
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  if (!existingSession) {
    await client.start({
      phoneNumber: async () => {
        console.clear();
        console.log(chalk.white.bold("1.) Input your telegram number (format: 628xxxxxxxxxx)"));
        return await input.text("Number: ");
      },
      phoneCode: async () => {
        console.clear();
        console.log(chalk.white.bold("\n2.) Input OTP code from telegram"));
        return await input.text("OTP Code: ");
      },
      password: async () => {
        console.clear();
        console.log(chalk.white.bold("\n[ ! ] Akun terdapat Two-Step Verification (2FA) aktif."));
        return await input.text("Password 2FA (Enter jika tidak ada): ");
      },
      onError: (err) => console.error("❌ Error:", err.message),
    });

    saveSessionString(client.session.save());

  } else {
    await client.connect();
  }
  
  console.clear();
  console.log(
    chalk.green.bold(`[ Succes ] - Userbot connect!\n\n`) +
    chalk.blue.bold(` Simple bot info:`) +
    chalk.white.bold(`
  ├ bot name: ${config.botname}
  ├ version: ${config.versi}
  ├ author: @jarroffc2
  ├ bot type: Plugins (ESM)
  ├ runtime: GramJS
  ├ mode: ${config.mode}
  └ runtime: NodeJS

 Tetap berhati-hati, jangan spam 
 agar akun tetap aman 
 dari mute/banned!\n`)
  );

  const loader = new PluginLoader(client);
  await loader.loadAll();
  loader.watch();

  client.addEventHandler(async (event) => {
    try {
      const msg = event.message;
      if (!msg?.message) return;

      const parsed = parseCommand(msg.message);
      if (!parsed) return;

      const plugin = loader.getCommand(parsed.cmd);
      if (!plugin) return;

      const senderId = msg.senderId;
      const sender = await msg.getSender().catch(() => null);
      const username = sender?.username ? `@${sender.username}` : "-";
      const owner = senderId ? isOwner(senderId) : false;
      const chatType = msg.isGroup ? "group" : msg.isPrivate ? "private" : msg.isChannel ? "channel" : "unknown";

      console.log(chalk.blue.bold(" \n[ active ] - Command detect"));
      console.log(
        chalk.white.bold(`  Cmd: ${config.prefix}${parsed.cmd}`) + "\n" +
        chalk.white.bold(`  Username: ${username}`) + "\n" +
        chalk.white.bold(`  Id: ${senderId ?? "-"}`) + "\n" +
        (owner ? chalk.white.bold(`  Owner: true`) : chalk.white.bold(`  Owner: false`)) + "\n" +
        chalk.white.bold(`  Chat on: ${chatType}`)
      );

      const { allowed, reason } = loader.canExecute(plugin, senderId);
      if (!allowed) {
       // console.log(chalk.yellow.bold(`  Skipped: ${reason}\n`));
        return;
      }

      await plugin.run(client, event, parsed, loader);
    } catch (err) {
      console.log(chalk.red.bold("[ warn ] - Error saat menjalankan command:"), err);
    }
  }, new NewMessage({}));
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});