import React, { useState, useEffect } from 'react';
import { X, Trophy, Medal, Moon, Flame, Globe2, Compass, Award } from 'lucide-react';
import { subscribeToLeaderboard, type UserProfile } from '../firebase';

interface Props {
  currentUserId?: string;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<Props> = ({ currentUserId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'moon' | 'mars'>('all');
  const [players, setPlayers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToLeaderboard(activeTab, (data) => {
      setPlayers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0b0f14] border-2 border-yellow-500/40 shadow-2xl text-[#e2f0fd] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-500/20 bg-[#141b24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Press_Start_2P',_monospace]">
                GALACTIC LEADERBOARD
              </h2>
              <span className="text-xs text-yellow-400/80 font-semibold tracking-wider">
                EXPLORER RANKINGS BY ABANDONED OBJECTS RECOVERED
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Close Leaderboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs: Separate for Moon, Mars, and Together */}
        <div className="px-6 pt-4 pb-2 bg-[#0e141c] border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex rounded-xl bg-[#16202c] p-1 border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-yellow-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              TOGETHER (OVERALL)
            </button>
            <button
              onClick={() => setActiveTab('moon')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'moon'
                  ? 'bg-[#8BAC0F] text-[#0F380F] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              MOON (LUNAR)
            </button>
            <button
              onClick={() => setActiveTab('mars')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'mars'
                  ? 'bg-[#cfb36e] text-[#221206] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              MARS (MARTIAN)
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Ranked primarily by <strong>Objects Found</strong>, then <strong>Score</strong>
          </span>
        </div>

        {/* Players List Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
              <Compass className="w-10 h-10 text-yellow-400 animate-spin" />
              <p className="text-xs text-slate-400">Syncing planetary registry leaderboard...</p>
            </div>
          ) : players.length > 0 ? (
            <div className="space-y-2">
              {players.map((player, index) => {
                const rank = index + 1;
                const isCurrentUser = player.uid === currentUserId;
                
                let rankVisual = `#${rank}`;
                let rankClass = 'text-slate-400';
                if (rank === 1) {
                  rankVisual = '👑 1ST';
                  rankClass = 'text-yellow-400 font-bold';
                } else if (rank === 2) {
                  rankVisual = '🥈 2ND';
                  rankClass = 'text-slate-200 font-bold';
                } else if (rank === 3) {
                  rankVisual = '🥉 3RD';
                  rankClass = 'text-amber-500 font-bold';
                }

                // Values based on active tab
                const objectsCount = activeTab === 'moon' 
                  ? (player.moonObjectsFound || 0) 
                  : activeTab === 'mars' 
                  ? (player.marsObjectsFound || 0) 
                  : (player.totalObjectsFound || 0);

                const score = activeTab === 'moon' 
                  ? (player.moonScore || 0) 
                  : activeTab === 'mars' 
                  ? (player.marsScore || 0) 
                  : (player.highScore || 0);

                return (
                  <div
                    key={player.uid || index}
                    className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all ${
                      isCurrentUser
                        ? 'bg-yellow-500/10 border-yellow-500/60 shadow-lg'
                        : 'bg-[#121922] border-white/5 hover:border-white/15'
                    }`}
                  >
                    {/* Left: Rank & Avatar & Name */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`w-14 sm:w-16 text-center text-xs font-mono shrink-0 ${rankClass}`}>
                        {rankVisual}
                      </div>

                      <div className="relative shrink-0">
                        {player.photoURL ? (
                          <img 
                            src={player.photoURL} 
                            alt={player.displayName} 
                            className="w-10 h-10 rounded-full border border-white/20 object-cover" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#1e2a38] border border-white/20 flex items-center justify-center font-bold text-white text-sm">
                            {player.displayName?.[0] || 'E'}
                          </div>
                        )}
                        {isCurrentUser && (
                          <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-yellow-400 text-black text-[9px] font-bold rounded">
                            YOU
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {player.displayName || 'Anonymous Rover Pilot'}
                          </h4>
                          {isCurrentUser && (
                            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                              Current Pilot
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>ROVER: {player.favoriteVehicle || 'VIPER'}</span>
                          {activeTab === 'all' && (
                            <span className="hidden sm:inline">
                              • 🌙 {player.moonObjectsFound || 0} | 🔴 {player.marsObjectsFound || 0}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Objects Found & Score */}
                    <div className="flex items-center gap-3 sm:gap-6 shrink-0 text-right">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                          Objects Found
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm sm:text-base font-bold text-emerald-400 font-mono">
                          <Award className="w-3.5 h-3.5" />
                          {objectsCount}
                        </span>
                      </div>

                      <div className="w-20 sm:w-24">
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                          Score
                        </span>
                        <span className="text-sm sm:text-base font-bold text-yellow-400 font-mono">
                          {score.toString().padStart(5, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
              <Trophy className="w-12 h-12 text-slate-600" />
              <h4 className="text-base font-bold text-white">No Explorers Logged Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Sign in and discover historical abandoned objects in the game to claim the #1 spot on the galactic leaderboard!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#141b24] flex items-center justify-between text-xs text-slate-400">
          <span>Real-time planetary telemetry standings</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
