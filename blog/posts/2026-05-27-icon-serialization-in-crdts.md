---
title: "Elegantly Serializing Icons for CRDTs"
date: "2026-05-27"
author: "Me"
tags: ["engineering", "architecture", "crdt"]
status: "draft"
---

# Introduction

I wanted users to be able to customize their document icons in Blocky Editor using either standard plain text emojis (like "📘") or vector icons from libraries like React Icons. This meant I had to figure out how to store and sync that data effectively.

# Context

Blocky Editor uses `yjs` for collaborative state and local storage. When deciding how to represent an icon in the state schema, I had to choose a format that could handle both a simple unicode character and a vector icon that needs a library prefix, an icon name, and a hex color.

# The Solution / Decisions Made

Instead of a nested object like `{ type: "lucide", name: "LuFileText", color: "#ff0000" }`, I went with a delimited string format: `"prefix:IconName:color"`.

For example: `"lu:LuFileText:#ff0000"`

This approach solves a few problems. First, standard unicode emojis and vector icons can share the exact same `icon` state key. Second, `yjs` handles flat string replacements easily. If a user updates an icon's color, the system doesn't have to parse and patch a nested map. This keeps the CRDT operations simple and cuts down on merge conflicts. Finally, parsing the icon is just a matter of calling `.split(":")`. If there isn't a colon, the system treats it as a standard unicode emoji.

# Code / Examples

This is the parsing logic in my `DocEmojicon` component:

```tsx
export function DocEmojicon({
  emojicon,
  className,
}: {
  emojicon: string;
  className?: string;
}) {
  if (!emojicon) return null;

  // Parse and render the vector icon if we find our delimited format
  const parts = emojicon.split(":");
  if (parts.length >= 2) {
    const [prefix, iconName, color] = parts;
    const IconComponent = getIconFromLibrary(prefix, iconName);

    return (
      <IconComponent
        style={color ? { color } : undefined}
        className={className}
      />
    );
  }

  // Treat as plain text emoji
  return <span className={className}>{emojicon}</span>;
}
```

# Lessons Learned

Keeping the state schema as flat as possible is critical when working with CRDTs. Nested objects often create messy merge states. Using a simple string serialization for metadata like icons turned out to be a reliable hack for avoiding those issues.

# Next Steps

I plan to add more vector libraries to the icon picker so users have more options, without complicating the sync engine.
