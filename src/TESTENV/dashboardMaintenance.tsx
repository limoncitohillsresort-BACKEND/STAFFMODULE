import React, { useState, useMemo } from 'react';
import { CheckCircle, AlertTriangle, Clipboard, Book, Home, ChevronDown, ChevronRight, Droplets, Zap, Armchair, Hammer, Utensils, Save, Printer, ChevronLeft, Plus, Image as ImageIcon, X } from 'lucide-react';
import { INITIAL_INVENTORY } from './moduleToolCheckout';

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

// We separate icons from data to prevent cloning issues
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
  },
  {
    category: "Amenities",
    item: "Washer & Dryer",
    procedure: "1. Washer: Run empty cycle with 2 cups vinegar (hot water). Clean rubber door gasket for mold (use bleach solution). Clean drain pump filter (usually bottom right). 2. Dryer: Remove lint screen and wash with soap (fabric softener clogs mesh). Vacuum out the vent hose to prevent fire risk.",
    frequency: "Quarterly"
  },
  {
    category: "Plumbing",
    item: "Water Heater (Boiler)",
    procedure: "1. Turn off gas/power. 2. Connect hose to bottom drain valve. 3. Run to exterior. 4. Open pressure relief valve and drain valve to flush out sediment buildup (extends life significantly). 5. Close valves, refill, turn power back on.",
    frequency: "Every 6 Months"
  },
  {
    category: "Building",
    item: "Efflorescence (Salty Walls)",
    procedure: "1. Identify white powdery substance on masonry. 2. Dry scrape with wire brush. 3. Wash with mild acid solution (muriatic acid diluted 1:10) if severe, or vinegar. 4. Allow to dry completely (48hrs). 5. Apply hydrophobic sealer before repainting.",
    frequency: "As Needed"
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
    <div className="fixed inset-0 z-[100] bg-slate-900/80 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
          <h2 className="font-bold">Add Checklist Entry</h2>
          <button onClick={onClose} className="hover:text-red-400"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Category</label>
            <select
              className="w-full p-2 border border-slate-200 focus:border-blue-500 outline-none rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
              <option value="NEW">-- Create New Category --</option>
            </select>
          </div>
          {category === 'NEW' && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">New Category Name</label>
              <input type="text" className="w-full p-2 border border-slate-200 focus:border-blue-500 outline-none rounded" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Component Name</label>
            <input type="text" className="w-full p-2 border border-slate-200 focus:border-blue-500 outline-none rounded" placeholder="e.g. WiFi Router" value={label} onChange={e => setLabel(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Inspection Criteria</label>
            <textarea className="w-full p-2 border border-slate-200 focus:border-blue-500 outline-none rounded" placeholder="e.g. Check speed and connectivity" value={instruction} onChange={e => setInstruction(e.target.value)}></textarea>
          </div>
          <button
            onClick={() => {
              onSave(category === 'NEW' ? newCategory : category, label, instruction);
              onClose();
            }}
            className="w-full py-2 bg-blue-600 text-white font-bold rounded mt-4 hover:bg-blue-700"
          >
            Save Entry
          </button>
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

  const activeProp = properties.find(p => p.id === selectedPropId) || properties[0];

  // Helper to handle status changes
  const handleStatusChange = (itemId, status) => {
    setStatusState(prev => ({
      ...prev,
      [`${selectedPropId}-${itemId}`]: status
    }));
  };

  const getStatus = (itemId) => statusState[`${selectedPropId}-${itemId}`] || '';

  // Filter items based on property amenities using useMemo for performance
  const filteredData = useMemo(() => {
    // Create a deep copy of the array structure, but NOT the icons
    let data = JSON.parse(JSON.stringify(checklistData));

    // Logic: Remove Pool items if no pool
    if (!activeProp.pool) {
      data.Building = data.Building.filter(i => !i.label.includes('Pool'));
      data.Amenities = data.Amenities.filter(i => !i.label.includes('Pool'));
    } else {
      // Add pool items dynamically if they don't exist in base
      data.Amenities.push({ id: 'pool1', label: 'Pool Chemicals & Pump', instruction: 'pH, Chlorine, Backwash filter.' });
      data.Amenities.push({ id: 'pool2', label: 'Patio Furniture', instruction: 'Check rattan/mesh for sun damage.' });
    }

    // Logic: Add specific Commercial items
    if (activeProp.commercial) {
      data.Amenities.push({ id: 'com1', label: 'Industrial Hood', instruction: 'Grease trap check.' });
      data.Amenities.push({ id: 'com2', label: 'Walk-in Cooler', instruction: 'Temp log, seal check.' });
    }

    // Logic: Specific logic for Beach Bathrooms (Tinacos)
    if (activeProp.tinacos) {
      data.Plumbing.push({ id: 'tina1', label: 'Roof Tinacos', instruction: 'Check float valve, lid security, sediment.' });
    }

    return data;
  }, [activeProp, checklistData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* HEADER */}
      <header className="bg-slate-900 text-white p-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-colors"
                title="Back to Dashboard"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-wider">RESORT OPS MASTER</h1>
              <p className="text-slate-400 text-sm">Seasonal Maintenance & Infrastructure Audit</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${activeTab === 'checklist' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              <Clipboard size={18} /> Checklist
            </button>
            <button
              onClick={() => setActiveTab('sop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${activeTab === 'sop' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              <Book size={18} /> SOP Manual
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto p-6">

        {/* CHECKLIST VIEW */}
        {activeTab === 'checklist' && (
          <div>
            {/* Property Selector Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                  <Home size={24} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Select Unit</label>
                  <select
                    className="bg-transparent font-bold text-lg text-slate-800 outline-none border-b-2 border-transparent focus:border-blue-500 cursor-pointer"
                    value={selectedPropId}
                    onChange={(e) => setSelectedPropId(e.target.value)}
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-right text-sm text-slate-500 md:text-left flex-1 md:flex-none">
                <p className="font-bold">{activeProp.beds}</p>
                <p>{activeProp.pool ? (activeProp.pool === 'shared' ? 'Shared Pool' : 'Private Pool') : 'No Pool'} • {activeProp.floors} Floor(s)</p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 shadow-md transition ml-auto w-full md:w-auto"
              >
                <Plus size={18} /> Add Entry
              </button>
            </div>

            {/* Checklist Tables */}
            <div className="space-y-8">
              {Object.keys(filteredData).map((catName) => {
                const items = filteredData[catName];
                if (items.length === 0) return null;

                return (
                  <div key={catName} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-100 px-6 py-4 flex items-center gap-3 border-b border-slate-200">
                      <div className="text-blue-600">
                        {categoryIcons[catName] || <CheckCircle size={20} />}
                      </div>
                      <h2 className="font-bold text-lg">{catName}</h2>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left min-w-[600px]">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                          <tr>
                            <th className="px-6 py-3 w-1/3">Component</th>
                            <th className="px-6 py-3 w-1/3">Inspection Criteria</th>
                            <th className="px-6 py-3 w-1/4">Status</th>
                            <th className="px-6 py-3">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition">
                              <td className="px-6 py-4 font-medium text-slate-700">{item.label}</td>
                              <td className="px-6 py-4 text-slate-500">{item.instruction}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                  {['Good', 'Repair', 'Replace'].map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => handleStatusChange(item.id, status)}
                                      className={`px-3 py-1 rounded-full text-xs font-bold border transition
                                        ${getStatus(item.id) === status
                                          ? (status === 'Good' ? 'bg-green-100 text-green-700 border-green-200' :
                                            status === 'Repair' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                              'bg-red-100 text-red-700 border-red-200')
                                          : 'bg-white text-slate-400 border-slate-200 hover:border-blue-300'
                                        }`}
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 align-top w-[250px]">
                                <div className="space-y-3">
                                  <input type="text" placeholder="Add note..." className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-slate-600 text-sm pb-1" />

                                  <label className="flex items-center gap-1 text-[11px] text-blue-600 cursor-pointer hover:text-blue-800 w-max font-bold tracking-wide uppercase">
                                    <ImageIcon size={14} /> Attach Map/Photo
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const url = URL.createObjectURL(file);
                                        setItemImages(prev => ({ ...prev, [item.id]: url }));
                                      }
                                    }} />
                                  </label>

                                  {itemImages[item.id] && (
                                    <img src={itemImages[item.id]} className="w-full h-24 object-cover rounded-md border border-slate-200 shadow-sm" alt="Attached note" />
                                  )}

                                  <select
                                    className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-600 outline-none focus:border-blue-500"
                                    value={materialsNeeded[item.id] || ''}
                                    onChange={(e) => setMaterialsNeeded(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  >
                                    <option value="">+ Material Needed</option>
                                    {INITIAL_INVENTORY.map(tool => (
                                      <option key={tool.id} value={tool.id}>{tool.name} (Qty: {tool.available})</option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end gap-4 pb-8">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50">
                <Printer size={18} /> Print Report
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-md">
                <Save size={18} /> Save Audit
              </button>
            </div>
          </div>
        )}

        {/* SOP MANUAL VIEW */}
        {activeTab === 'sop' && (
          <div className="animate-fade-in pb-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
              <div className="border-b border-slate-200 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">SOP & Maintenance Protocols</h2>
                <p className="text-slate-500 mt-2">Strict guidelines for inspection and repair. Deviations require manager approval.</p>
              </div>

              <div className="grid gap-6">
                {sopDatabase.map((sop, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">{sop.category}</span>
                        <h3 className="text-xl font-bold text-slate-800 mt-2">{sop.item}</h3>
                      </div>
                      <div className="text-left md:text-right mt-2 md:mt-0">
                        <span className="text-xs text-slate-400 font-semibold uppercase">Frequency</span>
                        <p className="text-sm font-medium text-slate-600">{sop.frequency}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-md text-slate-700 text-sm leading-relaxed border-l-4 border-blue-400">
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