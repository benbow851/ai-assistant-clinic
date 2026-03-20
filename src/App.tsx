
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Webhooks from "./pages/Webhooks";

import Credentials from "./pages/Credentials";
import Knowledge from "./pages/Knowledge";
import Customers from "./pages/Customers";
import Appointments from "./pages/Appointments";
import ChatButton from "./components/ChatButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Navigate to="/knowledge" replace />} />
        <Route path="/webhooks" element={<Webhooks />} />
        <Route path="/chat-editor" element={<ChatEditor />} />
        <Route path="/credentials" element={<Credentials />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/appointments" element={<Appointments />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatButton />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
