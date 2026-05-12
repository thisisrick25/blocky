# System Agents - Blocky Editor (Implementation Status)

This document reflects the current state of the logical agents in the Blocky Editor.

## 1. The Editor Agent (UI/UX)
- **Status:** **Implemented** using `@blocknote/react` and `@blocknote/mantine`.
- **Customization:** Integrated with a custom AI sidebar and document Explorer shell.

## 2. The CRDT Agent (State & History)
- **Status:** **Implemented** using `yjs`.
- **Collaboration:** Real-time P2P sync via `y-webrtc`.
- **Local Persistence:** Local browser persistence via `y-indexeddb`.

## 3. The Persistence Agent (Local Storage)
- **Status:** **Implemented** using `tauri-plugin-fs` and `tauri-plugin-sql`.
- **Auto-Save:** Saves binary Yjs updates and Markdown snapshots to `BaseDirectory.AppData`.

## 4. The Git Sync Agent (Version Control)
- **Status:** **Core Implemented** in Rust (`git2-rs`).
- **Features:** Supports `git_init`, `git_commit` (with author attribution), and `git_push` (using local SSH agent).

## 5. The AI Orchestrator (Intelligence)
- **Status:** **Implemented** with a custom Gemini provider.
- **Client:** Native `fetch` implementation to keep the bundle lightweight.
- **Integration:** Slash command in the editor triggers the AI sidebar with block context.

## 6. The Collaboration Agent (P2P)
- **Status:** **Implemented** via `y-webrtc`.
- **Signaling:** Uses public Yjs signaling servers by default.
