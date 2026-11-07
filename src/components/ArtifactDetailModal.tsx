import React from 'react';
import { X, MapPin, Calendar, Award, Compass, ShieldCheck } from 'lucide-react';
import type { UserDiscovery, AbandonedObjectItem } from '../firebase';

interface Props {
  item: UserDiscovery | AbandonedObjectItem | null;
  onClose: () => void;
}

export const ArtifactDetailModal: React.FC<Props> = ({ item, onClose }) => {
  if (!item) return null;

  const isDiscovery = 'roverUsed' in item;
  const isMoon = item.targetBody === 'MOON';
  const title = 'name' in item ? item.name : (item as UserDiscovery).objectName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border-2 p-6 shadow-2xl text-left font-mono ${
          isMoon 
            ? 'bg-[#0f1712] border-[#8BAC0F] text-[#e2f0fd]' 
            : 'bg-[#1a0f0a] border-[#cfb36e] text-[#ffeada]'
        }`}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b pb-3 mb-4 border-current/20">
          <div className="flex items-center gap-2">
            <span 
              className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${
                isMoon ? 'bg-[#306230] text-[#9BBC0F]' : 'bg-[#5a3814] text-[#cfb36e]'
              }`}
            >
              {item.targetBody} ARTIFACT
            </span>
            <span className="text-xs text-yellow-400 font-semibold tracking-wider">
              +{item.points || 100} PTS
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-white font-['Press_Start_2P',_monospace] leading-relaxed">
          {title}
        </h2>

        {/* Image / Visual Blueprint */}
        <div className="my-4 rounded-lg overflow-hidden border border-current/30 bg-black/60 aspect-video relative flex items-center justify-center">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to schematic banner if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
              <Compass className={`w-16 h-16 animate-pulse ${isMoon ? 'text-[#8BAC0F]' : 'text-[#cfb36e]'}`} />
              <p className="text-sm opacity-80 uppercase tracking-widest">HISTORICAL NASA DEEP SPACE TELEMETRY ARCHIVE</p>
              <span className="text-xs opacity-60">SURFACE SECTOR: {item.targetBody}</span>
            </div>
          )}

          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-[11px] font-mono border border-white/20">
            LOC: {(item as any).body || `${item.targetBody} SURFACE`}
          </div>
        </div>

        {/* Discovery Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 text-xs">
          <div className="p-3 rounded bg-white/5 border border-white/10 flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-yellow-400 shrink-0" />
            <div>
              <span className="block opacity-60 uppercase text-[10px]">Resting Location</span>
              <span className="font-semibold text-white">{(item as any).body || item.targetBody}</span>
            </div>
          </div>

          <div className="p-3 rounded bg-white/5 border border-white/10 flex items-start gap-2">
            <Calendar className="w-4 h-4 mt-0.5 text-sky-400 shrink-0" />
            <div>
              <span className="block opacity-60 uppercase text-[10px]">Mission Operational Dates</span>
              <span className="font-semibold text-white">{item.dates || 'Historical NASA Mission'}</span>
            </div>
          </div>

          <div className="p-3 rounded bg-white/5 border border-white/10 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 mt-0.5 text-green-400 shrink-0" />
            <div>
              <span className="block opacity-60 uppercase text-[10px]">Current Recorded Status</span>
              <span className="font-semibold text-white">{item.status || 'PARKED ON SURFACE'}</span>
            </div>
          </div>

          {isDiscovery && (
            <div className="p-3 rounded bg-white/5 border border-white/10 flex items-start gap-2">
              <Award className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
              <div>
                <span className="block opacity-60 uppercase text-[10px]">Rover Used & Grid Coords</span>
                <span className="font-semibold text-white">
                  {(item as UserDiscovery).roverUsed} • {(item as UserDiscovery).coordinates}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Scientific Discovery Text */}
        <div className="p-4 rounded-lg bg-black/40 border border-white/10 my-4 text-sm leading-relaxed">
          <span className="block text-xs uppercase font-bold tracking-wider text-yellow-400 mb-1">
            Historical Discovery Dossier:
          </span>
          <p className="opacity-90">
            {item.discovery || 'Recovered telemetry beacon confirming historic NASA lunar / martian surface operation.'}
          </p>
        </div>

        {isDiscovery && (item as UserDiscovery).foundAt && (
          <div className="text-right text-[11px] opacity-60">
            Recovered on: {new Date((item as UserDiscovery).foundAt).toLocaleString()}
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded text-xs font-bold uppercase transition-all shadow-md active:scale-95 ${
              isMoon
                ? 'bg-[#8BAC0F] hover:bg-[#9BBC0F] text-[#0F380F]'
                : 'bg-[#cfb36e] hover:bg-[#ffeada] text-[#221206]'
            }`}
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
