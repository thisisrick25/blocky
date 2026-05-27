import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
    },
    resolve: {
        alias: {
            "@": path.resolve(root, "src"),
        },
    },
});