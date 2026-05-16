import React from "react";
import { icons } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocEmojiconProps {
  emojicon: string;
  className?: string;
}

export function DocEmojicon({ emojicon, className }: DocEmojiconProps) {
  if (!emojicon) return null;

  if (emojicon.startsWith("lucide:")) {
    const parts = emojicon.split(":");
    const iconName = parts[1];
    const color = parts[2]; // May be undefined
    
    const IconComponent = icons[iconName as keyof typeof icons];
    
    if (IconComponent) {
      return (
        <IconComponent 
          className={cn("w-full h-full transition-colors duration-300", className)} 
          style={color ? { color } : undefined}
        />
      );
    }
    
    // Fallback if icon not found
    return <span className={className}>📄</span>;
  }

  // Treat as emoji
  return <span className={className}>{emojicon}</span>;
}
