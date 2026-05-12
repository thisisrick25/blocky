"use client";

import { useEffect, useRef } from "react";
import { commitChanges } from "@/lib/persistence/git";
import { BaseDirectory, writeTextFile, writeFile, mkdir } from "@tauri-apps/plugin-fs";

export function useAutoSync(
  getMarkdown: () => Promise<string>,
  getYjsUpdate: () => Uint8Array,
  isEnabled: boolean = true
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sync = async () => {
    try {
      const markdown = await getMarkdown();
      const binary = getYjsUpdate();
      
      const docName = "my-document";
      
      await mkdir("documents", { baseDir: BaseDirectory.AppData, recursive: true });

      await writeTextFile(`documents/${docName}.md`, markdown, { baseDir: BaseDirectory.AppData });
      await writeFile(`documents/${docName}.yjs`, binary, { baseDir: BaseDirectory.AppData });

      console.log("Auto-sync: Saved Markdown and Binary to AppData");
      
    } catch (e) {
      console.error("Auto-sync error:", e);
    }
  };

  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(sync, 60000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearInterval(interval);
    };
  }, [isEnabled, getMarkdown, getYjsUpdate]);
}
