import React from "react";

interface DocHeaderButtonProps {
    icon: React.ElementType;
    children: React.ReactNode;
    onClick?: () => void;
}

export function DocHeaderButton({
    icon: Icon,
    children,
    onClick,
}: DocHeaderButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 text-sm text-[#37352f]/50 hover:text-[#37352f]/80 hover:bg-[#efefed] px-2 py-1 rounded-[4px] transition-colors outline-none cursor-pointer"
        >
            <Icon className="w-4 h-4" />
            <span>{children}</span>
        </button>
    );
}
