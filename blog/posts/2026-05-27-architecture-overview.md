---
title: "The Architecture of Blocky Editor"
date: "2026-05-27"
author: "Me"
tags: ["engineering", "architecture", "crdt", "ai"]
status: "draft"
---

# Introduction

I wanted Blocky Editor to feel fast while supporting real-time collaboration and local persistence. I also wanted to integrate AI directly into the editing experience.

# Context

I needed an editor that works fast and feels snappy, but that could still sync peer-to-peer and save files locally.

# The Solution / Decisions Made

I split the system into five separate agents, each handling a specific piece of the app.

The Editor Agent uses `@blocknote/react` and `@blocknote/mantine` to provide the core block-based editing interface. This setup let me build a custom AI sidebar and an Explorer shell around it.

The CRDT Agent uses `yjs` to manage state without relying on a central server. Local changes are saved with `y-indexeddb`, and peer-to-peer syncing happens over `y-webrtc`.

The Persistence Agent runs on Tauri, using `tauri-plugin-fs` and `tauri-plugin-sql` to save binary Yjs updates and Markdown snapshots directly to the local AppData folder.

The Git Sync Agent is written in Rust with `git2-rs`. It handles version control, allowing users to commit and push changes right from the application.

The AI Orchestrator integrates a Gemini provider. Instead of pulling in a heavy SDK, I wrote a native `fetch` implementation to keep the app bundle small.

# Code / Examples

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

# Lessons Learned

Mixing local-first storage with real-time peer-to-peer sync means you have to be really careful about how state initializes, otherwise you end up with race conditions.

# Next Steps

I'm currently working on polishing the AI sidebar interactions and making sure the Git Sync agent can handle merge conflicts without bothering the user.
