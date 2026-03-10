import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  PenSquare,
  Pin,
  PinOff,
  MoreHorizontal,
  Share2,
  Pencil,
  Trash2,
  Settings,
  Sun,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme, type Theme } from "@/contexts/theme-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@/contexts/chat-context";
import { useState } from "react";

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 56;

export function Sidebar() {
  const navigate = useNavigate();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    createChat,
    sortedChats,
    activeChatId,
    setActiveChat,
    getChat,
    updateChatTitle,
    deleteChat,
    pinChat,
    unpinChat,
  } = useChat();
  const { theme, setTheme } = useTheme();
  const pinnedCount = sortedChats.filter((c: { pinned: boolean }) => c.pinned).length;
  const canPinMore = pinnedCount < 3;
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const width = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  const handleNewChat = () => {
    const id = createChat();
    navigate(`/app/${id}`);
  };

  const handleSearch = () => navigate("/search");

  const handleShare = (chatId: string) => {
    const chat = getChat(chatId);
    if (chat && navigator.share) {
      navigator.share({
        title: chat.title,
        text: chat.messages.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join("\n\n"),
      });
    }
  };

  const handleRenameStart = (chatId: string) => {
    const chat = getChat(chatId);
    if (chat) {
      setRenamingId(chatId);
      setRenameValue(chat.title);
    }
  };

  const handleRenameSubmit = (chatId: string) => {
    if (renameValue.trim()) {
      updateChatTitle(chatId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue("");
  };

  return (
    <aside
      className="flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200"
      style={{ width }}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-sidebar-border",
          sidebarCollapsed ? "justify-center px-0" : "gap-1 px-2"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={sidebarCollapsed ? "size-10" : ""}
        >
          <Menu className="size-5" />
        </Button>
        {!sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearch}
            aria-label="Search"
          >
            <Search className="size-5" />
          </Button>
        )}
      </div>

      {sidebarCollapsed && (
        <>
          <div className="flex shrink-0 justify-center py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewChat}
              aria-label="New chat"
              className="size-10"
            >
              <PenSquare className="size-5" />
            </Button>
          </div>
          <div className="min-h-0 flex-1" />
        </>
      )}

      {!sidebarCollapsed && (
        <>
          <div className="p-2">
            <Button
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={handleNewChat}
            >
              <PenSquare className="size-4" />
              New chat
            </Button>
          </div>

          <div className="flex flex-1 flex-col min-h-0">
            <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Chats
            </div>
            <ScrollArea className="flex-1 px-2">
              <div className="flex flex-col gap-0.5 pb-4">
                {sortedChats.map((chat: { id: string; title: string; pinned: boolean }) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "group flex min-h-[2.5rem] w-full items-center gap-1 rounded-lg px-1 pr-1",
                      "hover:bg-sidebar-accent",
                      activeChatId === chat.id &&
                        "bg-[var(--sidebar-selected)] border border-[var(--sidebar-selected-border)] text-[var(--sidebar-selected-foreground)]"
                    )}
                  >
                    {renamingId === chat.id ? (
                      <div className="flex flex-1 flex-col gap-1 py-1">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameSubmit(chat.id);
                            if (e.key === "Escape") {
                              setRenamingId(null);
                              setRenameValue("");
                            }
                          }}
                          className="w-full rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => {
                              setRenamingId(null);
                              setRenameValue("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => handleRenameSubmit(chat.id)}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Link
                          to={`/app/${chat.id}`}
                          className="flex min-w-0 flex-1 items-center gap-2 rounded-md py-2 pl-1.5 text-left text-sm"
                          onClick={() => setActiveChat(chat.id)}
                        >
                          {chat.pinned && (
                            <Pin className="size-3.5 shrink-0 text-muted-foreground" />
                          )}
                          <span className="truncate">{chat.title}</span>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 hover:bg-transparent"
                            aria-label="Chat menu"
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" side="right">
                            <DropdownMenuItem onClick={() => handleShare(chat.id)}>
                              <Share2 className="mr-2 size-4" />
                              Share conversation
                            </DropdownMenuItem>
                            {chat.pinned ? (
                              <DropdownMenuItem onClick={() => unpinChat(chat.id)}>
                                <PinOff className="mr-2 size-4" />
                                Unpin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => canPinMore && pinChat(chat.id)}
                                disabled={!canPinMore}
                              >
                                <Pin className="mr-2 size-4" />
                                Pin
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleRenameStart(chat.id)}>
                              <Pencil className="mr-2 size-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => deleteChat(chat.id)}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="shrink-0 border-t border-sidebar-border p-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                aria-label="Settings & help"
              >
                <Settings className="size-4 shrink-0" />
                <span className="truncate">Settings & help</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-56">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Sun className="mr-2 size-4" />
                    Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={theme}
                      onValueChange={(value) => setTheme(value as Theme)}
                    >
                      <DropdownMenuRadioItem value="system">
                        System
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="light">
                        Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark">
                        Dark
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem disabled>
                  <HelpCircle className="mr-2 size-4" />
                  Help
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}

      {sidebarCollapsed && (
        <div className="flex shrink-0 justify-center border-t border-sidebar-border p-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex size-10 cursor-pointer items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label="Settings & help"
            >
              <Settings className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" className="w-56">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="mr-2 size-4" />
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as Theme)}
                  >
                    <DropdownMenuRadioItem value="system">
                      System
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      Dark
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem disabled>
                <HelpCircle className="mr-2 size-4" />
                Help
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </aside>
  );
}
