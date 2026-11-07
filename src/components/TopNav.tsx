import React from 'react';
import { 
  LogIn, 
  LogOut, 
  Trophy, 
  Settings, 
  ShieldAlert, 
  User, 
  Compass,
  Sparkles
} from 'lucide-react';
import type { UserProfile, UserDiscovery } from '../firebase';

interface Props {
  user: any;
  profile: UserProfile | null;
  discoveries: UserDiscovery[];
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onOpenDashboard: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
}

export const TopNav: React.FC<Props> = ({
  user,
  profile,
  discoveries,
  isAdmin,
  onLogin,
  onLogout,
  onOpenDashboard,
  onOpenLeaderboard,
  onOpenSettings,
  onOpenAdmin
}) => {
  return (
    <nav className="fixed top-[72px] right-3 sm:right-5 z-40 flex items-center gap-2 font-mono select-none">
      
      {/* If Signed In */}
      {user ? (
        <div className="flex items-center gap-2 bg-[#0a1017]/95 border-2 border-[#306230] hover:border-[#8BAC0F] backdrop-blur-md p-1.5 rounded-xl shadow-2xl transition-all">
          
          {/* User Profile / Dashboard Button */}
          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#141e2a] hover:bg-[#1e2d40] border border-white/10 hover:border-[#8BAC0F] transition-all text-left shadow-inner"
            title="Open Mission Dashboard & Discovered Artifacts"
          >
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                className="w-7 h-7 rounded-full border border-[#8BAC0F] object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#1b2b3d] border border-[#8BAC0F] flex items-center justify-center text-xs font-bold text-[#8BAC0F]">
                {profile?.displayName?.[0] || 'U'}
              </div>
            )}
            <div className="hidden sm:block">
              <span className="block text-xs font-bold text-white truncate max-w-[120px]">
                {profile?.displayName || 'Explorer'}
              </span>
              <span className="block text-[10px] text-[#9BBC0F] font-bold tracking-wide">
                {discoveries.length} ARTIFACTS
              </span>
            </div>

            {/* Counter pill for mobile */}
            <span className="sm:hidden px-2 py-0.5 rounded text-xs font-bold bg-[#8BAC0F] text-[#0F380F]">
              {discoveries.length}
            </span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#162332] hover:bg-[#22364c] border border-yellow-500/40 text-yellow-300 text-xs font-bold transition-all shadow-sm"
            title="Galactic Leaderboard (Moon, Mars, Together)"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="hidden md:inline">RANKINGS</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-[#162332] hover:bg-[#22364c] border border-white/15 text-white/90 hover:text-white transition-all"
            title="Pilot Settings (Callsign, Default Rover, Sound)"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Admin Panel Button (if admin) */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/90 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-bold transition-all shadow-md animate-pulse"
              title="Admin Panel: Manage Artifacts & Vehicles"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span className="hidden md:inline">ADMIN</span>
            </button>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* If Not Signed In */
        <div className="flex items-center gap-2">
          {/* Sign In Button */}
          <button
            onClick={onLogin}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#172517] to-[#0f1d0f] hover:from-[#223a22] hover:to-[#172c17] border-2 border-[#8BAC0F] text-white text-xs font-bold tracking-wider transition-all shadow-2xl hover:shadow-[#8BAC0F]/30 active:scale-95"
            title="Sign In with Google to save discoveries & compete on leaderboard"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>SIGN IN WITH GOOGLE</span>
          </button>
        </div>
      )}

    </nav>
  );
};
