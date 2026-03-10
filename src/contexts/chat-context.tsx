import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Chat, ChatMessage } from "@/types/chat";

const MAX_PINNED = 3;

interface ChatContextValue {
  chats: Chat[];
  activeChatId: string | null;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  createChat: () => string;
  setActiveChat: (id: string | null) => void; // alias for setActiveChatId
  getChat: (id: string) => Chat | undefined;
  updateChatTitle: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
  pinChat: (id: string) => void;
  unpinChat: (id: string) => void;
  addMessage: (chatId: string, role: ChatMessage["role"], content: string) => void;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  sortedChats: Chat[];
}

const ChatContext = createContext<ChatContextValue | null>(null);

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(() => [
    {
      id: "welcome",
      title: "Ready for Your Request",
      pinned: false,
      messages: [
        {
          id: "m1",
          role: "assistant",
          content:
            "I'm here! Loud and clear. Is there a specific project you're digging into, or did you just want to make sure the lights were on? I'm ready whenever you are. How can I help you today?",
        },
      ],
      createdAt: Date.now(),
    },
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>("welcome");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const createChat = useCallback(() => {
    const id = generateId();
    const chat: Chat = {
      id,
      title: "New chat",
      pinned: false,
      messages: [],
      createdAt: Date.now(),
    };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(id);
    return id;
  }, []);

  const getChat = useCallback(
    (id: string) => chats.find((c) => c.id === id),
    [chats]
  );

  const updateChatTitle = useCallback((id: string, title: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    setActiveChatId((current) => (current === id ? null : current));
  }, []);

  const pinChat = useCallback((id: string) => {
    setChats((prev) => {
      const pinned = prev.filter((c) => c.pinned);
      if (pinned.length >= MAX_PINNED) return prev;
      return prev.map((c) => {
        if (c.id !== id) return c;
        const nextOrder = pinned.length;
        return { ...c, pinned: true, pinnedOrder: nextOrder };
      });
    });
  }, []);

  const unpinChat = useCallback((id: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, pinned: false, pinnedOrder: undefined } : c
      )
    );
  }, []);

  const addMessage = useCallback(
    (chatId: string, role: ChatMessage["role"], content: string) => {
      const message: ChatMessage = {
        id: generateId(),
        role,
        content,
      };
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c;
          const title =
            role === "user" && c.messages.length === 0
              ? content.slice(0, 50) + (content.length > 50 ? "…" : "")
              : c.title;
          return {
            ...c,
            title,
            messages: [...c.messages, message],
          };
        })
      );
    },
    []
  );

  const updateMessage = useCallback(
    (chatId: string, messageId: string, content: string) => {
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c;
          return {
            ...c,
            messages: c.messages.map((m: ChatMessage) =>
              m.id === messageId ? { ...m, content } : m
            ),
          };
        })
      );
    },
    []
  );

  const sortedChats = useMemo(() => {
    const pinned = chats
      .filter((c) => c.pinned)
      .sort((a, b) => (a.pinnedOrder ?? 0) - (b.pinnedOrder ?? 0));
    const rest = chats
      .filter((c) => !c.pinned)
      .sort((a, b) => b.createdAt - a.createdAt);
    return [...pinned, ...rest];
  }, [chats]);

  const value: ChatContextValue = useMemo(
    () => ({
      chats,
      activeChatId,
      sidebarCollapsed,
      setSidebarCollapsed,
      createChat,
      setActiveChat: setActiveChatId,
      getChat,
      updateChatTitle,
      deleteChat,
      pinChat,
      unpinChat,
      addMessage,
      updateMessage,
      sortedChats,
    }),
    [
      chats,
      activeChatId,
      sidebarCollapsed,
      createChat,
      getChat,
      updateChatTitle,
      deleteChat,
      pinChat,
      unpinChat,
      addMessage,
      updateMessage,
      sortedChats,
    ]
  );

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
