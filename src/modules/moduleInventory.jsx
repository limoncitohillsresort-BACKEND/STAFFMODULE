import React, { useState, useRef } from 'react';
import { Package, Search, Plus, MapPin, AlertTriangle, ArrowRight, Home, Settings, ShoppingCart, ChevronDown, ChevronRight, Hash, ChevronLeft, UploadCloud, Edit2, Save, X, ImageIcon, DownloadCloud, FileText } from 'lucide-react';

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
                           <UploadCloud size={48} className="mb-4" />
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
                     <button className="w-full bg-blue-600 text-white font-bold py-3 rounded shadow hover:bg-blue-700 transition" onClick={() => { onClose(); setResult(null); }}>Import to Master Database</button>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

// UI Standardized Add Asset Modal
const AddAssetModal = ({ isOpen, onClose, onSave }) => {
   const [formData, setFormData] = useState({ sku: '', name: '', category: 'kitchen', location: '', qty: 1, minStock: 1, condition: 'New', notes: '', price: 0, vendor: '' });

   if (!isOpen) return null;

   const handleSubmit = e => {
      e.preventDefault();
      onSave({ ...formData, id: 'inv' + Date.now() });
      onClose();
   };

   return (
      <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
         <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
               <h3 className="font-bold flex items-center gap-2">
                  <Plus size={18} /> Add New Asset
               </h3>
               <button onClick={onClose} className="hover:text-red-400 transition"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU</label>
                     <input required type="text" className="w-full p-2 border rounded outline-none focus:border-blue-500 transition" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asset Name</label>
                     <input required type="text" className="w-full p-2 border rounded outline-none focus:border-blue-500 transition" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                     <select className="w-full p-2 border rounded outline-none focus:border-blue-500 transition" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                     <input required type="text" className="w-full p-2 border rounded outline-none focus:border-blue-500 transition" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                     <input required type="number" className="w-full p-2 border rounded outline-none focus:border-blue-500 transition" value={formData.qty} onChange={e => setFormData({ ...formData, qty: parseInt(e.target.value) })} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Min. Stock</label>
                     <input required type="number" className="w-full p-2 border rounded outline-none focus:border-blue-500 transition" value={formData.minStock} onChange={e => setFormData({ ...formData, minStock: parseInt(e.target.value) })} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Condition</label>
                     <select className="w-full p-2 border rounded outline-none focus:border-blue-500 transition" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                        <option value="New">New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                        <option value="Broken">Broken</option>
                        <option value="Missing Parts">Missing Parts</option>
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unit Price ($)</label>
                     <input required type="number" step="0.01" className="w-full p-2 border rounded outline-none focus:border-blue-500 transition" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vendor / Supplier</label>
                     <input type="text" className="w-full p-2 border rounded outline-none focus:border-blue-500 transition" value={formData.vendor} onChange={e => setFormData({ ...formData, vendor: e.target.value })} />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notes</label>
                  <textarea className="w-full p-2 border rounded outline-none focus:border-blue-500 transition text-sm" rows={2} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>
               </div>
            </form>
            <div className="p-4 bg-slate-50 border-t">
               <button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-md">
                  <Save size={18} /> Add to Global Inventory
               </button>
            </div>
         </div>
      </div>
   );
};
// UI Standardized Item Details & Location Modal
const ItemDetailsModal = ({ isOpen, onClose, item, onSaveEdit, uploadedMap, onMapUpload }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [editData, setEditData] = useState(null);

   // Sync edit data when item changes
   React.useEffect(() => {
      if (item) setEditData({ ...item });
      setIsEditing(false);
   }, [item]);

   if (!isOpen || !item || !editData) return null;

   const handleSave = () => {
      onSaveEdit(editData);
      setIsEditing(false);
   };

   return (
      <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
         <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
               <h3 className="font-bold flex items-center gap-2">
                  <Package size={18} /> Asset Details & Location
               </h3>
               <button onClick={onClose} className="hover:text-red-400 transition"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
               {/* Details Panel */}
               <div className="md:w-1/2 p-6 border-r border-slate-200 space-y-4">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        {isEditing ? (
                           <input type="text" className="w-full font-bold text-xl text-slate-800 border-b-2 border-blue-500 outline-none pb-1" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                        ) : (
                           <h2 className="text-2xl font-black text-slate-800 leading-tight">{item.name}</h2>
                        )}
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{item.sku} • {item.category}</p>
                     </div>
                     {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg transition">
                           <Edit2 size={16} />
                        </button>
                     )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Quantity</label>
                        {isEditing ? (
                           <input type="number" className="w-full text-lg font-black bg-transparent outline-none border-b border-blue-300" value={editData.qty} onChange={e => setEditData({ ...editData, qty: parseInt(e.target.value) })} />
                        ) : (
                           <div className={`text-lg font-black ${item.qty < item.minStock ? 'text-red-600' : 'text-slate-700'}`}>{item.qty} <span className="text-xs text-slate-400 font-normal">/ {item.minStock} min</span></div>
                        )}
                     </div>
                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Location</label>
                        {isEditing ? (
                           <input type="text" className="w-full font-bold text-slate-700 bg-transparent outline-none border-b border-blue-300" value={editData.location} onChange={e => setEditData({ ...editData, location: e.target.value })} />
                        ) : (
                           <div className="font-bold text-slate-700 truncate" title={item.location}>{item.location}</div>
                        )}
                     </div>
                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Condition</label>
                        {isEditing ? (
                           <select className="w-full font-bold text-slate-700 bg-transparent outline-none border-b border-blue-300" value={editData.condition} onChange={e => setEditData({ ...editData, condition: e.target.value })}>
                              <option value="New">New</option><option value="Good">Good</option><option value="Fair">Fair</option><option value="Poor">Poor</option><option value="Broken">Broken</option><option value="Missing Parts">Missing Parts</option>
                           </select>
                        ) : (
                           <div className={`text-sm font-bold ${item.condition === 'Good' || item.condition === 'New' ? 'text-green-600' : 'text-red-500'}`}>{item.condition}</div>
                        )}
                     </div>
                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Price</label>
                        {isEditing ? (
                           <input type="number" step="0.01" className="w-full font-bold text-slate-700 bg-transparent outline-none border-b border-blue-300" value={editData.price} onChange={e => setEditData({ ...editData, price: parseFloat(e.target.value) })} />
                        ) : (
                           <div className="font-bold text-slate-700">${item.price?.toFixed(2) || '0.00'}</div>
                        )}
                     </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <label className="text-[10px] font-bold text-slate-400 uppercase">Vendor</label>
                     {isEditing ? (
                        <input type="text" className="w-full text-sm font-medium text-slate-700 bg-transparent outline-none border-b border-blue-300" value={editData.vendor} onChange={e => setEditData({ ...editData, vendor: e.target.value })} />
                     ) : (
                        <div className="text-sm font-medium text-slate-700">{item.vendor || 'N/A'}</div>
                     )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase">Notes</label>
                     {isEditing ? (
                        <textarea className="w-full text-sm text-slate-600 bg-transparent outline-none border border-blue-300 rounded p-1 mt-1" rows={3} value={editData.notes} onChange={e => setEditData({ ...editData, notes: e.target.value })}></textarea>
                     ) : (
                        <p className="text-sm text-slate-600 mt-1">{item.notes || 'No operational notes provided.'}</p>
                     )}
                  </div>

                  {isEditing && (
                     <div className="pt-4 flex gap-3">
                        <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition">Cancel</button>
                        <button onClick={handleSave} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-md">
                           <Save size={16} /> Save Changes
                        </button>
                     </div>
                  )}
               </div>

               {/* Map Panel */}
               <div className="md:w-1/2 bg-slate-900 flex flex-col relative">
                  <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-slate-700 shadow-lg">
                     <div className="flex items-center gap-2 text-white">
                        <MapPin size={16} className="text-blue-400" />
                        <span className="text-sm font-bold">Property Floor Plan</span>
                     </div>
                     <label className="cursor-pointer text-xs font-bold bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-white transition flex items-center gap-1.5 shadow">
                        <UploadCloud size={14} /> Update Map
                        <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={onMapUpload} />
                     </label>
                  </div>
                  <div className="flex-1 relative flex items-center justify-center p-4 bg-slate-900 overflow-hidden group min-h-[300px]">
                     {uploadedMap ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                           <img src={uploadedMap} alt="Floor Plan" className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition duration-500 cursor-crosshair" />
                           {/* Floating mock pin */}
                           <div className="absolute top-[40%] left-[50%] animate-bounce cursor-pointer">
                              <div className="w-6 h-6 bg-red-500 rounded-t-full rounded-b-full rounded-br-none rotate-[-45deg] flex items-center justify-center shadow-lg border-2 border-white relative z-10"><MapPin size={10} className="text-white rotate-[45deg]" /></div>
                              <div className="w-4 h-1 bg-black/50 rounded-[50%] blur-[2px] absolute bottom-[-4px] left-[5px] z-0"></div>
                           </div>
                           <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                              <span className="bg-slate-800/90 text-slate-300 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold shadow-lg border border-slate-700">Zone: {item.location}</span>
                           </div>
                        </div>
                     ) : (
                        <div className="border-2 border-slate-700 rounded-lg border-dashed flex flex-col items-center justify-center text-slate-500 p-8 text-center w-full h-full m-4">
                           <ImageIcon size={48} className="mb-4 opacity-50 text-slate-600" />
                           <p className="text-sm font-bold text-slate-400">Upload a property floor plan</p>
                           <p className="text-xs mt-2 max-w-[200px]">To precisely pin this asset to coordinates within {item.location}.</p>
                        </div>
                     )}
                  </div>
               </div>
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
   const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);
   const [uploadedMap, setUploadedMap] = useState(null);

   const toggleCategory = (catId) => {
      if (expandedCategories.includes(catId)) setExpandedCategories(expandedCategories.filter(id => id !== catId));
      else setExpandedCategories([...expandedCategories, catId]);
   };

   const filteredInventory = inventory.filter(i =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const deficits = filteredInventory.filter(i => i.qty < i.minStock);

   const handleSaveEdit = (editedItem) => {
      setInventory(prev => prev.map(i => i.id === editedItem.id ? editedItem : i));
      setSelectedItem(editedItem);
   };

   const handleMapUpload = (e) => {
      if (e.target.files && e.target.files[0]) {
         const reader = new FileReader();
         reader.onload = (e) => setUploadedMap(e.target.result);
         reader.readAsDataURL(e.target.files[0]);
      }
   };

   const generatePurchaseOrder = () => {
      const csvHeader = 'SKU,Item Name,Vendor,Unit Price,Required Qty,Estimated Cost\n';
      const csvRows = deficits.map(d => {
         const required = d.minStock - d.qty;
         return `${d.sku},"${d.name}","${d.vendor}",${d.price},${required},${required * d.price}`;
      }).join('\n');

      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PurchaseOrder_Deficits_${new Date().toLocaleDateString()}.csv`;
      a.click();
   };

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
               <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  <div className="relative flex-1 md:w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     <input
                        type="text"
                        placeholder="Search SKU or name..."
                        className="w-full md:w-64 bg-slate-800 text-white placeholder-slate-400 text-sm rounded-full pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
                  <button onClick={() => setIsScannerOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 shadow whitespace-nowrap transition">
                     <UploadCloud size={14} /> Invoice OCR
                  </button>
                  <button onClick={() => setIsAssetModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 shadow whitespace-nowrap transition">
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

                        {isExpanded && (
                           <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm min-w-[800px]">
                                 <thead className="bg-white text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                                    <tr>
                                       <th className="px-4 py-3 w-20">SKU</th>
                                       <th className="px-4 py-3 min-w-[150px]">Asset Name</th>
                                       <th className="px-4 py-3 w-32">Location Pin</th>
                                       <th className="px-4 py-3 w-24 text-center">Stock / Min</th>
                                       <th className="px-4 py-3 w-28 text-center">Condition</th>
                                       <th className="px-4 py-3">Vendor / Notes</th>
                                       <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                    {catItems.length === 0 ? (
                                       <tr><td colSpan="7" className="p-4 text-center text-slate-400 italic">No assets found in this category.</td></tr>
                                    ) : (
                                       catItems.map(item => (
                                          <tr key={item.id} className="hover:bg-blue-50/50 transition cursor-pointer group" onClick={() => setSelectedItem(item)}>
                                             <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                                                <Hash size={10} className="inline mr-1" />{item.sku}
                                             </td>
                                             <td className="px-4 py-3 font-bold text-slate-700 group-hover:text-blue-600 transition">
                                                {item.name}
                                             </td>
                                             <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded transition max-w-full">
                                                   <MapPin size={12} className="shrink-0 text-slate-400" /> <span className="truncate">{item.location}</span>
                                                </div>
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
                                                <button className="text-slate-400 hover:text-blue-600 transition opacity-0 group-hover:opacity-100 p-1">
                                                   <Edit2 size={16} />
                                                </button>
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
               <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={64} className="text-red-600" /></div>
                  <h3 className="font-bold text-red-800 text-sm mb-3 relative z-10 flex items-center gap-2"><AlertTriangle size={16} /> Low Stock Alerts</h3>
                  <div className="space-y-2 relative z-10">
                     {deficits.length === 0 && <span className="text-sm text-red-700">All stock levels optimal.</span>}
                     {deficits.map(item => (
                        <div key={item.id} className="bg-white p-2 rounded shadow-sm border border-red-100 flex justify-between items-center text-xs">
                           <span className="font-bold text-slate-700 max-w-[150px] truncate">{item.name}</span>
                           <div className="text-red-500 font-bold bg-red-100 px-2 py-0.5 rounded">{item.qty} / {item.minStock}</div>
                        </div>
                     ))}
                  </div>
                  {deficits.length > 0 && (
                     <button onClick={generatePurchaseOrder} className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded shadow-sm transition flex justify-center items-center gap-2">
                        <FileText size={16} /> Generate Purchase Order (CSV)
                     </button>
                  )}
               </div>
            </div>
         </main>

         <ItemDetailsModal
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            item={selectedItem}
            onSaveEdit={handleSaveEdit}
            uploadedMap={uploadedMap}
            onMapUpload={handleMapUpload}
         />
         <ReceiptScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
         <AddAssetModal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} onSave={(item) => setInventory([...inventory, item])} />
      </div>
   );
}
