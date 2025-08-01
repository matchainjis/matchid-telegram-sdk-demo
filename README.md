# matchid-telegram-sdk-demo
MatchID Telegram SDK Demo

A working demo Telegram Mini App integrating the [MatchID Telegram SDK](https://docs.matchid.ai/migrate/telegramMiniApp.html) for secure, user-friendly authentication via MatchID.

This app demonstrates:

- Initiating login flow via Telegram
- Launching the MatchID Auth Mini App
- Polling for login confirmation
- Fetching MatchID user details
- React + Redux state persistence integration
- Custom toast + loading animations inside Telegram Mini App

---

## 🚀 Quick Start

- Set up your .env file properly
- Focus on [LoginScreen.tsx](https://github.com/matchainjis/matchid-telegram-sdk-demo/blob/main/src/pages/LoginScreen.tsx) for understanding the whole logic and sequence if events

```bash
git clone git@github.com:matchainjis/matchid-telegram-sdk-demo.git
cd matchid-telegram-sdk-demo
yarn install
yarn dev
