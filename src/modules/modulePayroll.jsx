import React, { useState } from 'react';
import { DollarSign, User, Calendar, FileText, CheckCircle, ChevronLeft, Download, Plus, AlertCircle, Percent, PenTool, CheckSquare } from 'lucide-react';

const STAFF_LIST = [
   { id: 'E001', name: 'Dalia M.', role: 'Housekeeping', rate: 450, dailyHours: 8 },
   { id: 'E002', name: 'Carlos R.', role: 'Engineering', rate: 600, dailyHours: 8 },
   { id: 'E004', name: 'Mike T.', role: 'Grounds', rate: 400, dailyHours: 8 },
];

// Mock Activity Data (simulating aggregation from moduleActivityLog.jsx & Schedule)
const WEEKLY_LOGS = {
   'E001': { daysWorked: 5, totalHours: 40, extraBounties: 150 },
   'E002': { daysWorked: 6, totalHours: 48, extraBounties: 300 }, // overtime
   'E004': { daysWorked: 4, totalHours: 32, extraBounties: 0 },
};

// Mock Deductions (from ToolCheckout discrepancies or HR Loans)
const DEDUCTIONS_DB = {
   'E001': [{ id: 'd1', reason: 'Staff Loan Installment (3/10)', amount: -200 }],
   'E002': [{ id: 'd2', reason: 'Missing Fluke Multimeter (50% charge)', amount: -100 }],
   'E004': [],
};

export default function ModulePayroll({ onBack }) {
   const [selectedStaff, setSelectedStaff] = useState('E002');
   const [signed, setSigned] = useState(false);

   const staff = STAFF_LIST.find(s => s.id === selectedStaff);
   const log = WEEKLY_LOGS[selectedStaff] || { daysWorked: 0, totalHours: 0, extraBounties: 0 };
   const deductions = DEDUCTIONS_DB[selectedStaff] || [];

   // Calculations
   const basePay = (staff.rate / staff.dailyHours) * log.totalHours;
   const totalDeductions = deductions.reduce((acc, curr) => acc + curr.amount, 0); // these are negative numbers
   const netPay = basePay + log.extraBounties + totalDeductions;

   const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

   const handleSign = () => setSigned(true);

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
               <button className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white font-bold text-sm flex items-center gap-2 shadow-lg">
                  <Download size={16} /> Export Week Disbursals
               </button>
            </div>
         </header>

         <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col xl:flex-row gap-6">

            {/* Left Side: Employee List */}
            <div className="xl:w-80 w-full shrink-0 flex flex-col gap-4">
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                  <div className="bg-slate-50 p-4 border-b border-slate-200">
                     <h2 className="font-bold flex items-center gap-2 text-slate-800"><User className="text-blue-600" /> Staff Roster (Week 24)</h2>
                  </div>
                  <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                     {STAFF_LIST.map(s => {
                        const isSelected = selectedStaff === s.id;
                        return (
                           <div
                              key={s.id}
                              onClick={() => { setSelectedStaff(s.id); setSigned(false); }}
                              className={`p-4 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition border-l-4 ${isSelected ? 'bg-blue-50 border-blue-500' : 'border-transparent'}`}
                           >
                              <div>
                                 <h3 className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{s.name}</h3>
                                 <p className="text-xs text-slate-500">{s.role}</p>
                              </div>
                              <div className="text-right">
                                 <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-bold block mb-1">
                                    {WEEKLY_LOGS[s.id].totalHours}h
                                 </span>
                              </div>
                           </div>
                        )
                     })}
                  </div>
               </div>
            </div>

            {/* Right Side: Detailed Payslip */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-fit">
               <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
                  <div>
                     <h2 className="text-2xl font-black text-slate-800">{staff.name}</h2>
                     <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{staff.role} • ID: {staff.id}</p>
                  </div>
                  <div className="text-right">
                     <div className="text-3xl font-black text-green-600">${netPay.toFixed(2)}</div>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Net Payment</p>
                  </div>
               </div>

               <div className="p-6 space-y-8">

                  {/* Weekly Calendar Mapping (Mock visual representation of logs) */}
                  <div>
                     <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2"><Calendar size={16} /> Daily Attendance Log</h3>
                     <div className="flex bg-slate-100 rounded-lg border border-slate-200 overflow-hidden text-center divide-x divide-slate-200">
                        {daysOfWeek.map((day, i) => {
                           // Just mocking the worked days randomly based on daysWorked int
                           const worked = i < log.daysWorked;
                           return (
                              <div key={day} className="flex-1 p-3 bg-white">
                                 <div className="text-xs font-bold text-slate-400 uppercase">{day}</div>
                                 <div className={`mt-2 font-bold ${worked ? 'text-green-600' : 'text-slate-300'}`}>
                                    {worked ? (staff.dailyHours + 'h') : 'OFF'}
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="grid md:grid-cols-2 gap-8">
                     {/* Earnings */}
                     <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2"><DollarSign size={16} /> Gross Earnings</h3>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                           <div className="flex justify-between text-sm">
                              <span className="text-slate-600 font-medium">Base Pay (Daily: ${staff.rate.toFixed(2)})</span>
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

                     {/* Deductions Engine */}
                     <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2"><Percent size={16} /> Adjustments & Deductions</h3>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 space-y-3">
                           {deductions.length === 0 ? (
                              <div className="text-sm text-slate-400 italic text-center py-2">No deductions this cycle.</div>
                           ) : (
                              <>
                                 {deductions.map(d => (
                                    <div key={d.id} className="flex justify-between text-sm text-red-800">
                                       <span className="font-medium truncate max-w-[180px]" title={d.reason}>{d.reason}</span>
                                       <span className="font-bold">-${Math.abs(d.amount).toFixed(2)}</span>
                                    </div>
                                 ))}
                                 <div className="pt-3 border-t border-red-200 flex justify-between font-bold text-red-900">
                                    <span>Total Deductions</span>
                                    <span>-${Math.abs(totalDeductions).toFixed(2)}</span>
                                 </div>
                              </>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Digital Signature Footer */}
                  <div className="pt-6 border-t border-slate-200">
                     <div className="bg-slate-800 rounded-xl p-6 text-white text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                           <h4 className="font-bold text-lg mb-1">Employee Verification Sign-off</h4>
                           <p className="text-slate-400 text-xs max-w-md">By signing below, you acknowledge the timesheet details, deductions, and confirm receipt of the net value dispersed.</p>
                        </div>
                        {signed ? (
                           <div className="border border-green-500 bg-green-500/10 text-green-400 px-6 py-3 rounded-lg flex items-center gap-2 font-bold">
                              <CheckSquare size={20} /> Cryptographically Signed
                           </div>
                        ) : (
                           <button onClick={handleSign} className="bg-blue-500 hover:bg-blue-400 text-white shadow-lg px-8 py-3 rounded-lg flex items-center gap-2 font-bold transition">
                              <PenTool size={18} /> Tap to Sign Document
                           </button>
                        )}
                     </div>
                  </div>

               </div>
            </div>
         </main>
      </div>
   );
}
