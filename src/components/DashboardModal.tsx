import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Compass, 
  Search, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  Navigation, 
  Trophy,
  Rocket
} from 'lucide-react';
import type { UserProfile, UserDiscovery } from '../firebase';
import { ArtifactDetailModal } from './ArtifactDetailModal';

interface Props {
  profile: UserProfile | null;
  discoveries: UserDiscovery[];
  onClose: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
}

export const DashboardModal: React.FC<Props> = ({
  profile,
  discoveries,
  onClose,
  onOpenLeaderboard,
  onOpenSettings
}) => {
  const [filterBody, setFilterBody] = useState<'ALL' | 'MOON' | 'MARS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState<UserDiscovery | null>(null);

  // Filtered discoveries
  const filtered = discoveries.filter(d => {
    const matchesBody = filterBody === 'ALL' || d.targetBody === filterBody;
    const matchesSearch = !searchQuery.trim() || 
      d.objectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.roverUsed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.discovery && d.discovery.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBody && matchesSearch;
  });

  // Calculate Rank Title based on objects found
  const totalFound = profile?.totalObjectsFound || discoveries.length;
  let rankTitle = 'Novice Rover Pilot';
  let rankBadge = '🥉';
  if (totalFound >= 12) {
    rankTitle = 'Deep Space Fleet Admiral';
    rankBadge = '👑';
  } else if (totalFound >= 8) {
    rankTitle = 'Martian Expedition Commander';
    rankBadge = '🥇';
  } else if (totalFound >= 5) {
    rankTitle = 'Lunar Surface Specialist';
    rankBadge = '🥈';
  } else if (totalFound >= 2) {
    rankTitle = 'Planetary Surveyor';
    rankBadge = '🎖️';
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-mono">
        <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0b0f14] border-2 border-[#306230] shadow-2xl text-[#e2f0fd] overflow-hidden">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#306230] bg-[#111922]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#306230]/40 border border-[#8BAC0F] flex items-center justify-center text-xl">
                {rankBadge}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white font-['Press_Start_2P',_monospace]">
                  MISSION DASHBOARD
                </h2>
                <span className="text-xs text-[#8BAC0F] font-semibold tracking-wider">
                  TELEMETRY ID: {profile?.uid?.slice(0, 8) || 'GUEST'} • {rankTitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLeaderboard}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a2533] hover:bg-[#253549] border border-sky-500/30 text-xs font-semibold text-sky-300 transition-colors"
              >
                <Trophy className="w-3.5 h-3.5" />
                Leaderboard
              </button>
              <button
                onClick={onOpenSettings}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a2533] hover:bg-[#253549] border border-white/20 text-xs font-semibold text-white/80 transition-colors"
              >
                Settings
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Close Dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Explorer Profile Banner & Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Profile Card */}
              <div className="md:col-span-2 rounded-xl p-4 bg-gradient-to-br from-[#121d28] to-[#0a1017] border border-[#2b3e52] flex items-center gap-4">
                <div className="relative">
                  {profile?.photoURL ? (
                    <img 
                      src={profile.photoURL} 
                      alt={profile.displayName} 
                      className="w-16 h-16 rounded-full border-2 border-[#8BAC0F] object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#1b2b3d] border-2 border-[#8BAC0F] flex items-center justify-center text-2xl font-bold text-[#8BAC0F]">
                      {profile?.displayName?.[0] || 'N'}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#8BAC0F] text-[#0F380F]">
                    {rankBadge}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white truncate">
                    {profile?.displayName || 'Space Explorer'}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">{profile?.email || 'Authenticated Explorer'}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      ROVER: {profile?.favoriteVehicle || 'VIPER'}
                    </span>
                    <span className="text-[10px] text-yellow-400">
                      SPEED: {profile?.speedMode || '1X'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exploration Stats Cards */}
              <div className="rounded-xl p-4 bg-[#121a24] border border-[#223344] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Objects Recovered</span>
                  <Compass className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                    {totalFound}
                  </span>
                  <div className="mt-1 text-[11px] text-slate-400 flex gap-2">
                    <span>🌙 Moon: <strong className="text-emerald-400">{profile?.moonObjectsFound || discoveries.filter(d => d.targetBody === 'MOON').length}</strong></span>
                    <span>🔴 Mars: <strong className="text-amber-400">{profile?.marsObjectsFound || discoveries.filter(d => d.targetBody === 'MARS').length}</strong></span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-4 bg-[#121a24] border border-[#223344] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold uppercase">High Score</span>
                  <Trophy className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-yellow-400 font-mono">
                    {(profile?.highScore || 0).toString().padStart(5, '0')}
                  </span>
                  <div className="mt-1 text-[11px] text-slate-400 flex gap-2">
                    <span>Moon: {profile?.moonScore || 0}</span>
                    <span>Mars: {profile?.marsScore || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Found Abandoned Objects Section */}
            <div className="rounded-xl bg-[#0f151d] border border-[#1f2d3d] p-4 sm:p-5">
              
              {/* Section Header & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    FOUND ABANDONED OBJECTS ({discoveries.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any artifact card to inspect high-resolution images, coordinates, and historical dossier.
                  </p>
                </div>

                {/* Filter Tabs & Search */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex rounded-lg bg-[#182330] p-1 border border-white/10 text-xs">
                    <button
                      onClick={() => setFilterBody('ALL')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        filterBody === 'ALL' 
                          ? 'bg-[#306230] text-white font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ALL
                    </button>
                    <button
                      onClick={() => setFilterBody('MOON')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        filterBody === 'MOON' 
                          ? 'bg-[#8BAC0F] text-[#0F380F] font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      MOON
                    </button>
                    <button
                      onClick={() => setFilterBody('MARS')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        filterBody === 'MARS' 
                          ? 'bg-[#cfb36e] text-[#221206] font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      MARS
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search objects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-40 sm:w-52 pl-8 pr-3 py-1.5 rounded-lg bg-[#182330] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8BAC0F]"
                    />
                  </div>
                </div>
              </div>

              {/* Artifacts Grid */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {filtered.map((item) => {
                    const isMoon = item.targetBody === 'MOON';
                    return (
                      <div
                        key={item.id || item.objectId}
                        onClick={() => setSelectedArtifact(item)}
                        className={`group relative rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-md flex flex-col justify-between ${
                          isMoon
                            ? 'bg-[#121a15] border-[#306230] hover:border-[#8BAC0F] hover:shadow-[#8BAC0F]/10'
                            : 'bg-[#1c140e] border-[#5a3814] hover:border-[#cfb36e] hover:shadow-[#cfb36e]/10'
                        }`}
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between mb-2">
                          <span 
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                              isMoon ? 'bg-[#306230] text-[#9BBC0F]' : 'bg-[#5a3814] text-[#cfb36e]'
                            }`}
                          >
                            {item.targetBody}
                          </span>
                          <span className="text-[11px] font-bold text-yellow-400">
                            +{item.points || 100} PTS
                          </span>
                        </div>

                        {/* Thumbnail / Image Preview */}
                        <div className="w-full h-32 rounded-lg bg-black/60 overflow-hidden mb-3 border border-white/10 relative flex items-center justify-center">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.objectName} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center p-2 opacity-70">
                              <Compass className={`w-8 h-8 ${isMoon ? 'text-[#8BAC0F]' : 'text-[#cfb36e]'}`} />
                              <span className="text-[10px] mt-1 uppercase font-semibold">NASA Surface Asset</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-bold backdrop-blur-[2px]">
                            <Eye className="w-4 h-4 text-yellow-400" />
                            VIEW DOSSIER
                          </div>
                        </div>

                        {/* Details */}
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-1">
                            {item.objectName}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                            {item.discovery || 'Historical NASA exploration artifact cataloged in planetary orbit.'}
                          </p>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-sky-400" />
                            {item.coordinates || 'X:+000 Y:+000'}
                          </span>
                          <span>
                            Rover: <strong className="text-white">{item.roverUsed || 'VIPER'}</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 px-4 text-center flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-yellow-400">
                    <Rocket className="w-8 h-8 animate-bounce" />
                  </div>
                  <h4 className="text-base font-bold text-white">No Abandoned Objects Found Yet</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pilot your NASA rover across the infinite planetary surface. Follow the <strong>yellow radar chevron</strong> at the screen edge to discover historical Apollo landers, MER rovers, and impact probes!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-5 py-2 rounded-lg bg-[#306230] hover:bg-[#8BAC0F] text-white hover:text-[#0F380F] text-xs font-bold uppercase transition-colors"
                  >
                    Resume Exploration
                  </button>
                </div>
              )}

            </div>

          </div>

          {/* Bottom Bar */}
          <div className="px-6 py-3 border-t border-[#306230] bg-[#111922] flex items-center justify-between text-xs text-slate-400">
            <span>NASA Planetary Registry • Cloud Synced</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* Artifact Detail Dossier Modal */}
      {selectedArtifact && (
        <ArtifactDetailModal
          item={selectedArtifact}
          onClose={() => setSelectedArtifact(null)}
        />
      )}
    </>
  );
};
