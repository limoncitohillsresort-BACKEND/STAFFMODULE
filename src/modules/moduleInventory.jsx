import React, { useState } from 'react';
import { Package, Search, Plus, MapPin, AlertTriangle, ArrowRight, Home, Settings, ShoppingCart, ChevronDown, ChevronRight, Hash, ChevronLeft, UploadCloud, Edit2 } from 'lucide-react';

const CATEGORIES = [
   { id: 'kitchen', name: 'Kitchen & Dining', icon: ShoppingCart, color: 'text-orange-500' },
   { id: 'linens', name: 'Linens & Bedding', icon: Home, color: 'text-indigo-500' },
   { id: 'electronics', name: 'Electronics & Media', icon: Settings, color: 'text-blue-500' },
   { id: 'infrastructure', name: 'Infrastructure Assets', icon: MapPin, color: 'text-slate-500' }
];

const INITIAL_INVENTORY = [
   { id: 'inv1', sku: 'KT-BLN-01', name: 'Oster Blender', category: 'kitchen', location: 'Villa 1', qty: 1, minStock: 1, condition: 'Good', notes: 'Motor runs loud', price: 45.00, vendor: 'Amazon MX' },
   { id: 'inv2', sku: 'KT-PLS-12', name: 'Ceramic Plates (Set of 12)', category: 'kitchen', location: 'Villa 1', qty: 10, minStock: 12, condition: 'Missing Parts', notes: '2 plates broken by guest in June', price: 60.00, vendor: 'Liverpool' },
   { id: 'inv3', sku: 'LN-TWL-WH', name: 'White Bath Towel (Egyptian Cotton)', category: 'linens', location: 'Warehouse A', qty: 145, minStock: 150, condition: 'New', notes: 'Bleach stains on 5', price: 15.00, vendor: 'HotelSupplies Group' },
   { id: 'inv4', sku: 'EL-TV-55', name: 'Samsung 55" Smart TV', category: 'electronics', location: 'Villa 2', qty: 1, minStock: 1, condition: 'Good', notes: 'Remote batteries need changing', price: 400.00, vendor: 'Costco' },
   { id: 'inv5', sku: 'IN-PMP-1HP', name: '1HP Water Pump', category: 'infrastructure', location: 'Cistern 1', qty: 2, minStock: 2, condition: 'Good', notes: 'Replaced stator in 2024', price: 120.00, vendor: 'Home Depot' },
];

const ReceiptScannerModal = ({ isOpen, onClose }) => {
   const [scanning, setScanning] = useState(false);
   const [result, setResult] = useState(null);

   if (!isOpen) return null;

   const simulateScan = () => {
      setScanning(true);
      setTimeout(() => {
         setScanning(false);
         setResult([
            { sku: 'AUTO-01', name: 'Kirkland Paper Towels (12x)', qty: 2, price: 35.50 },
            { sku: 'AUTO-02', name: 'Windex Glass Cleaner 1 Gal', qty: 1, price: 18.20 }
         ]);
      }, 2500);
   };

   return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 flex justify-center items-center p-4">
         <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
               <h2 className="font-bold flex items-center gap-2"><UploadCloud size={18} /> Auto-Ingest Receipt (n8n OCR)</h2>
               <button onClick={onClose} className="hover:text-red-400">&times;</button>
            </div>

            <div className="p-6">
               {!result ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition" onClick={simulateScan}>
                     {scanning ? (
                        <div className="text-blue-600 animate-pulse flex flex-col items-center">
                           <UploadCloud size={48} className="mb-4" />
                           <p className="font-bold">Analyzing with Vision AI...</p>
                           <p className="text-xs text-slate-500 mt-2">Triggering n8n receipt webhook</p>
                        </div>
                     ) : (
                        <div className="text-slate-400 flex flex-col items-center">
                           <Camera size={48} className="mb-4" />
                           <p className="font-bold text-slate-600">Click to Upload Photo or PDF</p>
                           <p className="text-xs mt-2">Extracts line items, pricing, and updates stock.</p>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="space-y-4">
                     <div className="bg-green-50 text-green-700 p-3 flex items-center gap-2 rounded border border-green-200 font-bold text-sm">
                        <CheckCircle size={16} /> Successfully extracted 2 items.
                     </div>
                     <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-slate-100 text-slate-500">
                              <tr><th className="p-2">Name</th><th className="p-2">Qty</th><th className="p-2">Unit Price</th></tr>
                           </thead>
                           <tbody>
                              {result.map((r, i) => (
                                 <tr key={i} className="border-t">
                                    <td className="p-2 font-bold text-slate-700">{r.name}</td>
                                    <td className="p-2">{r.qty}</td>
                                    <td className="p-2">${r.price.toFixed(2)}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                     <button className="w-full bg-blue-600 text-white font-bold py-2 rounded shadow hover:bg-blue-700 transition" onClick={() => { onClose(); setResult(null); }}>Import to Master Database</button>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default function ModuleInventory({ onBack }) {
   const [inventory, setInventory] = useState(INITIAL_INVENTORY);
   const [expandedCategories, setExpandedCategories] = useState(['kitchen', 'linens']);
   const [searchQuery, setSearchQuery] = useState('');
   const [isScannerOpen, setIsScannerOpen] = useState(false);

   const toggleCategory = (catId) => {
      if (expandedCategories.includes(catId)) setExpandedCategories(expandedCategories.filter(id => id !== catId));
      else setExpandedCategories([...expandedCategories, catId]);
   };

   const filteredInventory = inventory.filter(i =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchQuery.toLowerCase())
   );

   return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
         <header className="bg-slate-900 text-white p-4 shadow-md shrink-0 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-3">
                  {onBack && (
                     <button onClick={onBack} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition">
                        <ChevronLeft size={20} />
                     </button>
                  )}
                  <div>
                     <h1 className="text-lg font-bold leading-none">Global Property Inventory</h1>
                     <p className="text-xs text-slate-400">Assets, Stock, Procurements & Dependencies</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     <input
                        type="text"
                        placeholder="Search SKU or name..."
                        className="w-full bg-slate-800 text-white placeholder-slate-400 text-sm rounded-full pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
                  <button onClick={() => setIsScannerOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 shadow whitespace-nowrap">
                     <UploadCloud size={14} /> Invoice OCR
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 shadow whitespace-nowrap">
                     <Plus size={14} /> Add Asset
                  </button>
               </div>
            </div>
         </header>

         <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
               {CATEGORIES.map(cat => {
                  const catItems = filteredInventory.filter(i => i.category === cat.id);
                  const isExpanded = expandedCategories.includes(cat.id);

                  if (searchQuery && catItems.length === 0) return null;

                  return (
                     <div key={cat.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        {/* Accordion Header */}
                        <button
                           onClick={() => toggleCategory(cat.id)}
                           className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition border-b border-slate-200"
                        >
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full bg-white shadow flex items-center justify-center ${cat.color}`}>
                                 <cat.icon size={16} />
                              </div>
                              <h2 className="font-bold text-slate-800 text-lg">{cat.name}</h2>
                              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{catItems.length} items</span>
                           </div>
                           <div className="text-slate-400">
                              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                           </div>
                        </button>

                        {/* Accordion Body */}
                        {isExpanded && (
                           <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm min-w-[800px]">
                                 <thead className="bg-white text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                                    <tr>
                                       <th className="px-4 py-3 w-16">SKU</th>
                                       <th className="px-4 py-3">Asset Name</th>
                                       <th className="px-4 py-3 w-32">Location Pin</th>
                                       <th className="px-4 py-3 w-24 text-center">Stock / Min</th>
                                       <th className="px-4 py-3 w-28 text-center">Condition</th>
                                       <th className="px-4 py-3">Vendor / Notes</th>
                                       <th className="px-4 py-3 w-16 text-right">Actions</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                    {catItems.length === 0 ? (
                                       <tr><td colSpan="7" className="p-4 text-center text-slate-400 italic">No assets found in this category.</td></tr>
                                    ) : (
                                       catItems.map(item => (
                                          <tr key={item.id} className="hover:bg-slate-50 transition group">
                                             <td className="px-4 py-3 font-mono text-[10px] text-slate-400"><Hash size={10} className="inline" /> {item.sku}</td>
                                             <td className="px-4 py-3 font-bold text-slate-700">{item.name}</td>
                                             <td className="px-4 py-3">
                                                <button className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition max-w-full">
                                                   <MapPin size={12} className="shrink-0" /> <span className="truncate">{item.location}</span>
                                                </button>
                                             </td>
                                             <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                   <span className={`font-black text-lg ${item.qty < item.minStock ? 'text-red-500' : 'text-slate-800'}`}>{item.qty}</span>
                                                   <span className="text-slate-400 text-xs">/ {item.minStock}</span>
                                                </div>
                                                {item.qty < item.minStock && <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest block mt-0.5">Deficit</span>}
                                             </td>
                                             <td className="px-4 py-3">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-center block ${item.condition === 'Good' || item.condition === 'New' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.condition}</span>
                                             </td>
                                             <td className="px-4 py-3 text-[11px]">
                                                <span className="font-bold text-slate-600 block mb-0.5">{item.vendor}</span>
                                                <span className="text-slate-400 line-clamp-2" title={item.notes}>{item.notes}</span>
                                             </td>
                                             <td className="px-4 py-3 text-right">
                                                <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 size={16} /></button>
                                             </td>
                                          </tr>
                                       ))
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>

            <div className="lg:w-80 w-full shrink-0 space-y-4">
               {/* Global Alerts widget */}
               <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={64} className="text-red-600" /></div>
                  <h3 className="font-bold text-red-800 text-sm mb-3 relative z-10 flex items-center gap-2"><AlertTriangle size={16} /> Low Stock Alerts</h3>
                  <div className="space-y-2 relative z-10">
                     {filteredInventory.filter(i => i.qty < i.minStock).map(item => (
                        <div key={item.id} className="bg-white p-2 rounded shadow-sm border border-red-100 flex justify-between items-center text-xs">
                           <span className="font-bold text-slate-700 max-w-[150px] truncate">{item.name}</span>
                           <div className="text-red-500 font-bold bg-red-100 px-2 py-0.5 rounded">{item.qty} / {item.minStock}</div>
                        </div>
                     ))}
                  </div>
                  <button className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded shadow-sm transition">Generate Purchase Order</button>
               </div>

               {/* Minimap widget mock */}
               <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700">
                  <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                     <h3 className="font-bold text-sm text-white flex items-center gap-2"><MapPin size={16} className="text-blue-400" /> Interactive Map</h3>
                  </div>
                  <div className="h-48 bg-slate-900 relative flex items-center justify-center p-4">
                     {/* Faux map representation */}
                     <div className="absolute inset-4 border-2 border-slate-700 rounded-lg"></div>
                     <div className="absolute top-[20%] left-[30%] w-12 h-16 border-2 border-slate-600 bg-slate-800 flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse"></div>
                     </div>
                     <div className="absolute bottom-[20%] right-[20%] w-20 h-10 border-2 border-slate-600 bg-slate-800"></div>
                     <p className="text-[10px] text-slate-500 uppercase tracking-widest relative z-10 bottom-[-80px]">Select an asset to locate</p>
                  </div>
               </div>
            </div>
         </main>

         <ReceiptScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
      </div>
   );
}
