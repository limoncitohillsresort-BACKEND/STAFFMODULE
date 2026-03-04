import React, { useState, useMemo } from 'react';
import { CheckCircle, AlertTriangle, Clipboard, Book, Home, ChevronDown, ChevronRight, Droplets, Zap, Armchair, Hammer, Utensils, Save, Printer, ChevronLeft, Plus, Image as ImageIcon, X } from 'lucide-react';

// To be safe with imports, I'll redefine INITIAL_INVENTORY here since we are refactoring.
const MOCK_INVENTORY = [
  { id: 'T001', name: 'Drill DeWalt 20V', available: 2 },
  { id: 'T002', name: 'Plumbing Snake', available: 1 },
  { id: 'M001', name: 'PVC Glue', available: 5 },
  { id: 'M002', name: 'Silicone Sealant', available: 8 },
  { id: 'E001', name: 'Wire Nuts (100pk)', available: 3 },
  { id: 'F001', name: 'AC Filter 12x12', available: 15 }
];

// --- DATA CONFIGURATION ---

const properties = [
  { id: 'h1', name: 'House 1', type: 'Luxury Villa', beds: '3BR / 6 Queen', pool: true, floors: 1, commercial: false },
  { id: 'h2', name: 'House 2', type: 'Luxury Villa', beds: '3BR / 6 Queen', pool: true, floors: 1, commercial: false },
  { id: 'h3', name: 'House 3', type: 'Luxury Villa', beds: '3BR / 4 Queen', pool: false, floors: 2, commercial: false },
  { id: 'h4', name: 'House 4', type: 'Luxury Villa', beds: '3BR / 4 Queen', pool: false, floors: 2, commercial: false },
  { id: 'h5', name: 'House 5', type: 'Luxury Villa', beds: '3BR / 5 Queen', pool: 'shared', floors: 2, commercial: false },
  { id: 'h6', name: 'House 6', type: 'Luxury Villa', beds: '3BR / 5 Queen', pool: 'shared', floors: 2, commercial: false },
  { id: 'h7', name: 'House 7', type: 'Luxury Villa', beds: '3BR / 5 Queen', pool: 'shared', floors: 2, commercial: false },
  { id: 'h8', name: 'House 8', type: 'Luxury Villa', beds: '3BR / 5 Queen', pool: 'shared', floors: 2, commercial: false },
  { id: 'h9', name: 'House 9', type: 'Bungalow', beds: '2BR / 1 King, 2 Queen', pool: false, floors: 1, commercial: false },
  { id: 'staff', name: 'Staff Accom', type: 'Dormitory', beds: '4 Apts / 32 Beds', pool: false, floors: 2, commercial: false },
  { id: 'caseta', name: 'Caseta / Security', type: 'Service', beds: 'N/A', pool: false, floors: 1, commercial: false, cctv: true },
  { id: 'bio', name: 'Biologist Lab', type: 'Service/Living', beds: '1 Dwelling', pool: false, floors: 1, commercial: false, cistern: true },
  { id: 'rest', name: 'Restaurant', type: 'Commercial', beds: 'N/A', pool: false, floors: 1, commercial: true },
  { id: 'beach', name: 'Beach Bathrooms', type: 'Public Facility', beds: 'N/A', pool: false, floors: 1, commercial: false, tinacos: true },
];

const categoryIcons = {
  Electricity: <Zap size={20} />,
  Plumbing: <Droplets size={20} />,
  Furnishings: <Armchair size={20} />,
  Building: <Hammer size={20} />,
  Amenities: <Utensils size={20} />
};

const baseChecklistData = {
  Electricity: [
    { id: 'e1', label: 'Outlets & Plates', instruction: 'Check tension, burn marks, voltage.' },
    { id: 'e2', label: 'Light Switches', instruction: 'Tactile click, dimmer function.' },
    { id: 'e3', label: 'Electrical Panel & Breakers', instruction: 'Thermal scan, tighten lugs, label check.' },
    { id: 'e4', label: 'Lighting Fixtures & Bulbs', instruction: 'Uniform color temp, clean glass.' },
    { id: 'e5', label: 'AC Units (Filters & Gas)', instruction: 'Clean filters, check delta T.' },
    { id: 'e6', label: 'Roof Compressors', instruction: 'Vibration pads, coil cleaning.' },
    { id: 'e7', label: 'Ceiling Fans', instruction: 'Wobble check, clean blades, speed test.' },
    { id: 'e8', label: 'Internet / Antenna', instruction: 'Speed test, cable corrosion check.' },
  ],
  Plumbing: [
    { id: 'p1', label: 'Faucets & Aerators', instruction: 'Flow rate, remove calcium.' },
    { id: 'p2', label: 'Shower Heads', instruction: 'Vinegar soak, silicone nozzle check.' },
    { id: 'p3', label: 'Under Sink (P-Traps)', instruction: 'Leak check, moisture detection.' },
    { id: 'p4', label: 'Toilets (Internals & Seal)', instruction: 'Flapper seal, fill valve stop point.' },
    { id: 'p5', label: 'Water Heater / Boiler', instruction: 'Flush sediment, check gas lines.' },
    { id: 'p6', label: 'Water Filtration & Pumps', instruction: 'Change filters, pressure check.' },
    { id: 'p7', label: 'Sewage / Septic / Drains', instruction: 'Flow test, smell check, bio-tabs.' },
    { id: 'p8', label: 'Exterior Cisterns/Mains', instruction: 'Float valve check, lid seal.' },
  ],
  Furnishings: [
    { id: 'f1', label: 'Sofas & Upholstery', instruction: 'Steam clean, check frame stability.' },
    { id: 'f2', label: 'Woodwork & Closets', instruction: 'Treat wood, check for termites/mold.' },
    { id: 'f3', label: 'Hinges, Rails & Soft Close', instruction: 'Lubricate, align doors.' },
    { id: 'f4', label: 'Windows & Sliding Doors', instruction: 'Track cleaning, roller lubrication.' },
    { id: 'f5', label: 'Door Locks & Handles', instruction: 'Graphite lube, strike plate align.' },
    { id: 'f6', label: 'Kitchen Cabinets (Upper/Lower)', instruction: 'Hinge torque, shelf stability.' },
    { id: 'f7', label: 'Bed Frames & Headboards', instruction: 'Tighten bolts, check slats.' },
  ],
  Building: [
    { id: 'b1', label: 'Walls & Paint', instruction: 'Patch dings, touch up paint.' },
    { id: 'b2', label: 'Efflorescence & Humidity', instruction: 'Scrape, seal, repaint breathable.' },
    { id: 'b3', label: 'Floor Tiles & Grout', instruction: 'Tap test for hollows, seal grout.' },
    { id: 'b4', label: 'Roof: Waterproofing', instruction: 'Check membrane, acrylic coat condition.' },
    { id: 'b5', label: 'Roof: Tiles & Drains', instruction: 'Clear debris, check cracked tiles.' },
    { id: 'b6', label: 'Perimeter & Paths', instruction: 'Weed removal, trip hazard check.' },
  ],
  Amenities: [
    { id: 'a1', label: 'Kitchen Equipment Count', instruction: 'Inventory vs Standard List.' },
    { id: 'a2', label: 'Fridge & Freezer', instruction: 'Seal check, coil vacuum, temp check.' },
    { id: 'a3', label: 'TV & Remotes', instruction: 'Battery change, channel scan.' },
    { id: 'a4', label: 'Linens (Bed & Bath)', instruction: 'Stain/Tear review, thread count check.' },
    { id: 'a5', label: 'Washer / Dryer', instruction: 'Lint trap clear, drum clean cycle.' },
    { id: 'a6', label: 'BBQ Grill', instruction: 'Deep clean grates, gas leak test.' },
  ]
};

const sopDatabase = [
  {
    category: "Plumbing",
    item: "Shower Heads & Faucets",
    procedure: "1. Unscrew shower head or aerator. 2. Disassemble rubber gaskets carefully. 3. Submerge metal parts in 50/50 white vinegar/water solution for 2 hours (dissolves calcium). 4. Use a stiff nylon brush to scrub nozzles. 5. Reapply Teflon tape to threads before re-installing. 6. Test for even spray pattern.",
    frequency: "Every 3 Months"
  },
  {
    category: "Electricity",
    item: "AC Units (Mini-Splits & Roof)",
    procedure: "1. Turn off breaker. 2. Indoor: Open lid, remove mesh filters, wash with antibacterial soap, air dry. 3. Sanitize evaporator coils with foam cleaner. 4. Roof: Spray down condenser coils with water (low pressure) to remove salt/dust. 5. Inspect insulation on copper lines. 6. Turn on and measure output temperature (should be 15-20°F cooler than room temp).",
    frequency: "Monthly Filters / Quarterly Deep Clean"
  },
  {
    category: "Furnishings",
    item: "Sliding Glass Doors (PVC/Alum)",
    procedure: "1. Vacuum the track thoroughly to remove sand/dirt. 2. Inspect weep holes for blockages (critical for rain). 3. Check locking mechanism alignment. 4. Clean glass with squeegee. 5. Apply silicone-based lubricant to the rollers (do NOT use WD-40 as it attracts dirt).",
    frequency: "Monthly"
  },
  {
    category: "Building",
    item: "Roof Waterproofing & Drains",
    procedure: "1. Sweep entire roof surface. 2. Inspect 'Bajadas' (drains) for leaf blockage. 3. Inspect impermeabilizante (white sealant) for bubbling or cracks. 4. If cracked: scrape loose material, apply mesh, apply 2 coats of sealant. 5. Check mounting points of ACs/Antennas for sealant integrity.",
    frequency: "Pre-Rainy Season & Post-Storm"
  }
];

// --- APP COMPONENT ---

const AddEntryModal = ({ isOpen, onClose, onSave, categories }: any) => {
  const [category, setCategory] = useState(categories[0] || 'NEW');
  const [newCategory, setNewCategory] = useState('');
  const [label, setLabel] = useState('');
  const [instruction, setInstruction] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg leading-tight">Add Checklist Entry</h2>
            <p className="text-xs text-slate-400 font-medium">Create a new inspection protocol</p>
          </div>
          <button onClick={onClose} className="hover:text-red-400 transition-colors p-1"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
            <select
              className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg text-sm font-medium text-slate-700 transition"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
              <option value="NEW">-- Create New Category --</option>
            </select>
          </div>
          {category === 'NEW' && (
            <div className="animate-fade-in">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">New Category Name</label>
              <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg text-sm transition" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="e.g. Landscaping" />
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Component Name</label>
            <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg text-sm transition" placeholder="e.g. WiFi Router" value={label} onChange={e => setLabel(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Inspection Criteria</label>
            <textarea className="w-full p-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg text-sm transition leading-relaxed min-h-[80px]" placeholder="e.g. Check speed and connectivity" value={instruction} onChange={e => setInstruction(e.target.value)}></textarea>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                onSave(category === 'NEW' ? newCategory : category, label, instruction);
                onClose();
              }}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow flex items-center justify-center gap-2 transition"
            >
              <Save size={18} /> Save Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MaintenanceApp({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('checklist'); // checklist, sop
  const [selectedPropId, setSelectedPropId] = useState('h1');
  const [statusState, setStatusState] = useState<Record<string, string>>({});
  const [checklistData, setChecklistData] = useState(baseChecklistData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [materialsNeeded, setMaterialsNeeded] = useState<Record<string, string>>({});
  const [itemImages, setItemImages] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const activeProp = properties.find(p => p.id === selectedPropId) || properties[0];

  const handleStatusChange = (itemId: string, status: string) => {
    setStatusState(prev => ({
      ...prev,
      [`${selectedPropId}-${itemId}`]: status
    }));
  };

  const getStatus = (itemId: string) => statusState[`${selectedPropId}-${itemId}`] || '';

  const filteredData = useMemo(() => {
    let data = JSON.parse(JSON.stringify(checklistData));

    if (!activeProp.pool) {
      if (data.Building) data.Building = data.Building.filter((i: any) => !i.label.includes('Pool'));
      if (data.Amenities) data.Amenities = data.Amenities.filter((i: any) => !i.label.includes('Pool'));
    } else {
      if (!data.Amenities) data.Amenities = [];
      data.Amenities.push({ id: 'pool1', label: 'Pool Chemicals & Pump', instruction: 'pH, Chlorine, Backwash filter.' });
      data.Amenities.push({ id: 'pool2', label: 'Patio Furniture', instruction: 'Check rattan/mesh for sun damage.' });
    }

    if (activeProp.commercial) {
      if (!data.Amenities) data.Amenities = [];
      data.Amenities.push({ id: 'com1', label: 'Industrial Hood', instruction: 'Grease trap check.' });
      data.Amenities.push({ id: 'com2', label: 'Walk-in Cooler', instruction: 'Temp log, seal check.' });
    }

    if (activeProp.tinacos) {
      if (!data.Plumbing) data.Plumbing = [];
      data.Plumbing.push({ id: 'tina1', label: 'Roof Tinacos', instruction: 'Check float valve, lid security, sediment.' });
    }

    return data;
  }, [activeProp, checklistData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* HEADER */}
      <header className="bg-slate-900 text-white p-4 sm:p-6 shadow-md sticky top-0 z-40 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-colors shrink-0"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wide leading-tight flex items-center gap-2"><Hammer size={18} className="text-blue-400" /> MAINTENANCE</h1>
              <p className="text-slate-400 text-xs sm:text-sm">Operations & Infrastructure Audit</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded transition ${activeTab === 'checklist' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              <Clipboard size={16} /> Audit
            </button>
            <button
              onClick={() => setActiveTab('sop')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded transition ${activeTab === 'sop' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              <Book size={16} /> SOPs
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 pb-24">

        {/* CHECKLIST VIEW */}
        {activeTab === 'checklist' && (
          <div className="animate-fade-in">
            {/* Property Selector Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 shrink-0">
                  <Home size={28} />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location / Unit</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 p-2 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={selectedPropId}
                    onChange={(e) => setSelectedPropId(e.target.value)}
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-4 w-full md:w-auto text-sm">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Capacity</span>
                  <span className="font-semibold text-slate-700">{activeProp.beds}</span>
                </div>
                <div className="hidden sm:block w-px bg-slate-200"></div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Amenities</span>
                  <span className="font-semibold text-slate-700">{activeProp.pool ? (activeProp.pool === 'shared' ? 'Shared Pool' : 'Private Pool') : 'No Pool'} • {activeProp.floors} Fl.</span>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-700 shadow-sm transition shrink-0"
              >
                <Plus size={18} /> Add Entry
              </button>
            </div>

            {/* Responsive Checklist Cards */}
            <div className="space-y-6">
              {Object.keys(filteredData).map((catName) => {
                const items = filteredData[catName];
                if (items.length === 0) return null;

                return (
                  <div key={catName} className="bg-slate-100/50 rounded-2xl border border-slate-200/60 overflow-hidden">
                    <div className="bg-white px-5 py-3 flex items-center justify-between border-b border-slate-200 sticky top-[72px] sm:top-[88px] z-20 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                          {categoryIcons[catName] || <CheckCircle size={18} />}
                        </div>
                        <h2 className="font-bold text-base sm:text-lg tracking-wide">{catName}</h2>
                      </div>
                      <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{items.length} items</span>
                    </div>

                    <div className="p-3 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((item: any) => {
                        const status = getStatus(item.id);
                        const isGood = status === 'Good';
                        const isWarning = status === 'Repair' || status === 'Replace';

                        return (
                          <div key={item.id} className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-4 transition-all duration-200 relative overflow-hidden group ${isGood ? 'border-green-300 bg-green-50/20' : isWarning ? 'border-orange-300 bg-orange-50/20' : 'border-slate-200 hover:border-blue-300'
                            }`}>
                            {/* Status Indicator Band */}
                            <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${isGood ? 'bg-green-500' : isWarning ? 'bg-orange-500' : 'bg-transparent group-hover:bg-blue-300'
                              }`}></div>

                            {/* Header */}
                            <div>
                              <h3 className="font-bold text-slate-800 text-sm">{item.label}</h3>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">{item.instruction}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-3 gap-2">
                              {['Good', 'Repair', 'Replace'].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(item.id, s)}
                                  className={`py-1.5 rounded-md text-[11px] font-bold border transition
                                        ${getStatus(item.id) === s
                                      ? (s === 'Good' ? 'bg-green-100 text-green-700 border-green-300 shadow-inner' :
                                        s === 'Repair' ? 'bg-orange-100 text-orange-700 border-orange-300 shadow-inner' :
                                          'bg-red-100 text-red-700 border-red-300 shadow-inner')
                                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>

                            {/* Notes & Expandable Area */}
                            <div className="mt-auto flex flex-col gap-2 pt-2 border-t border-slate-100">
                              <input
                                type="text"
                                placeholder="Add resolution note..."
                                className="w-full bg-slate-50 border border-slate-200 rounded p-2 outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-xs transition"
                                value={notes[item.id] || ''}
                                onChange={(e) => setNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                              />

                              <div className="flex gap-2">
                                <select
                                  className="flex-1 text-[11px] p-2 bg-slate-50 border border-slate-200 rounded text-slate-600 outline-none focus:border-blue-500 font-medium"
                                  value={materialsNeeded[item.id] || ''}
                                  onChange={(e) => setMaterialsNeeded(prev => ({ ...prev, [item.id]: e.target.value }))}
                                >
                                  <option value="">+ Material</option>
                                  {MOCK_INVENTORY.map(tool => (
                                    <option key={tool.id} value={tool.id}>{tool.name}</option>
                                  ))}
                                </select>

                                <label className="shrink-0 flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 rounded p-2 cursor-pointer transition" title="Attach Photo">
                                  <ImageIcon size={14} />
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const url = URL.createObjectURL(file);
                                      setItemImages(prev => ({ ...prev, [item.id]: url }));
                                    }
                                  }} />
                                </label>
                              </div>

                              {itemImages[item.id] && (
                                <div className="relative mt-2 rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-video">
                                  <img src={itemImages[item.id]} className="w-full h-full object-cover" alt="Attached evidence" />
                                  <button
                                    onClick={() => {
                                      const newArr = { ...itemImages };
                                      delete newArr[item.id];
                                      setItemImages(newArr);
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pb-safe">
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition w-full sm:w-auto">
                <Printer size={18} /> Print PDF
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition w-full sm:w-auto">
                <Save size={18} /> Submit Audit
              </button>
            </div>
          </div>
        )}

        {/* SOP MANUAL VIEW */}
        {activeTab === 'sop' && (
          <div className="animate-fade-in pb-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="border-b border-slate-200 pb-5 mb-6 text-center sm:text-left">
                <h2 className="text-2xl font-black text-slate-800">SOP & Maintenance Protocols</h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">Strict guidelines for inspection and repair. Deviations require manager approval.</p>
              </div>

              <div className="grid gap-5">
                {sopDatabase.map((sop, idx) => (
                  <div key={idx} className="border border-slate-200 bg-slate-50 rounded-xl p-5 hover:border-blue-300 transition-colors group">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">{sop.category}</span>
                        <h3 className="text-lg font-bold text-slate-800 mt-3">{sop.item}</h3>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto bg-white p-2 rounded-lg border border-slate-200 sm:border-transparent sm:bg-transparent sm:p-0">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">Frequency</span>
                        <p className="text-xs font-bold text-slate-700">{sop.frequency}</p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-slate-600 text-sm leading-relaxed border border-slate-200 shadow-sm">
                      {sop.procedure}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      <AddEntryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={Object.keys(checklistData)}
        onSave={(cat: string, label: string, instruction: string) => {
          setChecklistData(prev => {
            const newData: Record<string, any[]> = { ...prev };
            if (!newData[cat]) newData[cat] = [];
            newData[cat].push({ id: `new-${Date.now()}`, label, instruction });
            return newData as any;
          });
        }}
      />
    </div>
  );
}