/**
 * One-time script to register slash commands with Discord.
 *
 * Usage:
 *   DISCORD_APP_ID=xxx DISCORD_BOT_TOKEN=xxx npx tsx src/register-commands.ts
 *
 * Optional: Set DISCORD_GUILD_ID for instant guild-specific registration (testing).
 *   DISCORD_APP_ID=xxx DISCORD_BOT_TOKEN=xxx DISCORD_GUILD_ID=xxx npx tsx src/register-commands.ts
 */

const APP_ID = process.env.DISCORD_APP_ID;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID; // optional

if (!APP_ID || !BOT_TOKEN) {
  console.error('Missing DISCORD_APP_ID or DISCORD_BOT_TOKEN environment variables.');
  process.exit(1);
}

interface SlashCommand {
  name: string;
  description: string;
  type: number;
  options?: {
    name: string;
    description: string;
    type: number;
    required?: boolean;
  }[];
}

const commands: SlashCommand[] = [
  {
    name: 'agent',
    description: 'Talk to the AI agent',
    type: 1, // CHAT_INPUT
    options: [
      {
        name: 'message',
        description: 'What to ask the agent',
        type: 3, // STRING
        required: true,
      },
    ],
  },
];

// Guild-specific = instant propagation (good for testing)
// Global = takes up to 1 hour to propagate
const url = GUILD_ID
  ? `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`
  : `https://discord.com/api/v10/applications/${APP_ID}/commands`;

async function main() {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${BOT_TOKEN}`,
    },
    body: JSON.stringify(commands),
  });

  const data = (await response.json()) as any[];

  if (response.ok) {
    console.log(`✅ Registered ${data.length} command(s) successfully.`);
    data.forEach((cmd) => console.log(`   /${cmd.name} — ${cmd.description}`));
  } else {
    console.error('❌ Failed to register commands:', JSON.stringify(data, null, 2));
  }
}

main().catch((err) => {
  console.error('Error registering commands:', err);
  process.exit(1);
});