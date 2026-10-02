<h1 align="center">PhonePe Experience Emulator</h1>

<p align="center">
  <em>A faithful, installable PWA recreation of the PhonePe UPI payment flow — for UI/UX demos, prototyping, and screenshots.</em>
</p>

<p align="center">
  <a href="https://avsarshukla.github.io/phonepe-emulator/"><img alt="Live Demo" src="https://img.shields.io/badge/Live-Demo-5f259f?style=for-the-badge&logo=pwa&logoColor=white"></a>
  <img alt="No Real Money" src="https://img.shields.io/badge/No-Real-Money-00875a?style=for-the-badge">
  <img alt="Svelte 5" src="https://img.shields.io/badge/Svelte-5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white">
  <img alt="Vite 5" src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="Tailwind CSS v4" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img alt="PWA Installable" src="https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=googlechrome&logoColor=white">
</p>

---

## What is this?

A pixel-faithful **PhonePe UPI flow emulator** that runs as an installable Progressive Web App (PWA). Enter a UPI ID, amount, and PIN to experience the standard PhonePe sequence:

- **Home dashboard** with balance card and quick actions
- **Recipient form** with UPI ID auto-name derivation
- **Custom amount keypad** (no OS keyboard)
- **6-digit MPIN overlay** with animated dots
- **2-second processing screen** with spinner
- **Green success screen** with checkmark, transaction ID, and reward banner
- **Success chime** played through the speaker
- **Full transfer details** view (UTR, masked account, message)
- **Auto-expiring transaction history** (5-minute TTL via `sessionStorage`)

> **Disclaimer:** No real UPI transactions occur, no money is moved, and no banking infrastructure is contacted.

---

## Try it

- **Live Demo:** [https://avsarshukla.github.io/phonepe-emulator/](https://avsarshukla.github.io/phonepe-emulator/)

### On Android (PWA Installation)
1. Open the [Live Demo](https://avsarshukla.github.io/phonepe-emulator/) in Chrome.
2. Wait for the **"Add PhonePe to Home screen"** prompt.
3. Tap **Install**.
4. Launch from your home screen for fullscreen mobile playback.

### On Desktop
1. Open the [Live Demo](https://avsarshukla.github.io/phonepe-emulator/) in any modern browser.
2. Best viewed via **Chrome DevTools → Device Toolbar** set to a mobile aspect ratio (e.g., Pixel or iPhone).

---

## Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | Svelte 5 (Runes) | Minimal runtime (~15 KB), hyper-responsive UI state |
| **Bundler** | Vite 5 | Instant HMR, fast builds, optimized bundle output |
| **Styling** | Tailwind CSS v4 | Utility-first styling with exact PhonePe brand colors |
| **State** | Svelte Runes + `sessionStorage` | Local-first state management, auto-purges on session end |
| **PWA** | `vite-plugin-pwa` + Workbox | Web App Manifest, offline Service Worker, install prompts |
| **Audio** | HTML5 `Audio()` | Low-latency audio chime playback |
| **Deployment** | GitHub Pages + Actions | Automated CI/CD deployment pipeline |

**Production Bundle Size:** ~25 KB gzipped.

---

## Project Structure
