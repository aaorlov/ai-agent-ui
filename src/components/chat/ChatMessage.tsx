import { useState } from "react";
import { Copy, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
  onCopy: () => void;
  onUpdate: (content: string) => void;
}

export function ChatMessage({ message, onCopy, onUpdate }: ChatMessageProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [hovered, setHovered] = useState(false);

  const isUser = message.role === "user";

  const handleUpdate = () => {
    if (editValue.trim() !== message.content) {
      onUpdate(editValue.trim());
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditValue(message.content);
    setEditing(false);
  };

  if (isUser && editing) {
    return (
      <div className="flex justify-end px-4 py-2">
        <div className="flex w-full max-w-2xl flex-col gap-2">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleUpdate();
              }
              if (e.key === "Escape") handleCancel();
            }}
            className="min-h-[80px] w-full resize-y rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            autoFocus
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div
        className="group flex justify-end px-4 py-2"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex max-w-2xl items-start gap-2">
          {hovered && (
            <div className="flex shrink-0 gap-0.5 pt-2">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onCopy}
                aria-label="Copy"
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setEditing(true)}
                aria-label="Edit"
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil className="size-3.5" />
              </Button>
            </div>
          )}
          <div
            className={cn(
              "rounded-lg px-3 py-2 text-sm",
              "bg-muted text-foreground"
            )}
          >
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-4 py-2">
      <div className="flex max-w-2xl items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2L14.5 8.5L21 9L16 13.5L17.5 20L12 17L6.5 20L8 13.5L3 9L9.5 8.5L12 2Z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1 rounded-lg py-1 text-sm text-foreground">
          {message.content}
        </div>
      </div>
    </div>
  );
}
