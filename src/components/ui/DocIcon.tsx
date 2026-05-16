import React from "react";
import { icons } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocIconProps {
  icon: string;
  className?: string;
}

export function DocIcon({ icon, className }: DocIconProps) {
  if (!icon) return null;

  if (icon.startsWith("lucide:")) {
    const parts = icon.split(":");
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
  return <span className={className}>{icon}</span>;
}
