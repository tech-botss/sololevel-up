import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AuthPage from '@/pages/AuthPage';
import ProfileSetupPage from '@/pages/ProfileSetupPage';
import ProfileEditPage from '@/pages/ProfileEditPage';
import HomePage from '@/pages/HomePage';
import QuestsPage from '@/pages/QuestsPage';
import ProfilePage from '@/pages/ProfilePage';
import LeaderboardsPage from '@/pages/LeaderboardsPage';
import FriendsPage from '@/pages/FriendsPage';
import FriendProfilePage from '@/pages/FriendProfilePage';
import StorePage from '@/pages/StorePage';
import AchievementsPage from '@/pages/AchievementsPage';
import { StreaksPage } from '@/components/timer/StreaksPage';
import NotFound from '@/pages/NotFound';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.98,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Slide up variant for modals/overlays
const slideUpVariants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.3,
    },
  },
};

// Fade variant
const fadeVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

interface AnimatedPageProps {
  children: React.ReactNode;
  variant?: 'slide' | 'slideUp' | 'fade';
}

function AnimatedPage({ children, variant = 'slide' }: AnimatedPageProps) {
  const variants = variant === 'slideUp' ? slideUpVariants : variant === 'fade' ? fadeVariants : pageVariants;
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
}

export function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/auth" 
          element={
            <AnimatedPage variant="fade">
              <AuthPage />
            </AnimatedPage>
          } 
        />
        <Route 
          path="/profile-setup" 
          element={
            <ProtectedRoute>
              <AnimatedPage variant="slideUp">
                <ProfileSetupPage />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <HomePage />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quests" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <QuestsPage />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <ProfilePage />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/edit" 
          element={
            <ProtectedRoute>
              <AnimatedPage variant="slideUp">
                <ProfileEditPage />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leaderboards" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <LeaderboardsPage />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/friends" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <FriendsPage />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/friends/:friendId" 
          element={
            <ProtectedRoute>
              <AnimatedPage variant="slideUp">
                <FriendProfilePage />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/store" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <StorePage />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/achievements" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <AchievementsPage />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/streaks" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <StreaksPage />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="*" 
          element={
            <AnimatedPage variant="fade">
              <NotFound />
            </AnimatedPage>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}
