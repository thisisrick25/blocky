import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const ICON_COLORS = [
    { name: "Default", color: "#54524d" },
    { name: "Light Gray", color: "#a6a299" },
    { name: "Brown", color: "#9f6b53" },
    { name: "Yellow", color: "#cb912f" },
    { name: "Orange", color: "#d9730d" },
    { name: "Green", color: "#448361" },
    { name: "Blue", color: "#337ea9" },
    { name: "Purple", color: "#9065b0" },
    { name: "Pink", color: "#c14c8a" },
    { name: "Red", color: "#d44c47" },
];

interface IconColorPickerPopupProps {
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    askEveryTime: boolean;
    setAskEveryTime: (ask: boolean) => void;
}

export function IconColorPickerPopup({
    selectedColor,
    setSelectedColor,
    askEveryTime,
    setAskEveryTime
}: IconColorPickerPopupProps) {
    return (
        <Popover>
            <PopoverTrigger
                render={
                    <button className="flex items-center justify-center size-8 hover:bg-accent rounded-md shrink-0 border border-border transition-colors" title="Change Color">
                        <div className="size-3.5 rounded-full ring-1 ring-border" style={{ backgroundColor: selectedColor }} />
                    </button>
                }
            />
            <PopoverContent className="w-auto p-0.5 flex flex-col items-center gap-0.5 bg-white shadow-md border rounded-lg" sideOffset={8} align="end">
                <div className="grid grid-cols-5 gap-0.5">
                    {ICON_COLORS.map((c) => (
                        <button
                            key={c.name}
                            onClick={() => { setSelectedColor(c.color); localStorage.setItem("selectedIconColor", c.color); }}
                            className={`flex items-center justify-center size-8 hover:bg-accent rounded-md shrink-0 transition-colors cursor-pointer ${selectedColor === c.color ? 'bg-accent' : ''}`}
                            title={c.name}
                        >
                            <div className="size-3.5 rounded-full ring-1 ring-border" style={{ backgroundColor: c.color }} />
                        </button>
                    ))}
                </div>
                <div className="flex items-center justify-between p-1 border-t border-border">
                    <span className="text-[13px] pr-2 text-[#37352f]/70 font-medium">Ask every time</span>
                    <button
                        onClick={() => { const newVal = !askEveryTime; setAskEveryTime(newVal); localStorage.setItem("askEveryTime", String(newVal)); }}
                        className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${askEveryTime ? 'bg-blue-500' : 'bg-[#efefed]'}`}
                    >
                        <div className={`absolute top-0.5 size-3 bg-white rounded-full shadow-sm transition-all ${askEveryTime ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
