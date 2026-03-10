import { useEffect, useRef } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/contexts/chat-context";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

export function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { getChat, setActiveChat, createChat, addMessage, updateMessage } =
    useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) setActiveChat(chatId);
  }, [chatId, setActiveChat]);

  const chat = chatId ? getChat(chatId) : null;

  if (chatId && !chat) {
    return <Navigate to="/app" replace />;
  }

  const handleSend = (content: string) => {
    let targetId = chatId;
    if (!targetId) {
      targetId = createChat();
      navigate(`/app/${targetId}`, { replace: true });
    }
    addMessage(targetId, "user", content);
    addMessage(
      targetId,
      "assistant",
      "This is a placeholder response. Connect your AI backend to stream real replies."
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages.length]);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-3xl pb-4 pt-4">
          {(!chat || chat.messages.length === 0) && (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
              <p className="text-sm">Send a message to start the conversation.</p>
            </div>
          )}
          {chat?.messages.map((message: ChatMessageType) => (
            <ChatMessage
              key={message.id}
              message={message}
              onCopy={() => {
                navigator.clipboard.writeText(message.content);
              }}
              onUpdate={(content: string) =>
                chatId && updateMessage(chatId, message.id, content)
              }
            />
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="shrink-0 border-t border-border bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSubmit={handleSend} />
        </div>
      </div>
    </div>
  );
}
