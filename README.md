# jxz-bot

Base bot, user bot Telegram (using [GramJS](https://github.com/gram-js/gramjs))

<p align="left">
  <img src="https://img.shields.io/badge/runtime-NodeJS-339933?style=flat-square&logo=node.js&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/library-GramJS-2CA5E0?style=flat-square&logo=telegram&logoColor=white" alt="GramJS" />
  <img src="https://img.shields.io/badge/plugins-ESM-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="ESM" />
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version" />
</p>

---

## 📌 Info

- Plugins **ESM** (ECMAScript Module)
- Runtime **NodeJS**
- Library **GramJS**
- Version **1.0.0**

## ✨ Fitur

- Auto reload plugins
- Handler owner
- Desain tipis-tipis di console.log
- Simpel & mudah dikembangkan
- No enc 100%

## 📂 Struktur Script

```
jxz-bot/
├── config.js
├── index.js
├── lib/
│   ├── plugins.js
│   └── utils.js
└── plugins/
    ├── public.js
    ├── self.js
    ├── menu.js
    ├── ping.js
    └── broadcast.js
```

## ⚙️ Setup

### 1. Install dependency

```bash
npm start
```

### 2. Ambil API

Buka [my.telegram.org](https://my.telegram.org) → login → **API Development Tools** → copy `api_id` & `api_hash`.

### 3. Isi `config.js`

Buka file `config.js`, isi:

```js
apiId: 1234567,          // ganti dengan api_id kamu
apiHash: "abcdef...",    // ganti dengan api_hash kamu
ownerIds: [123456789],   // user ID Telegram kamu
```

### 4. Use

1. Input nomor telegram **(wajib aktif & bisa mendapatkan notifikasi)**, ketik di terminal (format `628xxxxxxxxxx`), lalu Enter.
2. Input OTP, **cek di aplikasi Telegram**, ketik kode itu di terminal lalu Enter.
3. Jika **2FA (Two-Step Verification)** aktif, terminal akan minta password 2FA juga, bila tidak ada, tinggal Enter kosong.
4. Done, nanti kode session bakal ke-generate otomatis dan masuk di sessions.

## 🧩 Create New Plugins

Buat file `.js` baru di folder `plugins/`, formatnya:

```js
export default {
  name: "namacommand",
  aliases: ["alias1", "alias2"], // opsional
  description: "Deskripsi command",
  owner: true, // true = command only owner & false = command bisa dipakai all user

  async run(client, event, parsed) {
    // parsed = { cmd, args }
    const msg = event.message;
    await msg.reply({ message: "Halo!" });
  },
};
```

## 📜 Command

| Command | Deskripsi |
|---|---|
| `/bc` (broadcast) | Kirim pesan masal ke semua grup |
| `/menu` (help) | Menampilkan daftar command bot |
| `/ping` (p) | Cek kecepatan respon bot |
| `/public` | Ubah mode bot to "public" (all pengguna bisa pake) |
| `/self` | Ubah mode bot to "self" (hanya owner yang bisa pake bot) |

## ⚠️ Tips

Gunakan user bot ini sewajarnya aja, resiko bisa ke ban/mute akun mu, resiko user yang tanggung.

Enjoy kembangin :>

> Btw credit/creator jangan di hapus bang.
> Jangan diperjualbelikan.

---

**📞 Creator:** [@jarroffc2](https://t.me/jarroffc2)
**📢 Channel:** [WhatsApp Channel](https://whatsapp.com/channel/0029VbBoflt4dTnNWXV4zC09)
