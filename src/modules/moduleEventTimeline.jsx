import React, { useState } from 'react';
import { Calendar, Users, MapPin, Plus, FileText, ChevronLeft, Link as LinkIcon, CheckCircle, Clock, Trash2, Edit2, Download } from 'lucide-react';

const VENUES = [
   { id: 'v1', name: 'Main Beachfront', type: 'Public Venue' },
   { id: 'v2', name: 'Restaurant Terrace', type: 'F&B Venue' },
   { id: 'v3', name: 'Villa 1 (Master)', type: 'Accommodation' },
   { id: 'v4', name: 'Villa 2', type: 'Accommodation' },
   { id: 'v5', name: 'Yoga Palapa', type: 'Wellness' },
   { id: 'v6', name: 'Entire Resort', type: 'Property' }
];

const INITIAL_EVENTS = [
   {
      id: 'evt1', title: 'Summer Solstice Yoga Retreat', type: 'Retreat', venue: 'v6',
      startDate: 5, endDate: 10, month: 'July', year: 2026, status: 'Confirmed',
      guestCount: 25, organizer: 'Yoga Life Co.', documents: ['Retreat_Contract.pdf', 'Dietary_List.xlsx']
   },
   {
      id: 'evt2', title: 'Beach Wedding (Smith/Jones)', type: 'Wedding', venue: 'v1',
      startDate: 15, endDate: 17, month: 'July', year: 2026, status: 'Deposit Paid',
      guestCount: 150, organizer: 'Sarah Planner', documents: ['Wedding_Invoice.pdf', 'Vendor_List.pdf']
   },
   {
      id: 'evt3', title: 'Deep Cleaning & Maintenance', type: 'Operations', venue: 'v5',
      startDate: 1, endDate: 3, month: 'July', year: 2026, status: 'Scheduled',
      guestCount: 0, organizer: 'Engineering Dept', documents: ['Maintenance_SOP.pdf']
   }
];

const TYPE_COLORS = {
   'Retreat': 'bg-purple-500',
   'Wedding': 'bg-pink-500',
   'Corporate': 'bg-blue-500',
   'Operations': 'bg-slate-500',
   'Private Booking': 'bg-emerald-500'
};

const AddEventModal = ({ isOpen, onClose, onSave }) => {
   const [formData, setFormData] = useState({
      title: '', type: 'Private Booking', venue: 'v1', startDate: 1, endDate: 2,
      guestCount: 2, organizer: '', status: 'Pending', documents: []
   });
   const [newDoc, setNewDoc] = useState('');

   if (!isOpen) return null;

   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
   const handleAddDoc = () => { if (newDoc) { setFormData({ ...formData, documents: [...formData.documents, newDoc] }); setNewDoc(''); } };

   return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 flex justify-center items-center p-4">
         <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
               <h2 className="font-bold flex items-center gap-2"><Calendar size={18} /> Schedule Master Event</h2>
               <button onClick={onClose} className="hover:text-red-400">&times;</button>
            </div>

            <div className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Event Title</label>
                     <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded focus:border-blue-500 outline-none" placeholder="e.g. VIP Corporate Retreat" />
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Event Type</label>
                     <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded bg-slate-50 outline-none">
                        {Object.keys(TYPE_COLORS).map(t => <option key={t}>{t}</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Venue / Location</label>
                     <select name="venue" value={formData.venue} onChange={handleChange} className="w-full p-2 border rounded bg-slate-50 outline-none">
                        {VENUES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                     </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Start Day (1-31)</label>
                        <input type="number" name="startDate" value={formData.startDate} onChange={handleChange} min="1" max="31" className="w-full p-2 border rounded outline-none" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">End Day (1-31)</label>
                        <input type="number" name="endDate" value={formData.endDate} onChange={handleChange} min="1" max="31" className="w-full p-2 border rounded outline-none" />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Pax Count</label>
                        <input type="number" name="guestCount" value={formData.guestCount} onChange={handleChange} className="w-full p-2 border rounded outline-none" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Organizer/POC</label>
                        <input type="text" name="organizer" value={formData.organizer} onChange={handleChange} className="w-full p-2 border rounded outline-none" />
                     </div>
                  </div>

                  <div className="col-span-2 mt-2 pt-4 border-t border-slate-100">
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Attached Documents / Contracts</label>
                     <div className="flex gap-2 mb-2">
                        <input type="text" value={newDoc} onChange={e => setNewDoc(e.target.value)} placeholder="Filename or URL link..." className="flex-1 p-2 border rounded outline-none text-sm" />
                        <button onClick={handleAddDoc} className="bg-slate-200 hover:bg-slate-300 px-3 py-2 rounded text-sm font-bold transition">Add</button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {formData.documents.map((doc, idx) => (
                           <div key={idx} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 flex items-center gap-2 border border-blue-200 rounded">
                              <FileText size={12} /> {doc}
                              <button onClick={() => setFormData({ ...formData, documents: formData.documents.filter((_, i) => i !== idx) })} className="text-red-500 hover:text-red-700 hover:font-bold">&times;</button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
               <button onClick={onClose} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800">Cancel</button>
               <button onClick={() => { onSave(formData); onClose(); }} className="px-6 py-2 bg-blue-600 font-bold text-white rounded hover:bg-blue-700 shadow">Save Event</button>
            </div>
         </div>
      </div>
   );
};


export default function ModuleEventTimeline({ onBack, user }) {
   const [events, setEvents] = useState(INITIAL_EVENTS);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedEvent, setSelectedEvent] = useState(null);

   // Hardcoded to July for the prototype view
   const currentMonth = "July 2026";
   const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

   const handleSave = (data) => {
      setEvents([...events, { ...data, id: 'evt' + Date.now(), month: 'July', year: 2026 }]);
   };

   const handleCancelClick = (id) => {
      if (window.confirm('Cancel this event?')) setEvents(events.filter(e => e.id !== id));
   }

   return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
         <header className="bg-slate-900 text-white p-4 shadow-md shrink-0 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-3">
                  {onBack && (
                     <button onClick={onBack} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition">
                        <ChevronLeft size={20} />
                     </button>
                  )}
                  <div>
                     <h1 className="text-lg font-bold leading-none">Property Event Timeline</h1>
                     <p className="text-xs text-slate-400">Master Operations & Booking Gantt</p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white font-bold text-sm flex items-center gap-2 shadow-lg">
                  <Plus size={16} /> Schedule Event
               </button>
            </div>
         </header>

         <main className="flex-1 overflow-auto p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6">

            {/* Left Area - Master Gantt Chart */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-fit">
               <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="font-bold flex items-center gap-2"><Calendar className="text-blue-600" /> MACRO TIMELINE: {currentMonth}</h2>
                  <div className="flex gap-2">
                     {Object.keys(TYPE_COLORS).map(type => (
                        <div key={type} className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase"><div className={`w-2 h-2 rounded-full ${TYPE_COLORS[type]}`}></div>{type}</div>
                     ))}
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <div className="min-w-[1000px]">
                     {/* Timeline X-Axis */}
                     <div className="flex border-b border-slate-200 bg-slate-100">
                        <div className="w-48 shrink-0 p-3 text-xs font-bold text-slate-500 uppercase border-r border-slate-200">Venue / Location</div>
                        <div className="flex-1 flex">
                           {daysInMonth.map(day => (
                              <div key={day} className="flex-1 text-center py-2 text-[10px] font-bold text-slate-400 border-r border-slate-200 last:border-0">{day}</div>
                           ))}
                        </div>
                     </div>

                     {/* Venue Y-Axis rows */}
                     {VENUES.map(venue => {
                        const venueEvents = events.filter(e => e.venue === venue.id);

                        return (
                           <div key={venue.id} className="flex border-b border-slate-100 last:border-0 relative hover:bg-slate-50 min-h-[70px]">
                              <div className="w-48 shrink-0 p-3 border-r border-slate-200 bg-white z-10 flex flex-col justify-center">
                                 <span className="font-bold text-sm text-slate-800 truncate">{venue.name}</span>
                                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{venue.type}</span>
                              </div>

                              <div className="flex-1 relative bg-slate-50/30">
                                 {/* Grid Lines */}
                                 <div className="absolute inset-0 flex pointer-events-none">
                                    {daysInMonth.map(d => (
                                       <div key={'bg' + d} className="flex-1 border-r border-slate-200 border-dashed"></div>
                                    ))}
                                 </div>

                                 {/* Event Blocks */}
                                 {venueEvents.map(evt => {
                                    const leftPercent = ((evt.startDate - 1) / 31) * 100;
                                    const end = Math.min(evt.endDate, 31);
                                    const widthPercent = ((end - evt.startDate + 1) / 31) * 100;
                                    const bgClass = TYPE_COLORS[evt.type] || 'bg-slate-800';

                                    return (
                                       <div
                                          key={evt.id}
                                          onClick={() => setSelectedEvent(evt)}
                                          className={`absolute top-2 bottom-2 ${bgClass} rounded shadow-md text-white overflow-hidden p-2 cursor-pointer hover:-translate-y-0.5 transition z-20 flex flex-col opacity-95 hover:opacity-100 border border-white/20`}
                                          style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                                       >
                                          <h4 className="text-[11px] font-bold truncate leading-tight drop-shadow-sm">{evt.title}</h4>
                                          {widthPercent > 10 && (
                                             <div className="text-[9px] mt-1 opacity-90 truncate flex items-center gap-1"><Users size={10} /> {evt.guestCount} Pax</div>
                                          )}
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* Right Area - Event Details Dossier */}
            <div className="lg:w-96 w-full flex flex-col gap-4 shrink-0">
               {selectedEvent ? (
                  <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden sticky top-6">
                     <div className={`${TYPE_COLORS[selectedEvent.type]} p-1`}></div>
                     <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block border border-slate-200">{selectedEvent.type}</span>
                              <h2 className="text-xl font-black text-slate-800 leading-tight">{selectedEvent.title}</h2>
                           </div>
                           <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1"><ChevronLeft size={16} className="rotate-180" /></button>
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-sm text-slate-700">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><MapPin size={16} /></div>
                              <div><span className="text-xs text-slate-400 block font-bold uppercase">Location</span><span className="font-bold">{VENUES.find(v => v.id === selectedEvent.venue)?.name}</span></div>
                           </div>

                           <div className="flex items-center gap-3 text-sm text-slate-700">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Clock size={16} /></div>
                              <div><span className="text-xs text-slate-400 block font-bold uppercase">Dates</span><span className="font-bold">{selectedEvent.startDate} - {selectedEvent.endDate} {selectedEvent.month} {selectedEvent.year}</span></div>
                           </div>

                           <div className="flex items-center gap-3 text-sm text-slate-700">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Users size={16} /></div>
                              <div><span className="text-xs text-slate-400 block font-bold uppercase">Operations / Pax</span><span className="font-bold">{selectedEvent.guestCount} Guests • POC: {selectedEvent.organizer}</span></div>
                           </div>

                           <div className="border-t border-slate-100 pt-4 mt-4">
                              <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><LinkIcon size={14} /> Attached Documents</h3>
                              {selectedEvent.documents.length === 0 ? (
                                 <p className="text-sm text-slate-400 italic">No documents attached.</p>
                              ) : (
                                 <div className="space-y-2">
                                    {selectedEvent.documents.map((doc, i) => (
                                       <a key={i} href="#" className="flex items-center justify-between p-2 rounded border border-slate-200 hover:bg-slate-50 transition group">
                                          <div className="flex items-center gap-2 text-sm text-slate-700"><FileText size={16} className="text-blue-500" /> <span className="font-medium truncate max-w-[200px]">{doc}</span></div>
                                          <Download size={14} className="text-slate-400 group-hover:text-blue-600" />
                                       </a>
                                    ))}
                                 </div>
                              )}
                           </div>

                           <div className="border-t border-slate-100 pt-4 mt-4 flex gap-2">
                              <button className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded text-sm transition">Edit Details</button>
                              <button onClick={() => { handleCancelClick(selectedEvent.id); setSelectedEvent(null); }} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded text-sm transition"><Trash2 size={16} /></button>
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[400px]">
                     <Calendar size={48} className="text-slate-300 mb-4 stroke-1" />
                     <h3 className="font-bold text-lg text-slate-500 mb-2">No Event Selected</h3>
                     <p className="text-sm">Click on any event block in the timeline diagram to view comprehensive details, documents, and contacts.</p>
                  </div>
               )}
            </div>
         </main>

         <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      </div>
   );
}
