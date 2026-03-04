import React, { useState } from 'react';
import { DollarSign, User, Calendar, FileText, CheckCircle, ChevronLeft, ChevronRight, Download, Plus, AlertCircle, Percent, PenTool, CheckSquare, X, Save, Send } from 'lucide-react';

const STAFF_LIST = [
   { id: 'E001', name: 'Dalia M.', role: 'Housekeeping', rate: 450, dailyHours: 8 },
   { id: 'E002', name: 'Carlos R.', role: 'Engineering', rate: 600, dailyHours: 8 },
   { id: 'E004', name: 'Mike T.', role: 'Grounds', rate: 400, dailyHours: 8 },
];

const WEEKLY_LOGS = {
   'E001': { daysWorked: 5, totalHours: 40, extraBounties: 150 },
   'E002': { daysWorked: 6, totalHours: 48, extraBounties: 300 },
   'E004': { daysWorked: 4, totalHours: 32, extraBounties: 0 },
};

const DEDUCTIONS_DB = {
   'E001': [{ id: 'd1', reason: 'Staff Loan Installment (3/10)', amount: -200 }],
   'E002': [{ id: 'd2', reason: 'Missing Fluke Multimeter (50% charge)', amount: -100 }],
   'E004': [],
};

// UI Standardized Modal for Editing Hours
const EditHoursModal = ({ isOpen, onClose, day, staff, onSave }) => {
   const [hours, setHours] = useState('');
   const [reason, setReason] = useState('');

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
         <div className="bg-white rounded-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
               <h3 className="font-bold flex items-center gap-2">
                  <Calendar size={18} /> Edit Hours - {day}
               </h3>
               <button onClick={onClose} className="hover:text-red-400 transition"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               <div className="bg-blue-50 text-blue-800 p-3 rounded text-sm mb-4">
                  Modifying logs for <strong>{staff?.name}</strong>. Admin sign-off is required for manual overrides (e.g., sick leave, extended break).
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Adjusted Hours</label>
                  <input type="number" step="0.5" className="w-full p-2 border rounded outline-none focus:border-blue-500 transition" placeholder="e.g. 7.5" value={hours} onChange={e => setHours(e.target.value)} />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mandatory Reasoning</label>
                  <textarea className="w-full p-2 border rounded outline-none focus:border-blue-500 text-sm transition" rows={3} placeholder="Provide a detailed reason for the adjustment..." value={reason} onChange={e => setReason(e.target.value)}></textarea>
               </div>
            </div>
            <div className="p-4 bg-slate-50 border-t">
               <button onClick={() => { onSave(hours, reason); onClose(); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition hover:shadow-lg">
                  <Save size={18} /> Submit Adjustment
               </button>
            </div>
         </div>
      </div>
   );
};

// UI Standardized Modal for Deductions
const DeductionsModal = ({ isOpen, onClose, staff, deductions, onAdd, onRemove }) => {
   const [newReason, setNewReason] = useState('');
   const [newAmount, setNewAmount] = useState('');

   if (!isOpen) return null;

   const handleAdd = () => {
      onAdd(newReason, newAmount);
      setNewReason('');
      setNewAmount('');
   };

   return (
      <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
         <div className="bg-white rounded-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
               <h3 className="font-bold flex items-center gap-2">
                  <Percent size={18} /> Adjustments & Deductions
               </h3>
               <button onClick={onClose} className="hover:text-red-400 transition"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               <p className="text-sm text-slate-600 mb-2">Detailed view of all active deductions for <strong>{staff?.name}</strong>.</p>

               {deductions.length === 0 ? (
                  <div className="text-center p-6 bg-slate-50 border border-slate-200 border-dashed rounded text-slate-400">
                     No active deductions.
                  </div>
               ) : (
                  <div className="space-y-3">
                     {deductions.map(d => (
                        <div key={d.id} className="p-3 border border-red-200 rounded-lg bg-red-50 relative">
                           <div className="font-bold text-red-800 flex justify-between">
                              <span>-${Math.abs(d.amount).toFixed(2)}</span>
                           </div>
                           <p className="text-sm text-red-700 mt-1">{d.reason}</p>
                           <button onClick={() => onRemove(d.id)} className="text-xs text-red-500 hover:text-red-700 underline mt-2 font-bold transition">Remove / Forgive</button>
                        </div>
                     ))}
                  </div>
               )}

               <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Add New Deduction</h4>
                  <input type="text" placeholder="Reason (e.g. Uniform Replacement)" value={newReason} onChange={(e) => setNewReason(e.target.value)} className="w-full p-2 border rounded mb-2 text-sm outline-none focus:border-red-500 transition" />
                  <input type="number" placeholder="Amount ($)" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-full p-2 border rounded mb-3 text-sm outline-none focus:border-red-500 transition" />
                  <button onClick={handleAdd} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition hover:shadow-lg">
                     <Plus size={16} /> Add Deduction
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default function ModulePayroll({ onBack }) {
   const [selectedStaff, setSelectedStaff] = useState('E002');
   const [signed, setSigned] = useState(false);
   const [pushed, setPushed] = useState(false);
   const [weekOffset, setWeekOffset] = useState(0);

   // Dynamic DB State
   const [weeklyLogs, setWeeklyLogs] = useState(WEEKLY_LOGS);
   const [deductionsDb, setDeductionsDb] = useState(DEDUCTIONS_DB);

   // Modal states
   const [editingDay, setEditingDay] = useState(null);
   const [showDeductions, setShowDeductions] = useState(false);

   const staff = STAFF_LIST.find(s => s.id === selectedStaff);
   const log = weeklyLogs[selectedStaff] || { daysWorked: 0, totalHours: 0, extraBounties: 0, customHours: {} };
   const deductions = deductionsDb[selectedStaff] || [];

   const basePay = (staff.rate / staff.dailyHours) * log.totalHours;
   const totalDeductions = deductions.reduce((acc, curr) => acc + curr.amount, 0);
   const netPay = basePay + log.extraBounties + totalDeductions;

   const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

   const getWeekLabel = () => {
      if (weekOffset === 0) return "Current Week (W24)";
      if (weekOffset === -1) return "Last Week (W23)";
      return `Week ${24 + weekOffset}`;
   };

   // Handlers
   const handleSaveHours = (hours, reason) => {
      const parsedHours = parseFloat(hours) || 0;
      setWeeklyLogs(prev => {
         const currentLog = prev[selectedStaff] || { daysWorked: 0, totalHours: 0, extraBounties: 0, customHours: {} };
         const previousHoursForDay = currentLog.customHours?.[editingDay] !== undefined
            ? currentLog.customHours[editingDay]
            : (daysOfWeek.indexOf(editingDay) < currentLog.daysWorked ? staff.dailyHours : 0);

         const newTotalHours = currentLog.totalHours - previousHoursForDay + parsedHours;

         return {
            ...prev,
            [selectedStaff]: {
               ...currentLog,
               totalHours: newTotalHours,
               customHours: {
                  ...(currentLog.customHours || {}),
                  [editingDay]: parsedHours
               }
            }
         };
      });
      setSigned(false);
   };

   const handleAddDeduction = (reason, amount) => {
      const parsedAmount = -Math.abs(parseFloat(amount) || 0); // Ensure negative
      if (parsedAmount === 0 || !reason) return;

      setDeductionsDb(prev => ({
         ...prev,
         [selectedStaff]: [
            ...(prev[selectedStaff] || []),
            { id: 'd_' + Date.now(), reason, amount: parsedAmount }
         ]
      }));
      setSigned(false);
   };

   const handleRemoveDeduction = (deductionId) => {
      setDeductionsDb(prev => ({
         ...prev,
         [selectedStaff]: (prev[selectedStaff] || []).filter(d => d.id !== deductionId)
      }));
      setSigned(false);
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
                     <h1 className="text-lg font-bold leading-none">Payroll Processing</h1>
                     <p className="text-xs text-slate-400">Timesheets, Adjustments & Authorizations</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button onClick={() => setPushed(true)} disabled={pushed} className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow transition ${pushed ? 'bg-green-600/50 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                     <Send size={16} /> {pushed ? 'Pushed to Staff' : 'Push to Staff'}
                  </button>
                  <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-white font-bold text-sm flex items-center gap-2 transition border border-slate-700">
                     <Download size={16} /> Export Disbursals
                  </button>
               </div>
            </div>
         </header>

         <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col xl:flex-row gap-6">

            <div className="xl:w-80 w-full shrink-0 flex flex-col gap-4">
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col gap-3">
                     <h2 className="font-bold flex items-center gap-2 text-slate-800"><User className="text-blue-600" /> Staff Roster</h2>
                     <div className="flex items-center justify-between bg-white rounded border border-slate-200 p-1">
                        <button onClick={() => setWeekOffset(prev => prev - 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500 transition"><ChevronLeft size={16} /></button>
                        <span className="text-xs font-bold text-slate-700">{getWeekLabel()}</span>
                        <button onClick={() => setWeekOffset(prev => Math.min(prev + 1, 0))} disabled={weekOffset === 0} className={`p-1 rounded transition ${weekOffset === 0 ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-slate-100 text-slate-500'}`}><ChevronRight size={16} /></button>
                     </div>
                  </div>
                  <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                     {STAFF_LIST.map(s => {
                        const isSelected = selectedStaff === s.id;
                        return (
                           <div
                              key={s.id}
                              onClick={() => { setSelectedStaff(s.id); setSigned(false); setPushed(false); }}
                              className={`p-4 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition border-l-4 ${isSelected ? 'bg-blue-50 border-blue-500' : 'border-transparent'}`}
                           >
                              <div>
                                 <h3 className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{s.name}</h3>
                                 <p className="text-xs text-slate-500">{s.role}</p>
                              </div>
                              <div className="text-right">
                                 <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-bold block mb-1">
                                    {weeklyLogs[s.id]?.totalHours || 0}h
                                 </span>
                              </div>
                           </div>
                        )
                     })}
                  </div>
               </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-fit">
               <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
                  <div>
                     <h2 className="text-2xl font-black text-slate-800">{staff?.name}</h2>
                     <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{staff?.role} • ID: {staff?.id}</p>
                  </div>
                  <div className="text-right">
                     <div className="text-3xl font-black text-green-600">${netPay.toFixed(2)}</div>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Net Payment</p>
                  </div>
               </div>

               <div className="p-6 space-y-8">

                  <div>
                     <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2"><Calendar size={16} /> Daily Attendance Log</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded uppercase tracking-widest shadow-sm">Tap day to edit</span>
                     </h3>
                     <div className="flex flex-wrap md:flex-nowrap bg-slate-100 rounded-lg border border-slate-200 overflow-hidden text-center divide-x divide-slate-200">
                        {daysOfWeek.map((day, i) => {
                           const worked = i < log.daysWorked || log.customHours?.[day] > 0;
                           const displayedHours = log.customHours?.[day] !== undefined ? log.customHours[day] : (i < log.daysWorked ? staff.dailyHours : 0);
                           return (
                              <div key={day} onClick={() => setEditingDay(day)} className="flex-1 p-3 bg-white hover:bg-blue-50 cursor-pointer transition active:bg-blue-100 relative">
                                 {log.customHours?.[day] !== undefined && (
                                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-400" title="Manually Edited"></div>
                                 )}
                                 <div className="text-xs font-bold text-slate-400 uppercase">{day}</div>
                                 <div className={`mt-2 font-bold ${worked && displayedHours > 0 ? 'text-green-600' : 'text-slate-300'}`}>
                                    {worked && displayedHours > 0 ? (displayedHours + 'h') : 'OFF'}
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2"><DollarSign size={16} /> Gross Earnings</h3>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                           <div className="flex justify-between text-sm">
                              <span className="text-slate-600 font-medium">Base Pay (calculated from hours)</span>
                              <span className="font-bold text-slate-800">${basePay.toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                              <span className="text-slate-600 font-medium truncate max-w-[200px]" title="From dynamic tasks">Activity Log Bounties</span>
                              <span className="font-bold text-green-600">+${log.extraBounties.toFixed(2)}</span>
                           </div>
                           <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-slate-800">
                              <span>Total Gross</span>
                              <span>${(basePay + log.extraBounties).toFixed(2)}</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center justify-between">
                           <span className="flex items-center gap-2"><Percent size={16} /> Adjustments & Deductions</span>
                        </h3>
                        <div onClick={() => setShowDeductions(true)} className="bg-red-50 p-4 rounded-lg border border-red-100 space-y-3 cursor-pointer hover:bg-red-100/50 transition relative group h-[120px] overflow-hidden">
                           <div className="absolute inset-0 bg-red-900/5 backdrop-blur-[1px] rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition z-20">
                              <span className="bg-white text-red-700 text-xs font-bold px-3 py-1 rounded shadow-sm border border-red-200">Manage Deductions</span>
                           </div>
                           {deductions.length === 0 ? (
                              <div className="text-sm text-slate-400 italic text-center py-2 relative z-10 h-full flex items-center justify-center">No deductions this cycle.</div>
                           ) : (
                              <div className="relative z-10">
                                 {deductions.map(d => (
                                    <div key={d.id} className="flex justify-between text-sm text-red-800 mb-3">
                                       <span className="font-medium truncate max-w-[170px]" title={d.reason}>{d.reason}</span>
                                       <span className="font-bold">-${Math.abs(d.amount).toFixed(2)}</span>
                                    </div>
                                 ))}
                                 <div className="pt-3 border-t border-red-200 flex justify-between font-bold text-red-900 absolute bottom-4 left-4 right-4">
                                    <span>Total Deductions</span>
                                    <span>-${Math.abs(totalDeductions).toFixed(2)}</span>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                     <div className="bg-slate-800 rounded-xl p-6 text-white text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                           <h4 className="font-bold text-lg mb-1">Employee Verification Sign-off</h4>
                           <p className="text-slate-400 text-xs max-w-md gap-1 flex items-center"><AlertCircle size={14} /> By signing below, you acknowledge the timesheet details, deductions, and confirm receipt of the net value dispersed.</p>
                        </div>
                        {signed ? (
                           <div className="border border-green-500 bg-green-500/10 text-green-400 px-6 py-3 rounded-lg flex items-center gap-2 font-bold shadow-inner">
                              <CheckSquare size={20} /> Cryptographically Signed
                           </div>
                        ) : (
                           <button onClick={() => setSigned(true)} className="bg-blue-500 hover:bg-blue-400 text-white shadow-lg px-8 py-3 rounded-lg flex items-center gap-2 font-bold transition hover:-translate-y-0.5">
                              <PenTool size={18} /> Tap to Sign Document
                           </button>
                        )}
                     </div>
                  </div>

               </div>
            </div>
         </main>

         <EditHoursModal
            isOpen={!!editingDay}
            onClose={() => setEditingDay(null)}
            day={editingDay}
            staff={staff}
            onSave={handleSaveHours}
         />

         <DeductionsModal
            isOpen={showDeductions}
            onClose={() => setShowDeductions(false)}
            staff={staff}
            deductions={deductions}
            onAdd={handleAddDeduction}
            onRemove={handleRemoveDeduction}
         />
      </div>
   );
}
