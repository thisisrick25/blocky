"use client";

import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AiSidebar } from "@/components/ai/AiSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { useState, useRef } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { IconPicker } from "@/components/ui/icon-picker/IconPicker";
import { SmilePlus, Image as ImageIcon, MessageSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

export default function Home() {
  const [aiContext, setAiContext] = useState<string | null>(null);
  const editorRef = useRef<BlockNoteEditor | null>(null);
  const [docEmoji, setDocEmoji] = useState("");
  const [docTitle, setDocTitle] = useState("");

  const handleInsertBlocks = (blocks: any[]) => {
    if (editorRef.current) {
      editorRef.current.insertBlocks(
        blocks,
        editorRef.current.getTextCursorPosition().block,
        "after"
      );
    }
  };

  return (
    <>
      <AppSidebar docEmoji={docEmoji || "📄"} docTitle={docTitle} />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-white">
        <header className="flex h-11 items-center gap-4 bg-white px-8 mt-2 sticky top-0 z-10">
          <div className="flex-1">
            <h2 className="text-sm font-medium text-[#37352f]/50 hover:text-[#37352f] transition-colors cursor-pointer w-fit">
              {docTitle || "New Page"}
            </h2>
          </div>
          <div className="flex items-center gap-2 px-2 py-0.5" title="Saved locally">
            <div className="w-1.5 h-1.5 rounded-full bg-[#05a357]/80" />
            <span className="text-[11px] text-[#37352f]/40 font-medium">Synced</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-white flex flex-col group/page">
          {/* Document Header Area (Title & Icon) */}
          <div className="w-full max-w-[800px] mx-auto px-4 sm:px-24 pt-16 pb-4">

            {/* Action Buttons (visible on hover) */}
            <div className="flex items-center gap-4 mb-4 opacity-0 group-hover/page:opacity-100 transition-opacity duration-200">
              {!docEmoji && (
                <IconPicker onChange={setDocEmoji}>
                  <button className="flex items-center gap-1.5 text-sm text-[#37352f]/50 hover:text-[#37352f]/80 hover:bg-[#efefed] px-2 py-1 rounded-[4px] transition-colors outline-none cursor-pointer">
                    <SmilePlus className="w-4 h-4" />
                    <span>Add icon</span>
                  </button>
                </IconPicker>
              )}

              <button className="flex items-center gap-1.5 text-sm text-[#37352f]/50 hover:text-[#37352f]/80 hover:bg-[#efefed] px-2 py-1 rounded-[4px] transition-colors outline-none cursor-pointer">
                <ImageIcon className="w-4 h-4" />
                <span>Add cover</span>
              </button>

              <button className="flex items-center gap-1.5 text-sm text-[#37352f]/50 hover:text-[#37352f]/80 hover:bg-[#efefed] px-2 py-1 rounded-[4px] transition-colors outline-none cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                <span>Add comment</span>
              </button>
            </div>
            {/* Emoji Icon */}
            {docEmoji && (
              <IconPicker
                icon={docEmoji}
                onChange={setDocEmoji}
                onRemove={() => setDocEmoji("")}
              >
                <div className="text-[78px] leading-none mb-6 hover:bg-[#efefed] rounded-lg transition-colors p-2 -ml-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#37352f]/20 w-fit">
                  {docEmoji}
                </div>
              </IconPicker>
            )}
            <h1
              className="text-[40px] font-bold text-[#37352f] leading-tight outline-none empty:before:content-['Untitled'] empty:before:text-[#37352f]/20 cursor-text"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setDocTitle(e.currentTarget.textContent || "")}
            >
              {/* Empty initial state lets the placeholder show, or you could seed it with "Getting Started" */}
            </h1>
          </div>
          <Editor
            onAskAi={(ctx) => setAiContext(ctx)}
            onEditorReady={(editor) => { editorRef.current = editor; }}
          />
        </div>
      </SidebarInset >
      <AiSidebar
        initialContext={aiContext}
        onContextClear={() => setAiContext(null)}
        onInsertBlocks={handleInsertBlocks}
      />
    </>
  );
}
