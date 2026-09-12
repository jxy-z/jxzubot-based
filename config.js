import chalk from "chalk";

const config = {
  //api dari https://my.telegram.org > API Development Tools
  apiId: 123,
  apiHash: "abcd", 
  
  //id telegram buat owners 
  ownerIds: [
    12333,
  ], 
  
  //prefix 
  prefix: "/",

  //mode akses bot: "self" = hanya owner, "public" = semua pengguna
  mode: "self",

  //delay pengiriman broadcast 
  broadcastDelayMs: 800,
  
  //info bot 
  botname: "jxz-ubot",
  versi: "1.0.0",
};

if (!config.apiId || !config.apiHash) {
  console.log(chalk.red.bold("[ ! ] apiId / apiHash di config.js belum diisi dengan nilai asli."));
  console.log(chalk.red.bold("Ambil dari https://my.telegram.org -> API Development Tools"));
  process.exit(1);
}

export default config;