"use client";

import * as Y from "yjs";
import { 
  useCreateBlockNote, 
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import { useState, useEffect, useCallback } from "react";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";
import { Sparkles } from "lucide-react";

export function useYjsEditor(onAskAi?: (context: string) => void, roomId: string = "getting-started-room") {
  const [doc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<WebrtcProvider | null>(null);

  useEffect(() => {
    const indexeddbProvider = new IndexeddbPersistence(roomId, doc);
    const webrtcProvider = new WebrtcProvider(roomId, doc, {
      signaling: ["wss://signaling.yjs.dev"],
    });

    setProvider(webrtcProvider);

    return () => {
      webrtcProvider.destroy();
      indexeddbProvider.destroy();
    };
  }, [doc, roomId]);

  const editor = useCreateBlockNote({
    collaboration: {
      fragment: doc.getXmlFragment("blocknote"),
      user: {
        name: "User " + Math.floor(Math.random() * 100),
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      },
    },
    initialContent: [
      {
        type: "paragraph",
        content: "👋 Welcome to Notion!",
      },
      {
        type: "paragraph",
        content: "",
      },
      {
        type: "paragraph",
        content: "Here are the basics:",
      },
      {
        type: "checkListItem",
        content: "Click anywhere and just start typing",
      },
      {
        type: "checkListItem",
        content: "Hit / to see all the types of content you can add - headers, videos, sub pages, etc.",
      },
      {
        type: "checkListItem",
        content: [
          { type: "text", text: "Highlight any text, and use the menu that pops up to style ", styles: {} },
          { type: "text", text: "your", styles: { italic: true } },
          { type: "text", text: " writing ", styles: {} },
          { type: "text", text: "however", styles: { textColor: "red", backgroundColor: "gray" } }, 
          { type: "text", text: " you ", styles: {} },
          { type: "text", text: "like", styles: { bold: true } }
        ],
      },
      {
        type: "checkListItem",
        content: "See the ⋮⋮ to the left of this checkbox on hover? Click and drag to move this line",
      },
      {
        type: "checkListItem",
        content: [
          { type: "text", text: "Click + ", styles: {} },
          { type: "text", text: "New page", styles: { bold: true } },
          { type: "text", text: " at the top of your sidebar to add a new page", styles: {} }
        ]
      },
      {
        type: "checkListItem",
        content: [
          { type: "text", text: "Click ", styles: {} },
          { type: "text", text: "Calendar", styles: { bold: true } },
          { type: "text", text: " in your sidebar to manage your time and work together. Notion’s calendar is fully integrated and synced with all your Google Calendar events!", styles: {} }
        ]
      },
      {
        type: "checkListItem",
        content: [
          { type: "text", text: "Highlight ", styles: {} },
          { type: "text", text: "Alan Kay", styles: { bold: true } },
          { type: "text", text: "’s name and ask AI to explain who Notion’s favorite scientist is", styles: {} }
        ]
      },
      {
        type: "checkListItem",
        content: [
          { type: "text", text: "Click ", styles: {} },
          { type: "text", text: "Templates", styles: { bold: true } },
          { type: "text", text: " in your sidebar to get started with pre-built pages", styles: {} }
        ]
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "▶ This is a toggle block. Click the little triangle to see a few useful links!", styles: {} }
        ]
      },
    ],
  });

  // Custom Slash Menu Item
  const insertAiCommand = {
    title: "Ask AI",
    onItemClick: () => {
      if (onAskAi) {
        // Get the current block content as context
        const block = editor.getTextCursorPosition().block;
        onAskAi(JSON.stringify(block));
      }
    },
    aliases: ["ai", "gpt", "sparkles"],
    group: "AI",
    icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    subtext: "Ask the AI assistant about this block.",
  };

  const getMarkdown = useCallback(async () => {
    return await editor.blocksToMarkdownLossy(editor.document);
  }, [editor]);

  const getYjsUpdate = useCallback(() => {
    return Y.encodeStateAsUpdate(doc);
  }, [doc]);

  return { 
    editor, 
    doc, 
    provider, 
    getMarkdown, 
    getYjsUpdate,
    slashMenuItems: [...getDefaultReactSlashMenuItems(editor), insertAiCommand]
  };
}
