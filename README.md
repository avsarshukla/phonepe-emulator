<h1 align="center">PhonePe Experience Emulator</h1>

<p align="center">
  <em>A faithful, installable PWA recreation of the PhonePe UPI payment flow — for UI/UX demos, prototyping, and screenshots.</em>
</p>

<p align="center">
  <a href="https://YOUR_USERNAME.github.io/phonepe-emulator/"><img alt="Live demo" src="https://img.shields.io/badge/live-demo-5f259f?style=for-the-badge&logo=pwa&logoColor=white"></a>
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

> ⚠️ **This is a UI/UX emulator.** No real UPI transactions happen. No money moves. No bank is contacted. Do not use it to deceive anyone.

---

## Try it

### On Android (installable)

1. Open **[https://YOUR_USERNAME.github.io/phonepe-emulator/](https://YOUR_USERNAME.github.io/phonepe-emulator/)** in Chrome.
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
