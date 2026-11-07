import React, { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  syncUserProfile, 
  checkIsAdmin, 
  testConnection, 
  recordDiscovery, 
  recordHighScore,
  subscribeToUserDiscoveries,
  subscribeToAbandonedObjects,
  subscribeToVehicles,
  type UserProfile, 
  type UserDiscovery, 
  type AbandonedObjectItem, 
  type VehicleItem 
} from './firebase';
import { DEFAULT_ABANDONED_OBJECTS, DEFAULT_VEHICLES } from './defaultData';
import { TopNav } from './components/TopNav';
import { DashboardModal } from './components/DashboardModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SettingsModal } from './components/SettingsModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { NotificationToast, type ToastMessage } from './components/NotificationToast';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [discoveries, setDiscoveries] = useState<UserDiscovery[]>([]);
  const [abandonedObjects, setAbandonedObjects] = useState<AbandonedObjectItem[]>(DEFAULT_ABANDONED_OBJECTS);
  const [vehicles, setVehicles] = useState<VehicleItem[]>(DEFAULT_VEHICLES);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modals state
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'discovery' | 'score' | 'info', title: string, description: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync modal open state to isolate game canvas keyboard listeners
  const isAnyModalOpen = showDashboard || showLeaderboard || showSettings || showAdmin;
  useEffect(() => {
    (window as any).IS_REACT_MODAL_OPEN = isAnyModalOpen;
    (window as any).CLOSE_REACT_MODAL = () => {
      setShowDashboard(false);
      setShowLeaderboard(false);
      setShowSettings(false);
      setShowAdmin(false);
    };
  }, [isAnyModalOpen]);

  // 1. Boot connection test
  useEffect(() => {
    testConnection();
  }, []);

  // 2. Auth State Changed Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const prof = await syncUserProfile(user);
          setProfile(prof);
          const adminCheck = checkIsAdmin(user) || !!prof.isAdmin;
          setIsAdmin(adminCheck);
        } catch (err) {
          console.error("Profile sync error:", err);
        }
      } else {
        setProfile(null);
        setDiscoveries([]);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 3. User Discoveries Listener
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToUserDiscoveries(currentUser.uid, (data) => {
      setDiscoveries(data);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // 4. Abandoned Objects Catalog from Firestore (with game dynamic sync)
  useEffect(() => {
    const unsubscribe = subscribeToAbandonedObjects((data) => {
      if (data && data.length > 0) {
        setAbandonedObjects(data);
        (window as any).ABANDONED_MISSIONS_DYNAMIC = data;
      } else {
        (window as any).ABANDONED_MISSIONS_DYNAMIC = DEFAULT_ABANDONED_OBJECTS;
      }
    });
    return () => unsubscribe();
  }, []);

  // 5. Vehicles / Rover Fleet from Firestore (with game dynamic sync)
  useEffect(() => {
    const unsubscribe = subscribeToVehicles((data) => {
      if (data && data.length > 0) {
        setVehicles(data);
        if ((window as any).NASA_GAME) {
          (window as any).NASA_GAME.rovers = data.filter(v => v.isAvailable !== false);
        }
      } else {
        setVehicles(DEFAULT_VEHICLES);
      }
    });
    return () => unsubscribe();
  }, []);

  // 6. In-game Event Listeners
  useEffect(() => {
    const handleMissionCollected = async (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || !detail.mission) return;

      const mission = detail.mission;
      const surface = detail.surface || 'MOON';
      const rover = detail.rover || 'VIPER';
      const coords = detail.coords || 'X:+000 Y:+000';

      // Find enriched info from catalog
      const catalogItem = abandonedObjects.find(
        o => o.name.toLowerCase() === (mission.name || '').toLowerCase()
      );

      if (currentUser) {
        try {
          await recordDiscovery(currentUser, {
            objectId: catalogItem?.id || mission.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
            objectName: mission.name,
            targetBody: surface,
            points: mission.points || 100,
            coordinates: coords,
            roverUsed: rover,
            dates: mission.dates || catalogItem?.dates,
            discovery: mission.discovery || catalogItem?.discovery,
            status: mission.status || catalogItem?.status,
            imageUrl: catalogItem?.imageUrl
          });

          addToast(
            'discovery',
            `ARTIFACT RECOVERED: ${mission.name}`,
            `Logged to your registry dossier! Awarded +${mission.points || 100} scientific exploration points.`
          );
        } catch (err) {
          console.error("Failed to persist discovery:", err);
        }
      } else {
        addToast(
          'info',
          `ARTIFACT FOUND: ${mission.name}`,
          'Sign in with Google to permanently save discovered artifacts and rank on the Galactic Leaderboard!'
        );
      }
    };

    const handleGameOver = async (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;

      const score = detail.score || 0;
      const surface = detail.surface || 'MOON';

      if (currentUser && score > 0) {
        try {
          await recordHighScore(currentUser, score, surface);
          if (profile && score > (profile.highScore || 0)) {
            addToast('score', 'NEW PERSONAL HIGH SCORE!', `Achieved ${score} points on ${surface}! Telemetry synced.`);
          }
        } catch (err) {
          console.error("Failed to record high score:", err);
        }
      }
    };

    window.addEventListener('nasa:mission_collected', handleMissionCollected);
    window.addEventListener('nasa:game_over', handleGameOver);

    return () => {
      window.removeEventListener('nasa:mission_collected', handleMissionCollected);
      window.removeEventListener('nasa:game_over', handleGameOver);
    };
  }, [currentUser, abandonedObjects, profile]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      addToast('info', 'LOGIN SUCCESSFUL', 'Welcome to Abandoned but not Forgotten: Planetary Recovery Initiative!');
    } catch (err) {
      console.error(err);
      addToast('info', 'SIGN IN CANCELLED', 'Google authentication window was closed.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      addToast('info', 'SIGNED OUT', 'Telemetry session closed.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Top Floating Companion Bar */}
      <TopNav
        user={currentUser}
        profile={profile}
        discoveries={discoveries}
        isAdmin={isAdmin}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenDashboard={() => setShowDashboard(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      {/* User Dashboard Modal */}
      {showDashboard && (
        <DashboardModal
          profile={profile}
          discoveries={discoveries}
          onClose={() => setShowDashboard(false)}
          onOpenLeaderboard={() => {
            setShowDashboard(false);
            setShowLeaderboard(true);
          }}
          onOpenSettings={() => {
            setShowDashboard(false);
            setShowSettings(true);
          }}
        />
      )}

      {/* Leaderboard Modal (Moon, Mars, Together) */}
      {showLeaderboard && (
        <LeaderboardModal
          currentUserId={currentUser?.uid}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* Pilot Settings Modal */}
      {showSettings && (
        <SettingsModal
          profile={profile}
          vehicles={vehicles}
          onClose={() => setShowSettings(false)}
          onProfileUpdated={(updated) => {
            if (profile) setProfile({ ...profile, ...updated });
          }}
        />
      )}

      {/* Admin Panel Modal */}
      {showAdmin && (
        <AdminPanelModal
          abandonedObjects={abandonedObjects}
          vehicles={vehicles}
          onClose={() => setShowAdmin(false)}
          onRefreshData={() => {
            // Catalogs are live via onSnapshot
          }}
        />
      )}

      {/* In-Game Celebratory Toast Notifications */}
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
