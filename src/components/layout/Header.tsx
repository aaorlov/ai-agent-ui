import { Link, useLocation } from "react-router-dom";
import { MoreHorizontal, User, Share2, Pin, PinOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChat } from "@/contexts/chat-context";

const APP_NAME = "Ai Agent";

export function Header() {
  const location = useLocation();
  const isSearch = location.pathname === "/search";
  const {
    activeChatId,
    getChat,
    updateChatTitle,
    deleteChat,
    pinChat,
    unpinChat,
  } = useChat();
  const activeChat = activeChatId ? getChat(activeChatId) : null;

  const handleShare = () => {
    if (!activeChat) return;
    if (navigator.share) {
      navigator.share({
        title: activeChat.title,
        text: activeChat.messages
          .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
          .join("\n\n"),
      });
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Link
          to="/app"
          className="shrink-0 text-lg font-semibold text-foreground hover:opacity-90"
        >
          {APP_NAME}
        </Link>
        {isSearch ? (
          <h1 className="truncate text-center text-sm font-medium text-muted-foreground md:text-base">
            Search
          </h1>
        ) : (
          activeChat && (
            <h1 className="truncate text-center text-sm font-medium text-muted-foreground md:text-base">
              {activeChat.title}
            </h1>
          )
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {activeChat && !isSearch && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              aria-label="Chat options"
            >
              <MoreHorizontal className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 size-4" />
                Share conversation
              </DropdownMenuItem>
              {activeChat.pinned ? (
                <DropdownMenuItem onClick={() => unpinChat(activeChat.id)}>
                  <PinOff className="mr-2 size-4" />
                  Unpin
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => pinChat(activeChat.id)}>
                  <Pin className="mr-2 size-4" />
                  Pin
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  const title = window.prompt("Rename chat", activeChat.title);
                  if (title?.trim()) updateChatTitle(activeChat.id, title.trim());
                }}
              >
                <Pencil className="mr-2 size-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => deleteChat(activeChat.id)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button variant="ghost" size="icon" aria-label="User menu">
          <User className="size-5" />
        </Button>
      </div>
    </header>
  );
}
