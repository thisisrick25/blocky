import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DocEmojicon } from "./DocEmojicon";

describe("DocEmojicon", () => {
    it("returns null when emojicon is empty", () => {
        const { container } = render(<DocEmojicon emojicon="" />);
        expect(container.firstChild).toBeNull();
    });

    it("renders a lucide icon from react-icons with optional color", () => {
        const { container } = render(
            <DocEmojicon emojicon="lu:LuFileText:#ff0000" className="icon-class" />,
        );

        const icon = container.querySelector("svg");

        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass("icon-class");
        expect(icon).toHaveStyle({ color: "#ff0000" });
    });

    it("renders icons without color from other libraries (pi, ri)", () => {
        const { container } = render(
            <DocEmojicon emojicon="pi:PiAddressBook" className="icon-class" />,
        );

        const icon = container.querySelector("svg");
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass("icon-class");
        expect(icon).not.toHaveStyle({ color: expect.anything() });
    });

    it.each(["xx:LuFileText", "lu:NotARealIcon"])(
        "falls back to the default icon for %s",
        (emojicon) => {
            const { container } = render(<DocEmojicon emojicon={emojicon} />);

            const icon = container.querySelector("svg");

            expect(icon).toBeInTheDocument();
            expect(container.querySelector("span")).not.toBeInTheDocument();
        },
    );

    it("renders plain emoji text when no prefix is present", () => {
        render(<DocEmojicon emojicon="📘" className="emoji-class" />);

        const emoji = screen.getByText("📘");

        expect(emoji).toBeInTheDocument();
        expect(emoji).toHaveClass("emoji-class");
    });
});