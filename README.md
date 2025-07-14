# Flatfile Listener

This is a Flatfile listener that uses the core patterns for building event-driven data import workflows. Listeners are the foundation of Flatfile's architecture—they respond to events throughout the data import lifecycle and enable all the powerful functionality in your Flatfile implementation.

## Getting Started

First install the dependencies. We like to use [bun](https://bun.sh) for this:

```bash
bun install
```

Then copy the `.env.example` file to `.env` and add your Flatfile API key and environment ID:

```bash
cp .env.example .env
```

Now go to `src/index.ts` and replace `https://webhook.site/...` with your own webhook url. You can use [webhook.site](https://webhook.site) for this.

Finally, run the listener in development mode:

```bash
bun run dev
```

## Available Commands

```bash
bun run dev # starts the listener in development mode
bun run deploy # deploys the listener to Flatfile
bun run list # lists all listeners
bun run delete # deletes the listener
bun run check # checks the code for errors
bun run fix # fixes the code for errors
```
