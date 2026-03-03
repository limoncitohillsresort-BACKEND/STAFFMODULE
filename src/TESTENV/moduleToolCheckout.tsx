import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Wrench, Scissors, Truck, BedDouble, Zap, Droplet, Search,
  ShoppingCart, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight,
  Info, X, ClipboardCheck, Fuel, Star, PenTool, History,
  ArrowDownLeft, ArrowUpRight, User, FileText, Plus, Edit, Save, Trash2, MapPin
} from 'lucide-react';

// --- Constants ---
const IS_ADMIN = true; // Simulating Admin Privilege

// --- Types ---

// --- Types removed for standard JSX compatibility ---

interface ConditionEntry {
  id: string;
  timestamp: number;
  text: string;
  author: string;
}

interface Tool {
  id: string;
  name: string;
  dept: Department;
  icon: any; // We store the component reference
  iconName: string; // Helper for serialization/selection
  totalQty: number;
  available: number;
  isConsumable: boolean;
  unit: string;
  value: number;
  location: string; // Warehouse Location [E-5]
  conditionHistory: ConditionEntry[]; // Changed from string to array
  requiresFuel?: boolean;
  rating: number;
  description?: string;
  color?: string; // Hex code for organization
}

interface LogEntry {
  id: string;
  timestamp: number;
  type: LogType;
  staffName: string;
  items: {
    id: string;
    name: string;
    location: string;
    qty: number;
    status: 'ok' | 'missing' | 'damaged' | 'recovered';
    value: number;
  }[];
  signature: string;
  totalLiability?: number;
}

interface ActiveSession {
  staffName: string;
  items: Record<string, number>;
}

interface LostRegistryItem {
  staffName: string;
  itemId: string;
  qty: number;
  dateLost: number;
}

const DEPARTMENTS: { id: Department; label: string; icon: any }[] = [
  { id: 'Engineering', label: 'Maint.', icon: Wrench },
  { id: 'Grounds', label: 'Gardens', icon: Scissors },
  { id: 'Fleet', label: 'Fleet', icon: Truck },
  { id: 'Housekeeping', label: 'Hskp', icon: BedDouble },
  { id: 'F&B', label: 'Kitchen', icon: Zap },
];

const ICON_MAP: Record<string, any> = {
  Wrench, Scissors, Truck, BedDouble, Zap, Droplet, Fuel, Info, Search
};

const COLOR_PALETTE = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Black', hex: '#1e293b' },
];

const STAFF_ROSTER = ["Ivan", "Maria", "Carlos", "Sarah", "Maintenance Team A"];

// --- Initial Data ---

const createCondition = (text: string) => [{ id: 'init', timestamp: Date.now(), text, author: 'System' }];

export const INITIAL_INVENTORY: Tool[] = [
  { id: 'e1', name: 'Makita Impact Driver', dept: 'Engineering', icon: Wrench, iconName: 'Wrench', totalQty: 10, available: 8, isConsumable: false, unit: 'pcs', value: 150, location: 'A-1', conditionHistory: createCondition('Scratches on handle, battery holds 80%'), rating: 4, description: '18V Cordless Impact Driver', color: '#3b82f6' },
  { id: 'e2', name: 'Fluke Multimeter', dept: 'Engineering', icon: Zap, iconName: 'Zap', totalQty: 5, available: 2, isConsumable: false, unit: 'pcs', value: 200, location: 'A-2', conditionHistory: createCondition('Good condition'), rating: 5, description: 'Digital Multimeter for electrical testing', color: '#eab308' },
  { id: 'e3', name: 'PVC Glue (Clear)', dept: 'Engineering', icon: Droplet, iconName: 'Droplet', totalQty: 20, available: 15, isConsumable: true, unit: 'cans', value: 12, location: 'C-5', conditionHistory: [], rating: 5, description: 'Standard PVC Cement', color: '#ffffff' },
  { id: 'e4', name: 'Extension Cord (50ft)', dept: 'Engineering', icon: Zap, iconName: 'Zap', totalQty: 12, available: 12, isConsumable: false, unit: 'pcs', value: 45, location: 'B-1', conditionHistory: createCondition('Ground pin slightly bent'), rating: 3, description: 'Heavy duty outdoor cord', color: '#f97316' },
  { id: 'e5', name: 'Hole Saw Kit', dept: 'Engineering', icon: Wrench, iconName: 'Wrench', totalQty: 3, available: 1, isConsumable: false, unit: 'kit', value: 80, location: 'A-4', conditionHistory: createCondition('Missing 1 inch bit'), rating: 2, description: 'Bi-Metal hole saw set', color: '#ef4444' },
  { id: 'e6', name: 'Safety Goggles', dept: 'Engineering', icon: Info, iconName: 'Info', totalQty: 50, available: 45, isConsumable: false, unit: 'pcs', value: 10, location: 'D-2', conditionHistory: createCondition('Good'), rating: 4, description: 'Standard ANSI Z87.1', color: '#ffffff' },
  { id: 'g1', name: 'Hedge Trimmer 2-Cycle', dept: 'Grounds', icon: Scissors, iconName: 'Scissors', totalQty: 6, available: 4, isConsumable: false, unit: 'pcs', value: 350, location: 'G-1', conditionHistory: createCondition('Needs carb clean soon'), rating: 3, requiresFuel: true, description: 'Gas powered trimmer', color: '#22c55e' },
  { id: 'g2', name: 'Rake (Steel)', dept: 'Grounds', icon: Scissors, iconName: 'Scissors', totalQty: 15, available: 10, isConsumable: false, unit: 'pcs', value: 25, location: 'G-3', conditionHistory: createCondition('Handle taped'), rating: 2, description: 'Heavy duty steel rake', color: '#22c55e' },
  { id: 'f1', name: 'Golf Cart #44 (Manager)', dept: 'Fleet', icon: Truck, iconName: 'Truck', totalQty: 1, available: 1, isConsumable: false, unit: 'unit', value: 5000, location: 'P-44', conditionHistory: createCondition('Seat tear driver side'), rating: 4, requiresFuel: true, description: 'Yamaha Gas Cart', color: '#1e293b' },
];

// --- Sub-Components ---

const StarRating = ({ rating, size = 14 }: { rating: number, size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star key={star} size={size} className={star <= rating ? "fill-yellow-400 text-yellow-500" : "text-slate-300"} />
    ))}
  </div>
);

// --- Modals ---

const LogsModal = ({ logs, onClose }: { logs: LogEntry[], onClose: () => void }) => {
  const [filterStaff, setFilterStaff] = useState('All');
  const [viewingLog, setViewingLog] = useState<LogEntry | null>(null);
  const displayLogs = logs.filter(l => filterStaff === 'All' || l.staffName === filterStaff);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-100 w-full max-w-2xl h-[85vh] rounded-xl flex flex-col overflow-hidden relative">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
          <h2 className="font-bold flex items-center gap-2"><History /> Transaction Logs</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded"><X /></button>
        </div>

        <div className="p-4 bg-white border-b flex gap-2 overflow-x-auto shrink-0 [&::-webkit-scrollbar]:hidden">
          <button onClick={() => setFilterStaff('All')} className={`px-3 py-1 rounded-full text-xs font-bold ${filterStaff === 'All' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}>All</button>
          {STAFF_ROSTER.map(s => (
            <button key={s} onClick={() => setFilterStaff(s)} className={`px-3 py-1 rounded-full text-xs font-bold ${filterStaff === s ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}>{s}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {displayLogs.length === 0 && <div className="text-center text-slate-400 mt-10">No records found.</div>}

          {displayLogs.map(log => (
            <div
              key={log.id}
              onClick={() => setViewingLog(log)}
              className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex justify-between mb-2 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${log.type === 'checkout' ? 'bg-blue-100 text-blue-700' :
                    log.totalLiability && log.totalLiability > 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {log.type === 'return' && log.totalLiability ? 'Missing Items' : log.type}
                  </span>
                  <span className="font-bold text-slate-700 text-sm">{log.staffName}</span>
                </div>
                <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
              </div>

              <div className="space-y-1 pointer-events-none">
                {log.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      <span className="font-mono text-slate-400 mr-1 text-xs">[{item.location}]</span>
                      {item.name}
                      <span className="text-xs text-slate-400 ml-1">x{item.qty}</span>
                    </span>
                    {item.status === 'missing' && <span className="text-xs font-bold text-red-500 uppercase">Missing</span>}
                    {item.status === 'recovered' && <span className="text-xs font-bold text-green-500 uppercase">Found</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* DETAILED RECEIPT OVERLAY */}
        {viewingLog && (
          <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-full border border-slate-200">
              <div className="bg-slate-50 p-3 border-b flex justify-between items-center rounded-t-xl">
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
                  <FileText size={14} /> Official Record
                </h3>
                <button onClick={() => setViewingLog(null)} className="p-1.5 bg-white border rounded-full text-slate-500 hover:text-red-500"><X size={14} /></button>
              </div>

              <div className="p-6 overflow-y-auto font-mono text-sm bg-white">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <ClipboardCheck size={24} />
                  </div>
                  <h2 className="font-bold text-lg uppercase">{viewingLog.type} Receipt</h2>
                  <p className="text-xs text-slate-400">{viewingLog.id.toUpperCase()}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between border-b border-dashed pb-1">
                    <span className="text-slate-500">Date:</span>
                    <span>{new Date(viewingLog.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed pb-1">
                    <span className="text-slate-500">Time:</span>
                    <span>{new Date(viewingLog.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed pb-1">
                    <span className="text-slate-500">Staff:</span>
                    <span className="font-bold">{viewingLog.staffName}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold border-b-2 border-slate-800 mb-2 pb-1">ITEMIZED LIST</h4>
                  {viewingLog.items.map((item, i) => (
                    <div
                      key={i}
                      className={`flex justify-between mb-2 p-2 rounded ${item.status === 'missing' ? 'border-2 border-red-500 bg-red-50/50' :
                        item.status === 'recovered' ? 'border-2 border-blue-500 bg-blue-50/50' : ''
                        }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          <span className="text-slate-400 text-xs font-mono mr-1">[{item.location}]</span>
                          {item.name}
                        </span>
                        <span className="text-xs text-slate-500">{item.id}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">x{item.qty}</span>
                        {item.status !== 'ok' && (
                          <span className={`block text-[10px] font-bold uppercase px-1 rounded mt-1 ${item.status === 'missing' ? 'text-red-600' : 'text-blue-600'
                            }`}>
                            {item.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {viewingLog.totalLiability ? (
                  <div className="bg-red-50 p-3 border border-red-100 rounded mb-6 text-red-800">
                    <div className="flex justify-between font-bold text-lg mb-1">
                      <span>LIABILITY</span>
                      <span>${viewingLog.totalLiability.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 p-3 border border-green-100 rounded mb-6 text-green-800 text-xs text-center">
                    Assets transacted in good condition.
                  </div>
                )}

                <div className="mt-8 pt-4 border-t-2 border-slate-200">
                  <p className="text-[10px] text-slate-400 uppercase mb-2">Authorized Signature</p>
                  <div className="h-20 border border-slate-300 border-dashed rounded bg-slate-50 flex items-center justify-center relative overflow-hidden">
                    {viewingLog.signature ? (
                      <img src={viewingLog.signature} alt="Signature" className="h-full w-full object-contain p-2" />
                    ) : (
                      <span className="text-xs text-slate-400 italic">No signature</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SignaturePad = ({ onChange, isRequired }: { onChange: (signature: string | null) => void, isRequired: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasContent, setHasContent] = useState(false);

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';

    const moveHandler = (ev: any) => draw(ev, ctx);
    const endHandler = () => stopDrawing(moveHandler, endHandler);

    canvas.addEventListener('mousemove', moveHandler);
    canvas.addEventListener('touchmove', moveHandler, { passive: false });
    canvas.addEventListener('mouseup', endHandler);
    canvas.addEventListener('touchend', endHandler);
    canvas.addEventListener('mouseleave', endHandler);
  };

  const draw = (e: any, ctx: CanvasRenderingContext2D) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    if (!hasContent) setHasContent(true);
  };

  const stopDrawing = (moveHandler: any, endHandler: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.removeEventListener('mousemove', moveHandler);
    canvas.removeEventListener('touchmove', moveHandler);
    canvas.removeEventListener('mouseup', endHandler);
    canvas.removeEventListener('touchend', endHandler);
    canvas.removeEventListener('mouseleave', endHandler);
    if (hasContent) onChange(canvas.toDataURL());
  };

  const getCoordinates = (e: any, canvas: HTMLCanvasElement) => {
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const rect = canvas.getBoundingClientRect();
    return { offsetX: clientX - rect.left, offsetY: clientY - rect.top };
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-end mb-1">
        <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
          <PenTool size={12} /> Signature {isRequired && <span className="text-red-500">*</span>}
        </label>
        <button onClick={() => {
          const cvs = canvasRef.current;
          if (cvs) cvs.getContext('2d')?.clearRect(0, 0, cvs.width, cvs.height);
          setHasContent(false); onChange(null);
        }} className="text-xs text-blue-600 underline">Clear</button>
      </div>
      <div className={`border-2 rounded-xl bg-white overflow-hidden touch-none ${hasContent ? 'border-green-500' : 'border-slate-300 border-dashed'}`}>
        <canvas ref={canvasRef} width={350} height={100} className="w-full h-[100px] bg-white cursor-crosshair block" onMouseDown={startDrawing} onTouchStart={startDrawing} />
      </div>
    </div>
  );
};

const InventoryCard = ({ item, quantityInCart, onIncrement, onReset, onViewDetails, appMode }: any) => {
  const timerRef = useRef<any>(null);
  const [isPressing, setIsPressing] = useState(false);
  const isSelected = quantityInCart > 0;

  // Logic Fix: Checkin mode allows selecting items even if available is 0 (because you are returning them)
  const isSelectable = appMode === 'checkin' || item.available > 0;

  const handleDown = () => {
    if (!isSelectable && quantityInCart === 0) return;
    setIsPressing(true);
    timerRef.current = setTimeout(() => {
      onReset();
      if (navigator.vibrate) navigator.vibrate(50);
      setIsPressing(false);
    }, 600);
  };

  const handleUp = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; if (isPressing) onIncrement(); }
    setIsPressing(false);
  };

  return (
    <div
      className={`relative flex flex-col p-3 rounded-xl border ${isSelected ? 'border-green-500 bg-green-50/30' : 'border-gray-200'} bg-white shadow-sm transition-all active:scale-95 select-none ${!isSelectable && !isSelected ? 'opacity-50 grayscale' : ''}`}
      onPointerDown={handleDown} onPointerUp={handleUp} onPointerLeave={handleUp}
    >
      <div className="flex justify-between items-start mb-2 pointer-events-none">
        <div className="p-2 rounded-lg" style={{ backgroundColor: item.color ? `${item.color}20` : '#f1f5f9', color: item.color || '#475569' }}>
          {React.createElement(item.icon, { size: 20 })}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`text-xs font-bold px-2 py-1 rounded-full ${item.available === 0 ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'}`}>
            {item.available === 0 ? 'OUT' : `${item.available} ${item.unit}`}
          </div>
          <div className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 rounded border border-slate-200">
            {item.location}
          </div>
        </div>
      </div>
      <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-1 line-clamp-2 min-h-[2.5em] pointer-events-none">
        {item.name}
      </h3>

      {/* Updated Info Button Style */}
      <button
        onPointerDown={e => e.stopPropagation()}
        onClick={e => { e.stopPropagation(); onViewDetails(); }}
        className="absolute bottom-0 right-0 p-3 text-slate-500 hover:text-blue-600 z-10 bg-slate-50 border-t border-l border-slate-200 rounded-tl-2xl rounded-br-xl active:bg-slate-200"
      >
        <Info size={24} />
      </button>

      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full h-7 w-7 flex items-center justify-center shadow-md font-bold text-xs">
          {quantityInCart}
        </div>
      )}
    </div>
  );
};

const ItemFormModal = ({ item, onSave, onClose, isEdit }: { item?: Tool, onSave: (item: Tool) => void, onClose: () => void, isEdit?: boolean }) => {
  const [formData, setFormData] = useState<Partial<Tool>>(item || {
    name: '', dept: 'Engineering', iconName: 'Wrench', totalQty: 1, available: 1, isConsumable: false, unit: 'pcs', value: 0, location: 'A-1', conditionHistory: [], rating: 5, description: '', color: '#ffffff'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Tool);
  };

  // Determine if fields should be locked. 
  // User request: "make sure all admin locked values are unlocked for testing purposes, but retain the isadmin const in the code."
  // Logic: Locked if (isEdit AND !IS_ADMIN). Since IS_ADMIN is true, this is always false (unlocked).
  const isLocked = isEdit && !IS_ADMIN;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            {isEdit ? <Edit size={18} /> : <Plus size={18} />}
            {isEdit ? 'Edit Item' : 'Add to Inventory'}
          </h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Item Name</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
              <select className="w-full p-2 border rounded" value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value as Department })}>
                {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unit</label>
              <input required type="text" className="w-full p-2 border rounded" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} />
            </div>
          </div>

          {/* Icon & Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Icon & Color Tag</label>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
              {Object.keys(ICON_MAP).map(key => {
                const Icon = ICON_MAP[key];
                const isActive = formData.iconName === key;
                return (
                  <button type="button" key={key} onClick={() => setFormData({ ...formData, iconName: key })}
                    className={`p-2 rounded-lg border ${isActive ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {COLOR_PALETTE.map(col => (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: col.hex })}
                  className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform active:scale-95 ${formData.color === col.hex ? 'border-slate-800 scale-110' : 'border-gray-200'}`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          </div>

          {/* Location, Value, Rating Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Value ($)</label>
              <input
                required
                type="number"
                step="0.01"
                className={`w-full p-2 border rounded ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                value={formData.value}
                onChange={e => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                readOnly={isLocked}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
              <input required type="text" className="w-full p-2 border rounded" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rating</label>
              <select className="w-full p-2 border rounded" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}>
                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
          </div>
          {isLocked && <p className="text-[10px] text-red-500 -mt-2">* Value locked by Admin</p>}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Stock</label>
            <input
              required
              type="number"
              className={`w-full p-2 border rounded ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
              value={formData.totalQty}
              onChange={e => setFormData({ ...formData, totalQty: parseInt(e.target.value), available: parseInt(e.target.value) })}
              readOnly={isLocked}
            />
            {isLocked && <p className="text-[10px] text-red-500 mt-1">* Stock managed via Admin DB only</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description / Usage</label>
            <textarea className="w-full p-2 border rounded text-sm" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={formData.isConsumable}
                onChange={e => setFormData({ ...formData, isConsumable: e.target.checked })}
                disabled={isLocked}
              />
              Is Consumable?
            </label>
            {isLocked && <p className="text-[10px] text-red-500 mt-0.5 ml-6">* Category locked</p>}
          </div>
        </form>
        <div className="p-4 bg-slate-50 border-t">
          <button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
            <Save size={18} /> {isEdit ? 'Save Changes' : 'Create Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function ResortToolCheckout({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<Department>('Engineering');
  const [appMode, setAppMode] = useState<AppMode>('checkout');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  // -- Data Stores --
  const [inventory, setInventory] = useState<Tool[]>(INITIAL_INVENTORY);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [lostRegistry, setLostRegistry] = useState<LostRegistryItem[]>([]);

  // -- Transaction State --
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedStaff, setSelectedStaff] = useState('');

  // -- UI State --
  const [selectedForDetail, setSelectedForDetail] = useState<Tool | null>(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [step, setStep] = useState<'shop' | 'verify' | 'receipt'>('shop');
  const [currentSignature, setCurrentSignature] = useState<string | null>(null);

  // -- Modal State for Add/Edit --
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Tool | null>(null);

  // -- Computed --
  const filteredItems = useMemo(() => inventory.filter(i => i.dept === activeTab && i.name.toLowerCase().includes(search.toLowerCase())), [activeTab, search, inventory]);
  const currentItems = filteredItems.slice(page * 6, (page + 1) * 6);
  const totalPages = Math.ceil(filteredItems.length / 6);

  // New Note State
  const [newNote, setNewNote] = useState('');

  useEffect(() => { setPage(0); }, [activeTab]);

  const handleModeSwitch = (mode: AppMode) => {
    setAppMode(mode);
    setCart({});
    setSelectedStaff('');
    setStep('shop');
    setCurrentSignature(null);
  };

  const incrementItem = (id: string) => {
    setCart(prev => {
      const currentQty = prev[id] || 0;
      const item = inventory.find(i => i.id === id);
      if (appMode === 'checkout') {
        if (item && currentQty >= item.available) return prev;
      }
      return { ...prev, [id]: currentQty + 1 };
    });
  };

  // --- Condition History Handlers ---
  const handleAddNote = (itemId: string) => {
    if (!newNote.trim()) return;
    const entry: ConditionEntry = {
      id: Math.random().toString(36).substr(2, 6),
      timestamp: Date.now(),
      text: newNote,
      author: 'Admin'
    };

    setInventory(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      return { ...item, conditionHistory: [entry, ...item.conditionHistory] };
    }));

    // Update local selected item state to reflect change immediately in popup
    if (selectedForDetail && selectedForDetail.id === itemId) {
      setSelectedForDetail(prev => prev ? { ...prev, conditionHistory: [entry, ...prev.conditionHistory] } : null);
    }
    setNewNote('');
  };

  const handleDeleteNote = (itemId: string, noteId: string) => {
    if (!IS_ADMIN) return;
    setInventory(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      return { ...item, conditionHistory: item.conditionHistory.filter(n => n.id !== noteId) };
    }));

    if (selectedForDetail && selectedForDetail.id === itemId) {
      setSelectedForDetail(prev => prev ? { ...prev, conditionHistory: prev.conditionHistory.filter(n => n.id !== noteId) } : null);
    }
  };

  // --- Handlers for Add/Edit ---

  const handleSaveItem = (itemData: Tool) => {
    if (editingItem) {
      // Update existing
      setInventory(prev => prev.map(i => i.id === itemData.id ? { ...itemData, icon: ICON_MAP[itemData.iconName] } : i));
    } else {
      // Create new
      const newItem = { ...itemData, id: Math.random().toString(36).substr(2, 6), icon: ICON_MAP[itemData.iconName] };
      setInventory(prev => [...prev, newItem]);
    }
    setShowItemModal(false);
    setEditingItem(null);
    if (editingItem) setSelectedForDetail(null); // Close detail view after edit
  };

  const openAddModal = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const openEditModal = (item: Tool) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  // --- CORE LOGIC: Discrepancy Calculation ---
  const calculateDiscrepancies = () => {
    const session = activeSessions.find(s => s.staffName === selectedStaff);
    const expectedItems = session ? session.items : {};

    const discrepancies = {
      matched: [] as any[], missing: [] as any[], found: [] as any[], normalReturn: [] as any[]
    };

    if (appMode === 'checkout') {
      Object.entries(cart).forEach(([id, qty]) => {
        const item = inventory.find(i => i.id === id);
        if (item) discrepancies.normalReturn.push({ ...item, qty });
      });
      return discrepancies;
    }

    Object.entries(expectedItems).forEach(([id, expectedQty]) => {
      const returnedQty = cart[id] || 0;
      const item = inventory.find(i => i.id === id);
      if (!item) return;

      if (returnedQty < expectedQty) discrepancies.missing.push({ ...item, qty: expectedQty - returnedQty });
      if (returnedQty > 0) {
        const qtyToMatch = Math.min(returnedQty, expectedQty);
        discrepancies.matched.push({ ...item, qty: qtyToMatch });
      }
    });

    Object.entries(cart).forEach(([id, returnedQty]) => {
      const expectedQty = expectedItems[id] || 0;
      const item = inventory.find(i => i.id === id);
      if (!item) return;
      if (returnedQty > expectedQty) {
        const lostRecord = lostRegistry.find(r => r.staffName === selectedStaff && r.itemId === id);
        discrepancies.found.push({ ...item, qty: returnedQty - expectedQty, isRecovered: !!lostRecord });
      }
    });

    return discrepancies;
  };

  const handleTransactionSubmit = () => {
    if (!currentSignature) { alert("Signature required to proceed."); return; }
    const disc = calculateDiscrepancies();
    const timestamp = Date.now();
    const newLogId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const logItems: LogEntry['items'] = [];

    if (appMode === 'checkout') {
      disc.normalReturn.forEach(i => logItems.push({ id: i.id, name: i.name, location: i.location, qty: i.qty, status: 'ok', value: i.value }));
      setInventory(prev => prev.map(item => {
        const cartQty = cart[item.id];
        return cartQty ? { ...item, available: item.available - cartQty } : item;
      }));
      setActiveSessions(prev => {
        const existing = prev.find(s => s.staffName === selectedStaff);
        if (existing) {
          const newItems = { ...existing.items };
          Object.entries(cart).forEach(([id, qty]) => { newItems[id] = (newItems[id] || 0) + qty; });
          return prev.map(s => s.staffName === selectedStaff ? { ...s, items: newItems } : s);
        } else { return [...prev, { staffName: selectedStaff, items: cart }]; }
      });
    }

    if (appMode === 'checkin') {
      disc.matched.forEach(i => logItems.push({ id: i.id, name: i.name, location: i.location, qty: i.qty, status: 'ok', value: i.value }));
      disc.missing.forEach(i => {
        logItems.push({ id: i.id, name: i.name, location: i.location, qty: i.qty, status: 'missing', value: i.value });
        setLostRegistry(prev => [...prev, { staffName: selectedStaff, itemId: i.id, qty: i.qty, dateLost: timestamp }]);
      });
      disc.found.forEach(i => {
        logItems.push({ id: i.id, name: i.name, location: i.location, qty: i.qty, status: 'recovered', value: i.value });
        if (i.isRecovered) setLostRegistry(prev => prev.filter(r => !(r.staffName === selectedStaff && r.itemId === i.id)));
      });

      setInventory(prev => prev.map(item => {
        const returnedQty = cart[item.id] || 0;
        return returnedQty ? { ...item, available: item.available + returnedQty } : item;
      }));

      setActiveSessions(prev => {
        return prev.map(s => {
          if (s.staffName !== selectedStaff) return s;
          const newItems = { ...s.items };
          Object.keys(cart).forEach(id => {
            if (newItems[id]) { newItems[id] -= cart[id]; if (newItems[id] <= 0) delete newItems[id]; }
          });
          return { ...s, items: newItems };
        }).filter(s => Object.keys(s.items).length > 0);
      });
    }

    const totalLiability = disc.missing.reduce((acc, i) => acc + (i.value * i.qty), 0);
    const newLog: LogEntry = { id: newLogId, timestamp, type: appMode === 'checkout' ? 'checkout' : 'return', staffName: selectedStaff, items: logItems, signature: currentSignature, totalLiability };
    setLogs(prev => [newLog, ...prev]);
    alert(`Success: ${appMode.toUpperCase()} processed for ${selectedStaff}`);
    setCart({}); setSelectedStaff(''); setStep('shop'); setCurrentSignature(null);
  };

  const renderReceiptModal = () => {
    const disc = calculateDiscrepancies();
    const isCheckin = appMode === 'checkin';
    const totalLiability = disc.missing.reduce((acc, i) => acc + (i.value * i.qty), 0);

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="bg-slate-800 text-white p-4 text-center relative">
            <h2 className="text-xl font-bold uppercase tracking-widest">{isCheckin ? 'Return Receipt' : 'Checkout Receipt'}</h2>
            <div className="text-slate-400 text-xs mt-1">{new Date().toLocaleString()}</div>
            <button onClick={() => setStep('shop')} className="absolute left-4 top-4 text-slate-400"><ChevronLeft /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 font-mono text-sm">
            <div className="mb-6 text-center">
              <label className="text-xs text-slate-500 uppercase block mb-2">Staff Member</label>

              {appMode === 'checkout' ? (
                <div className="relative">
                  <select
                    className="w-full p-3 rounded-xl border-2 border-slate-200 text-lg font-bold text-slate-800 text-center bg-white appearance-none focus:border-blue-500 focus:outline-none shadow-sm"
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                  >
                    <option value="">-- Assign to Staff --</option>
                    {STAFF_ROSTER.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                </div>
              ) : (
                <div className="text-xl font-bold text-slate-800 bg-slate-100 py-2 rounded-lg border border-slate-200">
                  {selectedStaff}
                </div>
              )}
            </div>

            <div className="border-b-2 border-slate-200 border-dashed my-4"></div>

            {(isCheckin ? disc.matched : disc.normalReturn).length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold mb-2 text-green-700">{isCheckin ? 'RETURNED ITEMS (OK)' : 'CHECKING OUT'}</h3>
                {(isCheckin ? disc.matched : disc.normalReturn).map((i: any) => (
                  <div key={i.id} className="flex justify-between mb-1">
                    <span>
                      <span className="text-slate-400 text-xs font-mono mr-1">[{i.location}]</span>
                      {i.name} <span className="text-slate-400">x{i.qty}</span>
                    </span>
                    <span className="text-slate-500">{isCheckin ? 'Restocked' : `$${i.value}`}</span>
                  </div>
                ))}
              </div>
            )}

            {disc.missing.length > 0 && (
              <div className="mb-4 bg-red-50 p-2 rounded border border-red-200">
                <h3 className="font-bold mb-2 text-red-700 flex items-center gap-2"><AlertTriangle size={14} /> MISSING / LOST</h3>
                {disc.missing.map((i: any) => (
                  <div key={i.id} className="flex justify-between mb-1 text-red-900 font-bold">
                    <span>
                      <span className="text-red-400 text-xs font-mono mr-1">[{i.location}]</span>
                      {i.name} <span className="opacity-70">x{i.qty}</span>
                    </span>
                    <span>-${(i.value * i.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {disc.found.length > 0 && (
              <div className="mb-4 bg-blue-50 p-2 rounded border border-blue-200">
                <h3 className="font-bold mb-2 text-blue-700 flex items-center gap-2"><CheckCircle size={14} /> FOUND / UNEXPECTED</h3>
                {disc.found.map((i: any) => (
                  <div key={i.id} className="flex justify-between mb-1 text-blue-900">
                    <span>
                      <span className="text-blue-400 text-xs font-mono mr-1">[{i.location}]</span>
                      {i.name} <span className="opacity-70">x{i.qty}</span>
                    </span>
                    <span className="text-xs uppercase bg-blue-200 px-1 rounded">{i.isRecovered ? 'Recovered' : 'Extra'}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-b-2 border-slate-200 border-dashed my-6"></div>

            {totalLiability > 0 && (
              <div className="flex justify-between items-center text-lg font-bold mb-6 text-red-600">
                <span className="uppercase">Liability Total</span>
                <span className="border-b-2 border-red-200">${totalLiability.toFixed(2)}</span>
              </div>
            )}

            <div className={`p-3 rounded text-xs leading-relaxed mb-4 ${totalLiability > 0 ? 'bg-red-50 text-red-800' : 'bg-slate-100 text-slate-600'}`}>
              <strong className="block mb-1">POLICY ACKNOWLEDGEMENT:</strong>
              {totalLiability > 0 ? "I acknowledge that the items listed as 'MISSING' above were not returned. I accept liability for their replacement value to be deducted from payroll." : "I confirm the above items have been transacted in the condition stated. No pending liabilities."}
            </div>

            <SignaturePad onChange={setCurrentSignature} isRequired={true} />
          </div>

          <div className="p-4 bg-white border-t">
            <button
              disabled={!currentSignature || !selectedStaff}
              onClick={handleTransactionSubmit}
              className={`w-full text-white font-bold py-4 rounded-lg shadow-lg ${totalLiability > 0 ? 'bg-red-600' : 'bg-green-600'} disabled:bg-slate-300`}
            >
              {totalLiability > 0 ? 'Accept Liability & Close' : 'Confirm Transaction'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans">

      <header className="bg-slate-900 text-white p-4 pb-2 shadow-md shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-colors"
                title="Back to Dashboard"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold leading-none">Resort Ops</h1>
              <p className="text-xs text-slate-400">Inventory Control</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button onClick={() => setShowLogsModal(true)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-slate-300 transition-colors flex items-center gap-2">
              <History size={18} />
              <span className="font-bold text-sm">Logs</span>
            </button>

            <div className="flex bg-slate-800 rounded-lg p-1">
              <button onClick={() => handleModeSwitch('checkout')} className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${appMode === 'checkout' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                <ArrowUpRight size={14} /> Out
              </button>
              <button onClick={() => handleModeSwitch('checkin')} className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${appMode === 'checkin' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                <ArrowDownLeft size={14} /> In
              </button>
            </div>

            <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg text-white shadow-lg transition-colors flex items-center gap-1">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 [&::-webkit-scrollbar]:hidden">
          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            const isActive = activeTab === dept.id;
            const activeColor = appMode === 'checkout' ? 'bg-blue-600' : 'bg-orange-600';
            return (
              <button key={dept.id} onClick={() => setActiveTab(dept.id)} className={`flex flex-col items-center gap-1 min-w-[70px] p-2 rounded-lg transition-colors ${isActive ? `${activeColor} text-white shadow-lg` : 'bg-slate-800 text-slate-400'}`}>
                <Icon size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wide">{dept.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 flex flex-col p-3 overflow-hidden relative">
        {appMode === 'checkin' && (
          <div className="mb-3 p-2 bg-orange-100 rounded-lg border border-orange-200 animate-in slide-in-from-top flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-orange-800 uppercase mb-0.5 block">Returning Staff</label>
              <select className="w-full p-1.5 rounded border-orange-200 text-sm font-bold text-slate-800 bg-white" value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
                <option value="">-- Select Staff --</option>
                {STAFF_ROSTER.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {selectedStaff && (
              <div className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded border border-orange-200 self-end mb-0.5">
                <span className="font-bold block text-[10px] uppercase">Holding</span>
                {Object.values(activeSessions.find(s => s.staffName === selectedStaff)?.items || {}).reduce((a, b) => a + b, 0)} Items
              </div>
            )}
          </div>
        )}

        <div className="relative mb-3 shrink-0">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input type="text" placeholder={`Search ${activeTab}...`} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className={`flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 content-start transition-opacity ${appMode === 'checkin' && !selectedStaff ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                quantityInCart={cart[item.id] || 0}
                onIncrement={() => incrementItem(item.id)}
                onReset={() => { setCart(prev => { const n = { ...prev }; delete n[item.id]; return n; }); }}
                onViewDetails={() => setSelectedForDetail(item)}
                appMode={appMode}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-slate-400">
              <Wrench className="mx-auto mb-2 opacity-50" size={32} />
              <p>No items found in {activeTab}</p>
            </div>
          )}
        </div>

        <div className="shrink-0 flex items-center justify-between pt-2 border-t border-slate-200 mt-2">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-3 bg-white rounded-lg shadow disabled:opacity-50"><ChevronLeft size={20} /></button>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Page {page + 1} of {totalPages || 1}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="p-3 bg-white rounded-lg shadow disabled:opacity-50"><ChevronRight size={20} /></button>
        </div>
      </main>

      {Object.values(cart).reduce((a, b) => a + b, 0) > 0 && (
        <div className="bg-white border-t p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] shrink-0 animate-in slide-in-from-bottom">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-600">{Object.values(cart).reduce((a, b) => a + b, 0)} items selected</span>
            <button onClick={() => setCart({})} className="text-xs text-red-500 font-semibold underline">Clear All</button>
          </div>
          <button onClick={() => setStep('receipt')} className={`w-full ${appMode === 'checkout' ? 'bg-blue-900' : 'bg-orange-800'} text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform`}>
            <ShoppingCart size={18} />
            {appMode === 'checkout' ? 'Review & Checkout' : 'Process Return'}
          </button>
        </div>
      )}

      {showLogsModal && <LogsModal logs={logs} onClose={() => setShowLogsModal(false)} />}
      {showItemModal && <ItemFormModal item={editingItem || undefined} isEdit={!!editingItem} onSave={handleSaveItem} onClose={() => setShowItemModal(false)} />}
      {step === 'receipt' && renderReceiptModal()}

      {/* Restored Detail Popup */}
      {selectedForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6" onClick={() => setSelectedForDetail(null)}>
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4 flex-shrink-0">
              <div className="p-4 rounded-xl" style={{ backgroundColor: selectedForDetail.color ? `${selectedForDetail.color}20` : '#f1f5f9', color: selectedForDetail.color || '#475569' }}>
                {React.createElement(selectedForDetail.icon, { size: 32 })}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg leading-tight">{selectedForDetail.name}</h2>
                <div className="flex items-center gap-1 mt-1 mb-1">
                  <StarRating rating={selectedForDetail.rating} size={20} />
                </div>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded font-bold ${selectedForDetail.available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedForDetail.available} Available
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
              <div className="text-sm border-b pb-2">
                <span className="text-slate-400 block text-xs uppercase">Description</span>
                {selectedForDetail.description || "No description provided."}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm border-b pb-2">
                  <span className="text-slate-400 block text-xs uppercase">Shelf Unit</span>
                  {selectedForDetail.unit}
                </div>
                <div className="text-sm border-b pb-2">
                  <span className="text-slate-400 block text-xs uppercase">Value</span>
                  ${selectedForDetail.value.toFixed(2)}
                </div>
              </div>

              <div className="text-sm border-b pb-2">
                <span className="text-slate-400 block text-xs uppercase">Location</span>
                <span className="font-mono bg-slate-100 px-1 rounded ml-1 flex items-center gap-1 w-fit"><MapPin size={10} /> {selectedForDetail.location}</span>
              </div>

              {/* Condition History Section */}
              <div className="text-sm border-b pb-2">
                <span className="text-slate-400 block text-xs uppercase mb-2">Condition History</span>
                <div className="bg-slate-50 border rounded-lg max-h-32 overflow-y-auto mb-2">
                  {selectedForDetail.conditionHistory.length > 0 ? (
                    selectedForDetail.conditionHistory.map(entry => (
                      <div key={entry.id} className="p-2 border-b last:border-b-0 text-xs flex justify-between items-start group">
                        <div>
                          <p className="text-slate-700">{entry.text}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(entry.timestamp).toLocaleDateString()} - {entry.author}
                          </p>
                        </div>
                        {IS_ADMIN && (
                          <button
                            onClick={() => handleDeleteNote(selectedForDetail.id, entry.id)}
                            className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-slate-400 italic text-xs">No history recorded</div>
                  )}
                </div>

                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="Add status note..."
                    className="flex-1 text-xs border rounded p-2"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote(selectedForDetail.id)}
                  />
                  <button
                    onClick={() => handleAddNote(selectedForDetail.id)}
                    className="bg-slate-800 text-white p-2 rounded hover:bg-slate-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Checked Out By Section */}
              <div>
                <span className="text-slate-400 block text-xs uppercase mb-1">Checked Out By:</span>
                <div className="flex flex-wrap gap-1">
                  {activeSessions.filter(s => s.items[selectedForDetail.id] > 0).length > 0 ? (
                    activeSessions.filter(s => s.items[selectedForDetail.id] > 0).map(s => (
                      <span key={s.staffName} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">
                        {s.staffName} (x{s.items[selectedForDetail.id]})
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No active sessions</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0 pt-2 border-t">
              <button onClick={() => openEditModal(selectedForDetail)} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                <Edit size={16} /> Edit
              </button>
              <button onClick={() => setSelectedForDetail(null)} className="flex-1 bg-slate-200 text-slate-800 font-bold py-3 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}