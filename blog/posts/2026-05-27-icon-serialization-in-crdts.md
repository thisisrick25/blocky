---
title: "Serializing icons for CRDTs without the headache"
date: "2026-05-27"
author: "Me"
tags: ["engineering", "architecture", "crdt"]
status: "draft"
---

I wanted users to be able to pick their own document icons in Blocky Editor. It sounds simple enough until you realize people want both standard emojis like "📘" and vector icons from libraries like React Icons. I needed a way to store and sync that data that wouldn't break the collaborative state.

Blocky uses `yjs` for everything. When I was looking at how to represent an icon in the state, I had a choice. I could use a nested object to store the library prefix, the icon name, and a hex color, or I could find something flatter.

I ended up skipping the nested object approach. Instead of something like `{ type: "lucide", name: "LuFileText", color: "#ff0000" }`, I went with a delimited string: `"prefix:IconName:color"`.

For example: `"lu:LuFileText:#ff0000"`

This works well because standard emojis and vector icons can live in the same `icon` state key. Since `yjs` handles flat string replacements without any drama, updating an icon color doesn't require parsing or patching a nested map. It keeps the CRDT operations straightforward and helps avoid merge conflicts. Parsing is just a `.split(":")` call. If there isn't a colon, I just treat it as a normal emoji.

This is how the parsing looks in my `DocEmojicon` component:

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

I've learned that keeping the state schema flat is the only way to stay sane with CRDTs. Nested objects are usually where the messiest merge states happen. Using a simple string for metadata like this is a solid way to keep things moving.

I'm going to add more vector libraries to the picker soon. The sync engine is already handled, so adding more options won't change how the data actually moves.
