import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ChatProvider } from "@/contexts/chat-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatPage } from "@/pages/ChatPage";
import { SearchPage } from "@/pages/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ChatProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<ChatPage />} />
            <Route path=":chatId" element={<ChatPage />} />
          </Route>
          <Route path="/search" element={<AppLayout />}>
            <Route index element={<SearchPage />} />
          </Route>
        </Routes>
        </ChatProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
