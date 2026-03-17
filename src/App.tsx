
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Webhooks from "./pages/Webhooks";
import ChatEditor from "./pages/ChatEditor";
import Credentials from "./pages/Credentials";
import Knowledge from "./pages/Knowledge";
import ChatButton from "./components/ChatButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/webhooks" element={<Webhooks />} />
        <Route path="/chat-editor" element={<ChatEditor />} />
        <Route path="/credentials" element={<Credentials />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatButton />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
