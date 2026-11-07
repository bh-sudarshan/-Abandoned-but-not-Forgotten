import React, { useState } from 'react';
import { X, User, Volume2, VolumeX, Gauge, Compass, Save, Check } from 'lucide-react';
import { updateUserSettings, type UserProfile, type VehicleItem } from '../firebase';

interface Props {
  profile: UserProfile | null;
  vehicles: VehicleItem[];
  onClose: () => void;
  onProfileUpdated: (updated: Partial<UserProfile>) => void;
}

export const SettingsModal: React.FC<Props> = ({
  profile,
  vehicles,
  onClose,
  onProfileUpdated
}) => {
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [favoriteVehicle, setFavoriteVehicle] = useState(profile?.favoriteVehicle || 'VIPER');
  const [soundEnabled, setSoundEnabled] = useState(profile?.soundEnabled !== false);
  const [speedMode, setSpeedMode] = useState(profile?.speedMode || '1X');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateUserSettings(profile.uid, {
        displayName: displayName.trim() || 'Space Explorer',
        favoriteVehicle,
        soundEnabled,
        speedMode
      });

      onProfileUpdated({
        displayName: displayName.trim() || 'Space Explorer',
        favoriteVehicle,
        soundEnabled,
        speedMode
      });

      // Synchronize with active game instance
      if ((window as any).NASA_GAME) {
        const game = (window as any).NASA_GAME;
        if (game.audio) {
          game.audio.isMuted = !soundEnabled;
          game.updateSoundButtonUI?.();
        }
        // If speed mode matches, update speed
        if (speedMode === '2X') {
          game.tickInterval = 100;
        } else if (speedMode === 'TURBO') {
          game.tickInterval = 65;
        } else {
          game.tickInterval = 140;
        }
        const speedBadge = document.getElementById('speed-sub-label');
        if (speedBadge) speedBadge.textContent = speedMode;
      }

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0b0f14] border-2 border-[#306230] shadow-2xl text-[#e2f0fd] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#306230] bg-[#121a24]">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#8BAC0F]" />
            <h2 className="text-base font-bold text-white font-['Press_Start_2P',_monospace]">
              PILOT SETTINGS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 flex items-center gap-1.5">
              Explorer Callsign / Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={40}
              placeholder="e.g. Commander Neil Armstrong"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141d27] border border-white/20 text-white text-sm focus:outline-none focus:border-[#8BAC0F]"
            />
          </div>

          {/* Favorite Vehicle */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#8BAC0F]" />
              Default Rover Vehicle
            </label>
            <select
              value={favoriteVehicle}
              onChange={(e) => setFavoriteVehicle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141d27] border border-white/20 text-white text-sm focus:outline-none focus:border-[#8BAC0F]"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id} className="bg-[#0b0f14] text-white">
                  {v.name} ({v.destination}) - {v.type}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Rover of choice for new planetary expeditions.
            </span>
          </div>

          {/* Sound Preferences */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
              Audio Telemetry & Sound Effects
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSoundEnabled(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                  soundEnabled
                    ? 'bg-[#306230] border-[#8BAC0F] text-white shadow-md'
                    : 'bg-[#141d27] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Volume2 className="w-4 h-4 text-[#9BBC0F]" />
                SOUND ON (8-BIT)
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                  !soundEnabled
                    ? 'bg-rose-950 border-rose-600 text-white shadow-md'
                    : 'bg-[#141d27] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <VolumeX className="w-4 h-4 text-rose-400" />
                MUTE AUDIO
              </button>
            </div>
          </div>

          {/* Speed Mode Preference */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-yellow-400" />
              Engine Propulsion Speed
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['1X', '2X', 'TURBO'] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setSpeedMode(spd)}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold text-center transition-all ${
                    speedMode === spd
                      ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-md'
                      : 'bg-[#141d27] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {savedSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              Pilot preferences synchronized to NASA Planetary Registry!
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#306230] hover:bg-[#8BAC0F] text-white hover:text-[#0F380F] text-xs font-bold uppercase transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
