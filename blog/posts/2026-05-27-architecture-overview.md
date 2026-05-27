---
title: "The Architecture of Blocky Editor"
date: "2026-05-27"
author: "Me"
tags: ["engineering", "architecture", "crdt", "ai"]
status: "draft"
---

Blocky Editor needed to do three things at once: feel fast, sync peer-to-peer, and save everything locally. Oh, and I wanted AI built into the editing experience from the start, not bolted on later.

# Five agents, one app

I split the system into five agents because trying to jam all of this into a single module was going to be a mess. Each agent owns its domain.

The Editor Agent is the surface layer. It runs on `@blocknote/react` and `@blocknote/mantine`, which gave me a block-based editing interface out of the box. From there I built the custom AI sidebar and the Explorer shell around it.

State management lives in the CRDT Agent, powered by `yjs`. There's no central server in the picture. Local changes persist through `y-indexeddb`, and syncing between peers happens over `y-webrtc`.

For actually writing files to disk, the Persistence Agent handles that through Tauri. It uses `tauri-plugin-fs` and `tauri-plugin-sql` to save binary Yjs updates and Markdown snapshots straight to AppData. No cloud middleman.

Version control is the Git Sync Agent, written in Rust with `git2-rs`. Users can commit and push from inside the app. The Rust side keeps it fast and keeps the JS bundle clean.

Then there's the AI Orchestrator, which talks to a Gemini provider. I wrote the HTTP client with native `fetch` instead of pulling in a heavy SDK. The bundle size thanked me for that one.

```typescript
// Example of how I initialize the Editor with Yjs
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";

const doc = new Y.Doc();
// Sync locally
const indexeddbProvider = new IndexeddbPersistence("blocky-room", doc);
// Sync peers
const webrtcProvider = new WebrtcProvider("blocky-room", doc);
```

# Where things get tricky

Mixing local-first storage with real-time P2P sync means state initialization is a minefield. If the IndexedDB provider and the WebRTC provider race each other on startup, you get duplicate blocks or lost changes. Getting the initialization order right took more debugging than I'd like to admit.

# What's next

Right now I'm fixing the AI sidebar's context passing so it actually sends the right block content to the model, and I'm making the Git Sync agent surface merge conflicts in a way that doesn't dump raw conflict markers into the document.
