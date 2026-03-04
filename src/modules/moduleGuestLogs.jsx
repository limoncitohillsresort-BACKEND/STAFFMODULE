import React, { useState } from 'react';
import { Calendar, User, Search, MapPin, Building, CreditCard, Camera, ShieldAlert, Cpu, CheckCircle, Car, KeySquare, MessageSquare, ChevronLeft, DownloadCloud, AlertTriangle } from 'lucide-react';

const LODGIFY_VILLAS = [
   { id: 'v1', name: 'Master Villa', floors: 2 },
   { id: 'v2', name: 'Bamboo Suite', floors: 1 },
   { id: 'v3', name: 'Palm Casita', floors: 1 },
   { id: 'v4', name: 'Ocean Penthouse', floors: 2 },
];

const MOCK_GUESTS = [
   {
      id: 'g1', name: 'John Doe', status: 'In House', checkIn: 2, checkOut: 6, villa: 'v1',
      phone: '+1 555-0198', email: 'john.doe@example.com', source: 'Airbnb',
      vehicle: 'Tesla Model Y - CA 1XYZ234',
      incidents: [], requests: ['Extra towels', 'Late checkout requested'],
      accessLogs: ['Front Gate (14:30)', 'Villa 1 Main Door (14:35)'],
      osintPending: false
   },
   {
      id: 'g2', name: 'Alice Smith', status: 'Arriving Today', checkIn: 5, checkOut: 10, villa: 'v2',
      phone: '+44 7700 900077', email: 'alice.s@company.co.uk', source: 'Direct Booking',
      vehicle: 'Rental - Avis',
      incidents: [], requests: ['Airport Transfer', 'Birthday Cake'],
      accessLogs: [],
      osintPending: true
   },
   {
      id: 'g3', name: 'VIP Corp Exec', status: 'Confirmed', checkIn: 12, checkOut: 15, villa: 'v4',
      phone: '+1 800-555-0199', email: 'exec@corp.com', source: 'Lodgify',
      vehicle: 'Black SUV Service',
      incidents: ['Previous stay: Noise Complaint at 2AM'], requests: ['Stock mini-bar with Fiji water', 'Private Chef'],
      accessLogs: [],
      osintPending: false
   }
];

const STATUS_COLORS = {
   'In House': 'bg-green-500',
   'Arriving Today': 'bg-blue-500',
   'Confirmed': 'bg-slate-500',
   'Checked Out': 'bg-gray-400'
};

const OSINTGenerator = ({ guest, onClose }) => {
   const [loading, setLoading] = useState(true);
   const [complete, setComplete] = useState(false);

   React.useEffect(() => {
      // Mock the webscraper process
      const timer = setTimeout(() => { setLoading(false); setComplete(true); }, 3000);
      return () => clearTimeout(timer);
   }, []);

   const jsonExport = {
      target: guest.name,
      email: guest.email,
      phone: guest.phone,
      crossRefSources: ["LinkedIn", "Instagram", "Public Records"],
      findings: {
         profession: "Tech Executive",
         affiliations: ["Example Corp", "Charity Board"],
         preferences: ["High-end dining", "Golf"],
         flags: "None"
      },
      privacyActCompliance: "Verified NOM-081",
      timestamp: new Date().toISOString()
   };

   return (
      <div className="fixed inset-0 z-[100] bg-slate-900/90 flex justify-center items-center p-4">
         <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden text-slate-300 font-mono text-sm flex flex-col max-h-[90vh]">
            <div className="bg-black p-4 flex justify-between items-center border-b border-slate-800 shrink-0">
               <h2 className="text-green-500 font-bold flex items-center gap-2"><Cpu size={18} /> OSINT Dossier Generator v2.4</h2>
               <button onClick={onClose} className="hover:text-red-400">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
               {loading ? (
                  <div className="space-y-2 text-green-400/80">
                     <p className="animate-pulse">[{new Date().toLocaleTimeString()}] Initializing n8n webcrawler...</p>
                     <p className="animate-pulse" style={{ animationDelay: '0.5s' }}>[{new Date().toLocaleTimeString()}] Injecting parameters: {guest.email}...</p>
                     <p className="animate-pulse" style={{ animationDelay: '1s' }}>[{new Date().toLocaleTimeString()}] Querying public databases and crossing platform metrics...</p>
                     <p className="text-yellow-500 animate-pulse mt-4"><AlertTriangle size={14} className="inline" /> Analyzing privacy constraints...</p>
                  </div>
               ) : (
                  <div className="space-y-4 animate-fade-in text-slate-300">
                     <div className="bg-green-900/20 text-green-400 border border-green-800 p-3 rounded">
                        <CheckCircle size={16} className="inline mr-2" /> Scan Complete. Dossier compiled.
                     </div>
                     <pre className="bg-black p-4 rounded border border-slate-800 overflow-x-auto text-blue-400 text-xs shadow-inner">
                        {JSON.stringify(jsonExport, null, 2)}
                     </pre>
                  </div>
               )}
            </div>

            <div className="p-4 bg-black border-t border-slate-800 flex justify-end gap-3 shrink-0">
               <button onClick={onClose} className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-white rounded transition">Close Terminal</button>
               <button disabled={loading} className={`px-4 py-2 bg-green-700 text-white font-bold rounded transition flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}>
                  <DownloadCloud size={16} /> Export Payload
               </button>
            </div>
         </div>
      </div>
   );
};

export default function ModuleGuestLogs({ onBack, user }) {
   const [selectedGuest, setSelectedGuest] = useState(null);
   const [showOSINT, setShowOSINT] = useState(false);

   // 7-day view state
   const [startDayOffset, setStartDayOffset] = useState(0); // 0 offset = days 1-7
   const MOCK_CURRENT_DAY = 5; // A mock 'today' for highlighting

   const visibleDays = Array.from({ length: 7 }, (_, i) => i + 1 + startDayOffset);

   const shiftLeft = () => setStartDayOffset(Math.max(0, startDayOffset - 7));
   const shiftRight = () => setStartDayOffset(Math.min(24, startDayOffset + 7)); // Cap at max 31 days

   return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
         <header className="bg-slate-900 text-white p-4 shadow-md shrink-0 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
               {onBack && (
                  <button onClick={onBack} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition">
                     <ChevronLeft size={20} />
                  </button>
               )}
               <div>
                  <h1 className="text-lg font-bold leading-none">Guest Operations & Logs</h1>
                  <p className="text-xs text-slate-400">Lodgify Sync • ID Verification • Access Control</p>
               </div>
            </div>
         </header>

         <main className="flex-1 overflow-auto p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col xl:flex-row gap-6">

            {/* Lodgify Style Calendar */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
               <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="font-bold flex items-center gap-2 text-slate-800"><Building className="text-blue-600" /> Booking Reservations</h2>
                  <div className="flex bg-slate-200 rounded-lg p-1 overflow-hidden">
                     <button onClick={shiftLeft} disabled={startDayOffset === 0} className="p-1 hover:bg-white rounded transition disabled:opacity-30"><ChevronLeft size={16} className="text-slate-600" /></button>
                     <div className="text-xs font-bold text-slate-600 px-3 py-1 flex items-center">Days {visibleDays[0]} - {visibleDays[6]}</div>
                     <button onClick={shiftRight} disabled={startDayOffset >= 24} className="p-1 hover:bg-white rounded transition disabled:opacity-30"><ChevronLeft size={16} className="rotate-180 text-slate-600" /></button>
                  </div>
                  <div className="hidden md:flex gap-2">
                     {Object.keys(STATUS_COLORS).map(s => (
                        <div key={s} className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase"><div className={`w-2 h-2 rounded-full ${STATUS_COLORS[s]}`}></div>{s}</div>
                     ))}
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                     {/* Timeline X-Axis */}
                     <div className="flex border-b border-slate-200 bg-slate-100">
                        <div className="w-40 shrink-0 p-3 text-xs font-bold text-slate-500 uppercase border-r border-slate-200">Accommodation</div>
                        <div className="flex-1 flex relative">
                           {visibleDays.map(day => (
                              <div key={day} className={`flex-1 text-center py-2 text-[10px] font-bold border-r border-slate-200 last:border-0 transition-colors ${day === MOCK_CURRENT_DAY ? 'bg-slate-300/50 text-slate-800 ring-inset ring-2 ring-slate-400/20' : 'text-slate-400'}`}>
                                 {day}
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Villa Y-Axis rows */}
                     {LODGIFY_VILLAS.map(villa => {
                        const guests = MOCK_GUESTS.filter(g => g.villa === villa.id);

                        return (
                           <div key={villa.id} className="flex border-b border-slate-100 last:border-0 relative hover:bg-slate-50 min-h-[60px]">
                              <div className="w-40 shrink-0 p-3 border-r border-slate-200 bg-white z-10 flex flex-col justify-center">
                                 <span className="font-bold text-sm text-slate-800 truncate">{villa.name}</span>
                              </div>

                              <div className="flex-1 relative bg-slate-50/30 flex">
                                 {/* Grid Lines Highlight */}
                                 {visibleDays.map(d => (
                                    <div key={'bg' + d} className={`flex-1 border-r border-slate-200 border-dashed transition-colors ${d === MOCK_CURRENT_DAY ? 'bg-slate-200/40' : ''}`}></div>
                                 ))}

                                 {/* Reservation Blocks */}
                                 {guests.map(guest => {
                                    // Check if guest is visible in current window
                                    if (guest.checkOut <= visibleDays[0] || guest.checkIn >= visibleDays[6] + 1) return null;

                                    const visibleCheckIn = Math.max(guest.checkIn, visibleDays[0]);
                                    const visibleCheckOut = Math.min(guest.checkOut, visibleDays[6] + 1); // +1 because checkout is the end of the night

                                    const leftPercent = ((visibleCheckIn - visibleDays[0]) / 7) * 100;
                                    const widthPercent = ((visibleCheckOut - visibleCheckIn) / 7) * 100;

                                    const isCutLeft = guest.checkIn < visibleDays[0];
                                    const isCutRight = guest.checkOut > visibleDays[6] + 1;

                                    const bgClass = STATUS_COLORS[guest.status] || 'bg-slate-500';

                                    return (
                                       <div
                                          key={guest.id}
                                          onClick={() => setSelectedGuest(guest)}
                                          className={`absolute top-1.5 bottom-1.5 ${bgClass} text-white px-3 flex items-center cursor-pointer hover:brightness-110 shadow-sm transition z-20 overflow-hidden border border-white/20
                                             ${isCutLeft ? 'rounded-l-none border-l-0' : 'rounded-l-full'} 
                                             ${isCutRight ? 'rounded-r-none border-r-0' : 'rounded-r-full'}
                                          `}
                                          style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                                       >
                                          <span className="text-xs font-bold truncate drop-shadow-sm flex items-center gap-1.5">
                                             {!isCutLeft && <User size={12} />} {guest.name}
                                          </span>
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

            {/* Guest Dossier Detail View */}
            <div className="xl:w-[400px] w-full flex flex-col gap-4 shrink-0">
               {selectedGuest ? (
                  <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden sticky top-6">
                     <div className={`${STATUS_COLORS[selectedGuest.status]} p-1.5 flex justify-center`}>
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">{selectedGuest.status}</span>
                     </div>

                     <div className="p-6">
                        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                           <div>
                              <h2 className="text-2xl font-black text-slate-800 leading-tight">{selectedGuest.name}</h2>
                              <div className="flex items-center gap-2 mt-1 text-sm font-bold text-slate-500">
                                 <CreditCard size={14} className="text-blue-500" /> {selectedGuest.source} Booking
                              </div>
                           </div>
                           <button onClick={() => setSelectedGuest(null)} className="text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1"><ChevronLeft size={16} className="rotate-180" /></button>
                        </div>

                        <div className="space-y-5">
                           {/* Contact Info */}
                           <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Phone</span>
                                 <span className="font-semibold text-slate-700">{selectedGuest.phone}</span>
                              </div>
                              <div>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Email</span>
                                 <span className="font-semibold text-slate-700 truncate block" title={selectedGuest.email}>{selectedGuest.email}</span>
                              </div>
                           </div>

                           {/* Registration Data */}
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3 text-sm">
                              <div className="flex items-center gap-2 text-slate-700">
                                 <Car size={16} className="text-slate-400" />
                                 <span className="font-bold">{selectedGuest.vehicle}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-700">
                                 <Camera size={16} className="text-green-600" />
                                 <span className="font-bold text-green-700">ID Verification Complete</span>
                              </div>
                           </div>

                           {/* Logs & Requests */}
                           <div className="space-y-3">
                              <h3 className="text-xs font-bold text-slate-800 uppercase border-b border-slate-200 pb-1 flex items-center gap-2"><MessageSquare size={14} /> Guest Requests</h3>
                              {selectedGuest.requests.length > 0 ? (
                                 <ul className="list-disc pl-4 text-sm text-slate-600 space-y-1">
                                    {selectedGuest.requests.map((r, i) => <li key={i}>{r}</li>)}
                                 </ul>
                              ) : <p className="text-xs text-slate-400 italic">No notes.</p>}
                           </div>

                           <div className="space-y-3">
                              <h3 className="text-xs font-bold text-slate-800 uppercase border-b border-slate-200 pb-1 flex items-center gap-2"><KeySquare size={14} /> Hikvision Access Logs</h3>
                              {selectedGuest.accessLogs.length > 0 ? (
                                 <ul className="text-xs text-slate-600 space-y-1 font-mono bg-slate-100 p-2 rounded">
                                    {selectedGuest.accessLogs.map((l, i) => <li key={i}>&gt; {l}</li>)}
                                 </ul>
                              ) : <p className="text-xs text-slate-400 italic">No movement detected.</p>}
                           </div>

                           {selectedGuest.incidents.length > 0 && (
                              <div className="space-y-3 bg-red-50 p-3 rounded-lg border border-red-100 text-red-800">
                                 <h3 className="text-xs font-bold uppercase flex items-center gap-2"><ShieldAlert size={14} /> Incident Reports</h3>
                                 <ul className="list-disc pl-4 text-sm space-y-1">
                                    {selectedGuest.incidents.map((inc, i) => <li key={i}>{inc}</li>)}
                                 </ul>
                              </div>
                           )}

                           {/* OSINT Button */}
                           <div className="pt-4 border-t border-slate-100">
                              <button
                                 onClick={() => setShowOSINT(true)}
                                 className="w-full py-3 bg-slate-900 hover:bg-black text-green-400 font-mono text-xs rounded-lg flex items-center justify-center gap-2 border border-slate-800 transition"
                              >
                                 <Cpu size={14} /> GENERATE OSINT BACKGROUND REPORT
                              </button>
                              <p className="text-[9px] text-center text-slate-400 mt-2">Powered by custom n8n webcrawler. Complies with local privacy laws.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[400px]">
                     <User size={48} className="text-slate-300 mb-4 stroke-1" />
                     <h3 className="font-bold text-lg text-slate-500 mb-2">No Guest Selected</h3>
                     <p className="text-sm">Click on a reservation pill to view their full comprehensive dossier, logs, and run background checks.</p>
                  </div>
               )}
            </div>
         </main>

         {showOSINT && <OSINTGenerator guest={selectedGuest} onClose={() => setShowOSINT(false)} />}
      </div>
   );
}
