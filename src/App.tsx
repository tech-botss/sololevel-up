import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import HomePage from "./pages/HomePage";
import QuestsPage from "./pages/QuestsPage";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import FriendsPage from "./pages/FriendsPage";
import StorePage from "./pages/StorePage";
import AchievementsPage from "./pages/AchievementsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="mobile-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/leaderboards" element={<LeaderboardsPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
