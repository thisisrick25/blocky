"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LuFileText, LuPlus, LuSearch, LuSettings } from "react-icons/lu";
import { DocEmojicon } from "@/components/ui/DocEmojicon";

export function AppSidebar({ emojicon = "📄", docTitle = "" }: { emojicon?: string, docTitle?: string }) {
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r-0 bg-[#fbfbfa]">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2 mt-2">
        <div className="w-5 h-5 bg-[#37352f] rounded-[3px] flex items-center justify-center text-white font-bold text-[10px]">
          B
        </div>
        <span className="font-medium text-sm text-[#37352f]">Blocky</span>
      </SidebarHeader>
      <SidebarContent className="bg-[#fbfbfa]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Search" className="hover:bg-[#efefed] text-[#37352f]/70">
                  <LuSearch className="w-4 h-4" />
                  <span className="text-sm">Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" className="hover:bg-[#efefed] text-[#37352f]/70">
                  <LuSettings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="New Page" className="hover:bg-[#efefed] text-[#37352f]/70">
                  <LuPlus className="w-4 h-4" />
                  <span className="text-sm">New Page</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[11px] font-semibold text-[#37352f]/40 uppercase px-4 mb-2">Private</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive className="bg-[#efefed] text-[#37352f] font-medium">
                  <div className="w-4 h-4 mr-2 flex items-center justify-center">
                    <DocEmojicon emojicon={emojicon} className="w-full h-full" />
                  </div>
                  <span className="text-sm truncate">{docTitle || "Untitled"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
