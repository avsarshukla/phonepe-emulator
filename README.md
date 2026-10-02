<h1 align="center">PhonePe Experience Emulator</h1>

<p align="center">
  <em>A faithful, installable PWA recreation of the PhonePe UPI payment flow — for UI/UX demos, prototyping, and screenshots.</em>
</p>

<p align="center">
  <a href="https://avsarshukla.github.io/phonepe-emulator/"><img alt="Live demo" src="https://img.shields.io/badge/live-demo-5f259f?style=for-the-badge&logo=pwa&logoColor=white"></a>
  <img alt="No real money" src="https://img.shields.io/badge/no-real-money-00875a?style=for-the-badge">
  <img alt="Svelte 5" src="https://img.shields.io/badge/Svelte-5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="Tailwind v4" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img alt="PWA" src="https://img.shields.io/badge/PWA-installable-5A0FC8?style=for-the-badge&logo=googlechrome&logoColor=white">
</p>

---

## What is this?

A pixel-faithful **PhonePe UPI flow emulator** that runs as an installable Progressive Web App on Android. Enter a UPI ID, amount, and PIN — see the classic purple-to-green PhonePe sequence play out exactly as it does on the real app, complete with:

- 🟣 **Home dashboard** with balance card and quick actions
- 💳 **Recipient form** with UPI ID auto-name derivation
- 🔢 **Custom amount keypad** (no OS keyboard)
- 🔐 **6-digit MPIN overlay** with animated dots
- ⏳ **2-second processing screen** with spinner
- ✅ **Green success screen** with checkmark, transaction ID, and reward banner
- 🔊 **Success chime** played through the phone speaker
- 🧾 **Full transfer details** view (UTR, masked account, message)
- 📜 **Auto-expiring transaction history** (5-minute TTL via sessionStorage)

> ⚠ **This is a UI/UX emulator.** No real UPI transactions happen. No money moves. No bank is contacted. Do not use it to deceive anyone.

---

## Try it

### On Android (installable)

1. Open **[https://avsarshukla.github.io/phonepe-emulator/](https://avsarshukla.github.io/phonepe-emulator/)** in Chrome.
2. Wait ~5 seconds for the **"Add PhonePe to Home screen"** prompt.
3. Tap **Install**.
4. Launch from your home screen — it opens fullscreen, no browser bar.

### On desktop

Same URL, any modern browser. Best viewed in **Chrome DevTools → Device Toolbar → iPhone/Pixel** for the intended aspect ratio.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Svelte 5** (runes) | Minimal runtime (~15 KB), hyper-responsive on mobile |
| Bundler | **Vite 5** | Instant HMR, tiny prod output |
| Styling | **Tailwind CSS v4** | Exact PhonePe hex colors, tiny CSS output |
| State | Svelte runes + `sessionStorage` | Local-first, auto-purges on tab close |
| PWA | **vite-plugin-pwa** + Workbox | Manifest, offline SW, install prompt |
| Audio | HTML5 `Audio()` | Zero-latency chime from a local MP3 |
| Deploy | GitHub Pages + Actions | Free HTTPS, auto-deploy on push |

**Total production bundle:** ~25 KB gzipped.

---

## Project structure

	phonepe-emulator/
	├── .github/workflows/deploy.yml     # auto-deploy to Pages
	├── public/
	│   ├── manifest.webmanifest
	│   ├── icon-192.png
	│   ├── icon-512.png
	│   └── assets/audio/
	│       └── phonepe_success.mp3      # the chime
	├── src/
	│   ├── App.svelte                   # entire UI + state machine
	│   ├── main.js
	│   ├── app.css
	│   └── lib/
	│       ├── txnId.js                 # PhonePe-format ID generator
	│       └── store.js                 # 5-minute TTL transaction store
	├── index.html
	├── package.json
	├── svelte.config.js
	└── vite.config.js

---

## Run locally

	# Clone
	git clone https://github.com/avsarshukla/phonepe-emulator.git
	cd phonepe-emulator

	# Install
	npm install

	# Dev server
	npm run dev
	# → http://localhost:5173/phonepe-emulator/

	# Production build
	npm run build

	# Preview the production build
	npm run preview

Requires **Node.js 20+**.

---

## How the flow works

	┌──────────────────────┐
	│    Home dashboard    │
	└──────────┬───────────┘
	           │ Tap "To Mobile"
	           ▼
	┌──────────────────────┐
	│   Recipient form     │  UPI ID → auto-derives name
	└──────────┬───────────┘
	           │ Proceed
	           ▼
	┌──────────────────────┐
	│   Amount + keypad    │  Custom keypad, no OS keyboard
	└──────────┬───────────┘
	           │ Proceed To Pay
	           ▼
	┌──────────────────────┐
	│   MPIN overlay       │  6-digit dots, Pay button
	└──────────┬───────────┘
	           │ Enter 6 digits + Pay
	           ▼
	┌──────────────────────┐
	│   Processing (2s)    │  Spinner + audio preload
	└──────────┬───────────┘
	           │ Complete
	           ▼
	┌──────────────────────┐
	│   Green success      │  Checkmark + chime + txn ID
	└──────────┬───────────┘
	           │ View details / Done
	           ▼
	┌──────────────────────┐
	│   Detail / History   │  Auto-purges after 5 min
	└──────────────────────┘

---

## Transaction ID format

Mirrors PhonePe's real format — `T` + UTC timestamp slice + 6 random digits:

	// Example output: T261002153012984710
	function generatePhonePeTxnId() {
	  const prefix = 'T';
	  const dateStr = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(2, 14);
	  const randomDigits = Math.floor(100000 + Math.random() * 900000);
	  return `${prefix}${dateStr}${randomDigits}`;
	}

---

## Cache behaviour

Transactions are stored in `sessionStorage` with a **5-minute TTL**. Every read filters out expired entries. Closing the tab wipes everything. There is **no persistence to disk, no localStorage, no cookies, no server, no analytics**.

This is intentional — nothing you type survives the session.

---

## Customizing

### Change the success sound
Replace `public/assets/audio/phonepe_success.mp3` with your own MP3 (same filename).

### Change the app icon
Replace `public/icon-192.png` and `public/icon-512.png`. Sizes must match exactly.

### Change the TTL
Edit `TTL_MS` in `src/lib/store.js`:

	const TTL_MS = 5 * 60 * 1000;   // 5 minutes

### Change the theme color
Edit `src/app.css`:

	@theme {
	  --color-pp-purple: #5f259f;
	  --color-pp-green:  #00875a;
	}

---

## Deploy your own copy

1. **Fork** this repo.
2. Go to **Settings → Pages → Source** and choose **GitHub Actions**.
3. Wait 90 seconds for the workflow to finish.
4. Your copy is live at `https://avsarshukla.github.io/phonepe-emulator/`.

Any push to `main` triggers a rebuild and redeploy automatically.

---

## Disclaimer

**Not affiliated with, endorsed by, or connected to PhonePe Pvt. Ltd. in any way.**

This project is a UI exercise. All trademarks belong to their respective owners. It is provided for educational and prototyping purposes only. Do not use it to impersonate payments, defraud anyone, or misrepresent a completed transaction. Doing so is illegal and unethical.

---

## License

[MIT](LICENSE) — do what you want, no warranty.

<p align="center"><sub>Built with ☕ and Tailwind utilities.</sub></p>
