# Disord bot command with Cloudflare Worker

> A minimal trail/experiment — Discord slash command bot running on a **Cloudflare Worker**.

---

## What this is

A proof-of-concept pairing two things together:

- **Discord Interactions** — a `/agent` slash command that accepts a message from a user
- **Cloudflare Workers** — the entire bot runs serverless at the edge, no server required

When a user runs `/agent message:<text>`, the worker sends a deferred response immediately, calls an LLM in the background via `waitUntil`, then edits the reply with the result.

---

## Stack

| Layer | Tech |
|---|---|
| Runtime | [Cloudflare Workers](https://workers.cloudflare.com/) |
| Router | [Hono](https://hono.dev/) |
| Discord | [discord-interactions](https://github.com/discord/discord-interactions-js) |
| Language | TypeScript |
| Deploy | [Wrangler](https://developers.cloudflare.com/workers/wrangler/) |

---

## Project structure

```
src/
  index.ts                  # Hono app + interaction router
  register-commands.ts      # One-time script to register slash commands
  commands/
    agent.ts                # /agent command handler
  middleware/
    verify-signature.ts     # Discord request signature verification
  services/
    discord.ts              # Discord API helpers
    llm.ts                  # LLM API call
  types/                    # Shared TypeScript types
```

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/<you>/discord-agent-bot
cd discord-agent-bot
yarn install
```

### 2. Set secrets

```bash
wrangler secret put DISCORD_PUBLIC_KEY
wrangler secret put DISCORD_APP_ID
wrangler secret put DISCORD_BOT_TOKEN
wrangler secret put LLM_API_KEY
```

All four come from the [Discord Developer Portal](https://discord.com/developers/applications).

### 3. Register slash commands

```bash
yarn register-commands
```

### 4. Deploy

```bash
yarn deploy
```

Set the deployed Worker URL as the **Interactions Endpoint URL** in your Discord app settings.

---

## Local dev

```bash
yarn dev                            # start wrangler dev on :8787
cloudflared tunnel --url http://localhost:8787   # expose to Discord
```
