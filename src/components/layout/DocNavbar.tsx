import React from "react";
import { DocEmojicon } from "@/components/ui/DocEmojicon";

interface DocNavbarProps {
    docTitle: string;
    emojicon?: string;
}

export function DocNavbar({ docTitle, emojicon }: DocNavbarProps) {
    return (
        <header className="flex h-11 items-center gap-4 bg-white px-8 mt-2 sticky top-0 z-10">
            <div className="flex-1">
                <h2 className="flex items-center gap-2 text-sm font-medium text-[#37352f]/50 hover:text-[#37352f] transition-colors cursor-pointer w-fit">
                    {emojicon && (
                        <div className="w-4 h-4 flex items-center justify-center">
                            <DocEmojicon emojicon={emojicon} className="w-full h-full" />
                        </div>
                    )}
                    <span>{docTitle || "Untitled"}</span>
                </h2>
            </div>
            <div
                className="flex items-center gap-2 px-2 py-0.5"
                title="Saved locally"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-[#05a357]/80" />
                <span className="text-[11px] text-[#37352f]/40 font-medium">
                    Synced
                </span>
            </div>
        </header>
    );
}
