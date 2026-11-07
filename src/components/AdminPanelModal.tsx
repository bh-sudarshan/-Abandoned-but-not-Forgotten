import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Compass, 
  Check, 
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { 
  saveAbandonedObject, 
  removeAbandonedObject, 
  saveVehicle, 
  removeVehicle,
  type AbandonedObjectItem, 
  type VehicleItem 
} from '../firebase';
import { DEFAULT_ABANDONED_OBJECTS, DEFAULT_VEHICLES } from '../defaultData';

interface Props {
  abandonedObjects: AbandonedObjectItem[];
  vehicles: VehicleItem[];
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminPanelModal: React.FC<Props> = ({
  abandonedObjects,
  vehicles,
  onClose,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'objects' | 'vehicles'>('objects');
  
  // Object Form State
  const [editingObject, setEditingObject] = useState<AbandonedObjectItem | null>(null);
  const [isNewObject, setIsNewObject] = useState(false);
  const [objName, setObjName] = useState('');
  const [objBody, setObjBody] = useState<'MOON' | 'MARS'>('MOON');
  const [objLocation, setObjLocation] = useState('');
  const [objDates, setObjDates] = useState('');
  const [objDiscovery, setObjDiscovery] = useState('');
  const [objStatus, setObjStatus] = useState('');
  const [objPoints, setObjPoints] = useState(100);
  const [objImageUrl, setObjImageUrl] = useState('');

  // Vehicle Form State
  const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [vehId, setVehId] = useState('');
  const [vehName, setVehName] = useState('');
  const [vehFullName, setVehFullName] = useState('');
  const [vehDestination, setVehDestination] = useState<'MOON' | 'MARS'>('MOON');
  const [vehType, setVehType] = useState('');
  const [vehSite, setVehSite] = useState('');
  const [vehMassSpeed, setVehMassSpeed] = useState('');
  const [vehPower, setVehPower] = useState('');
  const [vehPayload, setVehPayload] = useState('');
  const [vehRecord, setVehRecord] = useState('');
  const [vehStatus, setVehStatus] = useState('');
  const [vehTelemetryKey, setVehTelemetryKey] = useState('ICE');
  const [vehAvailable, setVehAvailable] = useState(true);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // --- OBJECTS HANDLERS ---
  const handleStartAddObject = () => {
    setEditingObject(null);
    setIsNewObject(true);
    setObjName('');
    setObjBody('MOON');
    setObjLocation('');
    setObjDates('');
    setObjDiscovery('');
    setObjStatus('GROUND ZERO DRILL CACHE');
    setObjPoints(100);
    setObjImageUrl('');
  };

  const handleStartEditObject = (item: AbandonedObjectItem) => {
    setEditingObject(item);
    setIsNewObject(false);
    setObjName(item.name);
    setObjBody(item.targetBody);
    setObjLocation(item.body);
    setObjDates(item.dates);
    setObjDiscovery(item.discovery);
    setObjStatus(item.status);
    setObjPoints(item.points || 100);
    setObjImageUrl(item.imageUrl || '');
  };

  const handleSaveObject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objName.trim()) return;
    setIsBusy(true);

    try {
      const id = editingObject?.id || `obj_${objBody.toLowerCase()}_${Date.now()}`;
      const itemToSave: AbandonedObjectItem = {
        id,
        name: objName.trim(),
        targetBody: objBody,
        body: objLocation.trim() || `${objBody} SURFACE`,
        dates: objDates.trim() || 'NASA EXPLORATION',
        discovery: objDiscovery.trim() || 'Historical mission artifact cataloged.',
        status: objStatus.trim() || 'MISSION COMPLETE',
        points: Number(objPoints) || 100,
        imageUrl: objImageUrl.trim() || undefined,
        createdAt: editingObject?.createdAt || new Date().toISOString()
      };

      await saveAbandonedObject(itemToSave);
      showToast(`Saved abandoned object "${itemToSave.name}"!`);
      setEditingObject(null);
      setIsNewObject(false);
      onRefreshData();
    } catch (err) {
      console.error(err);
      showToast('Error saving object to Firestore');
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteObject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from abandoned objects?`)) return;
    setIsBusy(true);
    try {
      await removeAbandonedObject(id);
      showToast(`Removed "${name}" from planetary catalog.`);
      onRefreshData();
    } catch (err) {
      console.error(err);
      showToast('Error removing object');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSeedDefaultObjects = async () => {
    if (!confirm('Populate default authentic NASA abandoned objects catalog into Firestore?')) return;
    setIsBusy(true);
    try {
      for (const obj of DEFAULT_ABANDONED_OBJECTS) {
        await saveAbandonedObject(obj);
      }
      showToast('Default NASA abandoned objects synced to Firestore!');
      onRefreshData();
    } catch (err) {
      console.error(err);
      showToast('Seed failed');
    } finally {
      setIsBusy(false);
    }
  };

  // --- VEHICLES HANDLERS ---
  const handleStartAddVehicle = () => {
    setEditingVehicle(null);
    setIsNewVehicle(true);
    setVehId('');
    setVehName('');
    setVehFullName('');
    setVehDestination('MOON');
    setVehType('HEAVY PROSPECTOR');
    setVehSite('MOON [SOUTH POLE]');
    setVehMassSpeed('450 KG | 1.0 KM/H');
    setVehPower('SOLAR + BATTERIES');
    setVehPayload('HD CAMERAS, DRILL, SPECTROMETER');
    setVehRecord('DEEP POLAR EXPLORER');
    setVehStatus('ACTIVE');
    setVehTelemetryKey('ICE');
    setVehAvailable(true);
  };

  const handleStartEditVehicle = (veh: VehicleItem) => {
    setEditingVehicle(veh);
    setIsNewVehicle(false);
    setVehId(veh.id);
    setVehName(veh.name);
    setVehFullName(veh.fullName);
    setVehDestination(veh.destination);
    setVehType(veh.type);
    setVehSite(veh.site);
    setVehMassSpeed(veh.massSpeed);
    setVehPower(veh.power);
    setVehPayload(veh.payload);
    setVehRecord(veh.record);
    setVehStatus(veh.status);
    setVehTelemetryKey(veh.telemetryKey);
    setVehAvailable(veh.isAvailable !== false);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehName.trim()) return;
    setIsBusy(true);

    try {
      const cleanId = vehId.trim().toUpperCase() || vehName.trim().replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
      const vehicleToSave: VehicleItem = {
        id: cleanId,
        name: vehName.trim().toUpperCase(),
        fullName: vehFullName.trim() || vehName.trim(),
        destination: vehDestination,
        type: vehType.trim() || 'PLANETARY ROVER',
        site: vehSite.trim() || `${vehDestination} EXPLORATION SITE`,
        massSpeed: vehMassSpeed.trim() || '400 KG | 0.8 KM/H',
        power: vehPower.trim() || 'SOLAR + BATTERY',
        payload: vehPayload.trim() || 'SCIENTIFIC SENSORS',
        record: vehRecord.trim() || 'MISSION EXPLORER',
        status: vehStatus.trim() || 'ACTIVE',
        telemetryKey: vehTelemetryKey.trim() || 'ICE',
        isAvailable: vehAvailable
      };

      await saveVehicle(vehicleToSave);
      showToast(`Saved NASA vehicle "${vehicleToSave.name}"!`);
      setEditingVehicle(null);
      setIsNewVehicle(false);
      onRefreshData();
    } catch (err) {
      console.error(err);
      showToast('Error saving vehicle');
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove rover "${name}"?`)) return;
    setIsBusy(true);
    try {
      await removeVehicle(id);
      showToast(`Vehicle "${name}" removed.`);
      onRefreshData();
    } catch (err) {
      console.error(err);
      showToast('Error removing vehicle');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSeedDefaultVehicles = async () => {
    if (!confirm('Populate default authentic NASA rovers into Firestore?')) return;
    setIsBusy(true);
    try {
      for (const veh of DEFAULT_VEHICLES) {
        await saveVehicle(veh);
      }
      showToast('Default NASA rovers synced to Firestore!');
      onRefreshData();
    } catch (err) {
      console.error(err);
      showToast('Seed failed');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0b0f14] border-2 border-red-500/50 shadow-2xl text-[#e2f0fd] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-500/30 bg-[#160f12]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Press_Start_2P',_monospace]">
                NASA FLIGHT CONTROL ADMIN
              </h2>
              <span className="text-xs text-red-400 font-semibold tracking-wider">
                AUTHORITY ACCESS • MANAGE ARTIFACTS & FLEET ROVERS
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-6 py-3 bg-[#11161d] border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex rounded-xl bg-[#182330] p-1 border border-white/10 text-xs font-bold">
            <button
              onClick={() => { setActiveTab('objects'); setEditingObject(null); setIsNewObject(false); }}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'objects'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ ABANDONED OBJECTS ({abandonedObjects.length})
            </button>
            <button
              onClick={() => { setActiveTab('vehicles'); setEditingVehicle(null); setIsNewVehicle(false); }}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'vehicles'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🚜 NASA VEHICLES / FLEET ({vehicles.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'objects' ? (
              <>
                <button
                  onClick={handleSeedDefaultObjects}
                  disabled={isBusy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-300 transition-colors"
                  title="Restore NASA historical default objects"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Seed NASA Catalog
                </button>
                <button
                  onClick={handleStartAddObject}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Abandoned Object
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSeedDefaultVehicles}
                  disabled={isBusy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-300 transition-colors"
                  title="Restore NASA standard rover fleet"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Seed NASA Rovers
                </button>
                <button
                  onClick={handleStartAddVehicle}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Rover
                </button>
              </>
            )}
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="mx-6 mt-3 p-3 rounded-lg bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
        )}

        {/* Body Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: ABANDONED OBJECTS */}
          {activeTab === 'objects' && (
            <div className="space-y-6">
              
              {/* If editing or adding new object */}
              {(isNewObject || editingObject) && (
                <form onSubmit={handleSaveObject} className="p-5 rounded-xl bg-[#141c26] border border-amber-500/40 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-sm font-bold text-amber-400">
                      {isNewObject ? 'ADD NEW ABANDONED OBJECT' : `EDIT: ${editingObject?.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setIsNewObject(false); setEditingObject(null); }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Mission / Object Name *</label>
                      <input
                        type="text"
                        required
                        value={objName}
                        onChange={(e) => setObjName(e.target.value)}
                        placeholder="e.g. LUNAR POLAR BASE"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Target Planetary Body *</label>
                      <select
                        value={objBody}
                        onChange={(e) => setObjBody(e.target.value as any)}
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="MOON">MOON (LUNAR)</option>
                        <option value="MARS">MARS (MARTIAN)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Landing Site / Region</label>
                      <input
                        type="text"
                        value={objLocation}
                        onChange={(e) => setObjLocation(e.target.value)}
                        placeholder="e.g. MOON (NOBILE CRATER) or MARS (JEZERO DELTA)"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Operational Dates</label>
                      <input
                        type="text"
                        value={objDates}
                        onChange={(e) => setObjDates(e.target.value)}
                        placeholder="e.g. 1969 - 1972 or 2025"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Current Status Tag</label>
                      <input
                        type="text"
                        value={objStatus}
                        onChange={(e) => setObjStatus(e.target.value)}
                        placeholder="e.g. MISSION COMPLETE or GROUND ZERO DRILL CACHE"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Recovery Score Points</label>
                      <input
                        type="number"
                        value={objPoints}
                        onChange={(e) => setObjPoints(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1">High-Res Photo / Image URL</label>
                      <input
                        type="text"
                        value={objImageUrl}
                        onChange={(e) => setObjImageUrl(e.target.value)}
                        placeholder="e.g. /src/assets/images/... or https://..."
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1">Historical Discovery Dossier *</label>
                      <textarea
                        rows={3}
                        required
                        value={objDiscovery}
                        onChange={(e) => setObjDiscovery(e.target.value)}
                        placeholder="Describe the scientific payload, historical context, water ice detection, or rover findings..."
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsNewObject(false); setEditingObject(null); }}
                      className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isBusy}
                      className="flex items-center gap-1.5 px-5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Abandoned Object
                    </button>
                  </div>
                </form>
              )}

              {/* Objects List */}
              <div className="space-y-3">
                {abandonedObjects.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#121922] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-500" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            item.targetBody === 'MOON' ? 'bg-[#306230] text-[#9BBC0F]' : 'bg-[#5a3814] text-[#cfb36e]'
                          }`}>
                            {item.targetBody}
                          </span>
                          <span className="text-[11px] text-yellow-400">+{item.points} PTS</span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {item.body} • {item.dates} • {item.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => handleStartEditObject(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs text-white"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteObject(item.id, item.name)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-950/60 hover:bg-red-900 border border-red-700/50 text-xs text-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: VEHICLES / ROVER FLEET */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              
              {/* If editing or adding new vehicle */}
              {(isNewVehicle || editingVehicle) && (
                <form onSubmit={handleSaveVehicle} className="p-5 rounded-xl bg-[#141c26] border border-emerald-500/40 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-sm font-bold text-emerald-400">
                      {isNewVehicle ? 'ADD NEW NASA ROVER' : `EDIT ROVER: ${editingVehicle?.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setIsNewVehicle(false); setEditingVehicle(null); }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Rover ID Code *</label>
                      <input
                        type="text"
                        required
                        disabled={!isNewVehicle}
                        value={vehId}
                        onChange={(e) => setVehId(e.target.value.toUpperCase())}
                        placeholder="e.g. VIPER, ARTEMIS_1"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-emerald-400 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Short Name *</label>
                      <input
                        type="text"
                        required
                        value={vehName}
                        onChange={(e) => setVehName(e.target.value)}
                        placeholder="e.g. VIPER"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1">Official Full Mission Name *</label>
                      <input
                        type="text"
                        required
                        value={vehFullName}
                        onChange={(e) => setVehFullName(e.target.value)}
                        placeholder="e.g. NASA VIPER (VOLATILES INVESTIGATING POLAR EXPLORATION ROVER)"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Assigned Destination *</label>
                      <select
                        value={vehDestination}
                        onChange={(e) => setVehDestination(e.target.value as any)}
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                      >
                        <option value="MOON">MOON (LUNAR)</option>
                        <option value="MARS">MARS (MARTIAN)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Rover Type *</label>
                      <input
                        type="text"
                        required
                        value={vehType}
                        onChange={(e) => setVehType(e.target.value)}
                        placeholder="e.g. POLAR WATER ICE PROSPECTOR"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Primary Exploration Site</label>
                      <input
                        type="text"
                        value={vehSite}
                        onChange={(e) => setVehSite(e.target.value)}
                        placeholder="e.g. MOON [NOBILE CRATER]"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Mass & Speed Specs</label>
                      <input
                        type="text"
                        value={vehMassSpeed}
                        onChange={(e) => setVehMassSpeed(e.target.value)}
                        placeholder="e.g. 430 KG | 0.72 KM/H"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Power System</label>
                      <input
                        type="text"
                        value={vehPower}
                        onChange={(e) => setVehPower(e.target.value)}
                        placeholder="e.g. SOLAR + 50AH BATTERIES or MMRTG"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Scientific Payload</label>
                      <input
                        type="text"
                        value={vehPayload}
                        onChange={(e) => setVehPayload(e.target.value)}
                        placeholder="e.g. TRIDENT 1M DRILL, NSS, HEADLIGHTS"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1">Historical Milestone / Record</label>
                      <input
                        type="text"
                        value={vehRecord}
                        onChange={(e) => setVehRecord(e.target.value)}
                        placeholder="e.g. FIRST ROVER WITH CRATER HEADLIGHTS"
                        className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="flex items-center gap-3 sm:col-span-2 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={vehAvailable}
                          onChange={(e) => setVehAvailable(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-0"
                        />
                        <span className="text-white font-bold">Rover Unlocked & Available for Players to Select</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsNewVehicle(false); setEditingVehicle(null); }}
                      className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isBusy}
                      className="flex items-center gap-1.5 px-5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Vehicle
                    </button>
                  </div>
                </form>
              )}

              {/* Vehicles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicles.map((veh) => (
                  <div
                    key={veh.id}
                    className="p-4 rounded-xl bg-[#121922] border border-white/10 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white font-['Press_Start_2P',_monospace]">
                          {veh.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          veh.destination === 'MOON' ? 'bg-[#306230] text-[#9BBC0F]' : 'bg-[#5a3814] text-[#cfb36e]'
                        }`}>
                          {veh.destination}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-300 mt-1">{veh.fullName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{veh.type}</p>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1 bg-black/30 p-2.5 rounded-lg border border-white/5">
                      <div>Site: <strong className="text-white">{veh.site}</strong></div>
                      <div>Mass & Speed: <strong className="text-white">{veh.massSpeed}</strong></div>
                      <div>Payload: <span className="opacity-90">{veh.payload}</span></div>
                      <div>Record: <span className="opacity-90">{veh.record}</span></div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className={`text-[10px] font-bold ${veh.isAvailable !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {veh.isAvailable !== false ? '● UNLOCKED' : '○ LOCKED'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEditVehicle(veh)}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(veh.id, veh.name)}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-700/50 text-xs text-red-300"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#160f12] flex items-center justify-between text-xs text-slate-400">
          <span>Changes are stored to Cloud Firestore and sync live to game sessions</span>
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
