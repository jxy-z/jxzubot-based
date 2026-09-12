
import { readFileSync, writeFileSync } from "fs";
import config from "../config.js";

const CONFIG_PATH = new URL("../config.js", import.meta.url);

export const OWNER_IDS = (config.ownerIds || []).map((id) => BigInt(id));
export const PREFIX = config.prefix || "/";

export function isOwner(senderId) {
  try {
    const id = BigInt(senderId.toString());
    return OWNER_IDS.some((o) => o === id);
  } catch {
    return false;
  }
}

export function isAllowed(senderId) {
  if (config.mode === "self") return isOwner(senderId);
  return true; // public
}

export function setMode(mode) {
  if (mode !== "self" && mode !== "public") {
    throw new Error('mode harus "self" atau "public"');
  }
  config.mode = mode;

  try {
    let content = readFileSync(CONFIG_PATH, "utf-8");
    if (!/mode:\s*["'`][^"'`]*["'`]/.test(content)) {
      throw new Error("mode tidak ditemukan di config.js");
    }
    content = content.replace(
      /mode:\s*["'`][^"'`]*["'`]/,
      `mode: "${mode}"`
    );
    writeFileSync(CONFIG_PATH, content, "utf-8");
    return true;
  } catch (err) {
    console.error("[utils] Gagal auto-save mode config.js:", err.message);
    return false;
  }
}

export function parseCommand(text = "") {
  if (!text.startsWith(PREFIX)) return null;
  const body = text.slice(PREFIX.length);
  const [cmd, ...rest] = body.split(" ");
  return { cmd: (cmd || "").toLowerCase(), args: rest.join(" ") };
}
