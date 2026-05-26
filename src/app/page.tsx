"use client";

import dynamic from "next/dynamic";
import React, { useState, useRef } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";

import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AiSidebar } from "@/components/ai/AiSidebar";
import { DocNavbar } from "@/components/layout/DocNavbar";
import { DocHeader } from "@/components/document/DocHeader";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

export default function Home() {
  const [aiContext, setAiContext] = useState<string | null>(null);
  const editorRef = useRef<BlockNoteEditor | null>(null);
  const [emojicon, setEmojicon] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [isEmojiconPickerOpen, setIsEmojiconPickerOpen] = useState(false);

  const handleInsertBlocks = (blocks: PartialBlock[]) => {
    if (editorRef.current) {
      editorRef.current.insertBlocks(
        blocks,
        editorRef.current.getTextCursorPosition().block,
        "after",
      );
    }
  };

  return (
    <>
      <AppSidebar emojicon={emojicon || "lu:LuFileText"} docTitle={docTitle} />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-white">
        <DocNavbar docTitle={docTitle} emojicon={emojicon || "lu:LuFileText"} />
        <div className="flex-1 overflow-auto bg-white flex flex-col group/page">
          <DocHeader
            docTitle={docTitle}
            setDocTitle={setDocTitle}
            emojicon={emojicon}
            setEmojicon={setEmojicon}
            isEmojiconPickerOpen={isEmojiconPickerOpen}
            setIsEmojiconPickerOpen={setIsEmojiconPickerOpen}
          />
          <Editor
            onAskAi={(ctx) => setAiContext(ctx)}
            onEditorReady={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>
      </SidebarInset>
      <AiSidebar
        initialContext={aiContext}
        onContextClear={() => setAiContext(null)}
        onInsertBlocks={handleInsertBlocks}
      />
    </>
  );
}
