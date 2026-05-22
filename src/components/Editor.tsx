"use client";

import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useYjsEditor } from "@/hooks/useYjsEditor";
import { useAutoSync } from "@/hooks/useAutoSync";
import { useEffect, useState } from "react";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { SuggestionMenuController } from "@blocknote/react";

interface EditorProps {
  onAskAi?: (context: string) => void;
  onEditorReady?: (editor: BlockNoteEditor) => void;
}

export default function Editor({ onAskAi, onEditorReady }: EditorProps) {
  const { editor, getMarkdown, getYjsUpdate, slashMenuItems } =
    useYjsEditor(onAskAi);
  const [isTauri, setIsTauri] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__) {
      setIsTauri(true);
    }

    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  useAutoSync(getMarkdown, getYjsUpdate, isTauri);

  return (
    <div
      className="flex flex-col items-center min-h-full pb-8 md:pb-16 pt-0 px-8 md:px-24 bg-white cursor-text"
      onClick={() => editor?.focus()}
    >
      <div className="w-full max-w-[900px] pb-[30vh]">
        {/* We use a wrapper to ensure BlockNote perfectly matches the global styles */}
        <div className="prose-notion">
          <BlockNoteView editor={editor} theme="light" slashMenu={false}>
            <SuggestionMenuController
              triggerCharacter={"/"}
              getItems={async (query) =>
                filterSuggestionItems(slashMenuItems, query)
              }
            />
          </BlockNoteView>
        </div>
      </div>
    </div>
  );
}
