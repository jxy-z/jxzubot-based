import { readdirSync } from "fs";
import { pathToFileURL } from "url";
import path from "path";
import chokidar from "chokidar";
import chalk from "chalk";
import { isOwner, isAllowed } from "./utils.js";
import config from "../config.js";

const PLUGINS_DIR = path.resolve(process.cwd(), "plugins");

export class PluginLoader {
  constructor(client) {
    this.client = client;
    this.commands = new Map(); 
    this.watcher = null;
  }

  log(...args) {
    console.log(chalk.green.bold("[plugins]", ...args));
  }

  async loadAll() {
    this.commands.clear();
    const files = readdirSync(PLUGINS_DIR).filter((f) => f.endsWith(".js"));
    for (const file of files) {
      await this.loadFile(file, { silent: true });
    }
    console.log(chalk.cyan.bold(`[ plugins ] - ${this.commands.size} command dimuat dari ${files.length} file plugin`));
  }

  async loadFile(file, { silent = false } = {}) {
    const fullPath = path.join(PLUGINS_DIR, file);
    try {
      const url = `${pathToFileURL(fullPath).href}?update=${Date.now()}`;
      const mod = await import(url);
      const plugin = mod.default;

      if (!plugin || !plugin.name) {
        console.log(chalk.red.bold(`[ plugins ] - Warn ${file}: tidak ada default export yang valid`));
        return;
      }

      for (const [cmd, meta] of this.commands.entries()) {
        if (meta.file === file) this.commands.delete(cmd);
      }

      const aliases = [plugin.name, ...(plugin.aliases || [])];
      for (const alias of aliases) {
        this.commands.set(alias.toLowerCase(), { ...plugin, file });
      }

      if (!silent) console.log(chalk.green.bold(`[ plugins ] - Reloaded: ${file} (${aliases.join(", ")})`));
    } catch (err) {
      console.log(chalk.red.bold(`[plugins] -  Gagal load ${file}:`, err.message));
    }
  }

  unloadFile(file) {
    for (const [cmd, meta] of this.commands.entries()) {
      if (meta.file === file) this.commands.delete(cmd);
    }
    console.log(chalk.red.bold(`[ plugins ] - Warn unloaded: ${file}`));
  }

  watch() {
    this.watcher = chokidar.watch(PLUGINS_DIR, {
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 },
    });

    this.watcher
      .on("add", (p) => this.loadFile(path.basename(p)))
      .on("change", (p) => this.loadFile(path.basename(p)))
      .on("unlink", (p) => this.unloadFile(path.basename(p)));

    console.log(chalk.yellow.bold("[ plugins ] - Watching folder plugins. . ."));
  }

  getCommand(name) {
    return this.commands.get(name.toLowerCase());
  }

  canExecute(plugin, senderId) {
    const owner = senderId ? isOwner(senderId) : false;

    if (owner) {
      return { allowed: true, reason: null };
    }

    if (!isAllowed(senderId)) {
      return { allowed: false, reason: `mode "${config.mode}", bukan owner` };
    }

    if (plugin.owner === true) {
      return { allowed: false, reason: `command "${plugin.name}" owner-only` };
    }

    return { allowed: true, reason: null };
  }
}