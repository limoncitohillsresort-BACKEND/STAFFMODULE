import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, Plus, Search, Edit2, Trash2, CheckCircle, BarChart2, Briefcase, FileText, WrenchIcon, ChevronLeft, MapPin, Target, Zap, CheckSquare, X, BookOpen, Download } from 'lucide-react';
import { INITIAL_INVENTORY } from '../TESTENV/moduleToolCheckout';

// Mock Data
const STAFF_LIST = [
   { id: 'A001', name: 'Admin User', role: 'System Admin' },
   { id: 'M001', name: 'Resort Manager', role: 'Manager' },
   { id: 'E001', name: 'Dalia M.', role: 'Housekeeping' },
   { id: 'E002', name: 'Carlos R.', role: 'Engineering' },
   { id: 'E003', name: 'Sarah S.', role: 'Guest Services' },
   { id: 'E004', name: 'Mike T.', role: 'Grounds' },
   { id: 'E005', name: 'Test Staff', role: 'Staff' }
];

const TIMEFRAMES = ['Daily', 'Weekly', 'Monthly', 'Seasonal', 'Yearly'];

const INITIAL_TASKS = [
   { id: 't1', title: 'Deep Clean Pool', description: 'Scrub tiles and balance pH', timeframe: 'Daily', date: new Date().toISOString().split('T')[0], startTime: '09:00', durationHours: 2, assignedTo: 'E004', requiredTools: ['inv5'], status: 'Pending', rewardPrice: 0, skillLevel: 'Intermediate' },
   { id: 't2', title: 'Audit Maintenance Logs', description: 'Check quarterly compliance', timeframe: 'Monthly', date: new Date().toISOString().split('T')[0], startTime: '13:00', durationHours: 3, assignedTo: 'M001', requiredTools: [], status: 'In Progress', rewardPrice: 0, skillLevel: 'Expert' },
];

const MOCK_SOPS = [
   { id: 'sop1', title: 'VIP Arrival (Maracuya Standard)', description: 'The first impression is the only impression that matters. Pre-Arrival: Ensure the A/C has been running for at least 2 hours.', skillLevel: 'Intermediate' },
   { id: 'sop2', title: 'Pool Pump Maintenance', description: 'Power down before opening filter. Check pressure gauge and backwash if over 15psi.', skillLevel: 'Expert' },
   { id: 'sop3', title: 'Villa Turndown Service', description: 'Close curtains, dim lights to 30%, place slippers by bedside, restock water.', skillLevel: 'Beginner' }
];

const AddTaskModal = ({ isOpen, onClose, onSave, taskToEdit }) => {
   const [formData, setFormData] = useState(taskToEdit || {
      title: '', description: '', timeframe: 'Daily', date: new Date().toISOString().split('T')[0],
      startTime: '08:00', durationHours: 1, assignedTo: 'E001', requiredTools: [], rewardPrice: 0, skillLevel: 'Beginner'
   });

   const [showSopPicker, setShowSopPicker] = useState(false);

   if (!isOpen) return null;

   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

   const toggleTool = (toolId) => {
      setFormData(prev => ({
         ...prev,
         requiredTools: prev.requiredTools.includes(toolId)
            ? prev.requiredTools.filter(t => t !== toolId)
            : [...prev.requiredTools, toolId]
      }));
   };

   const loadSop = (sop) => {
      setFormData({
         ...formData,
         title: sop.title,
         description: sop.description,
         skillLevel: sop.skillLevel
      });
      setShowSopPicker(false);
   };

   const checkInventory = () => {
      let warnings = [];
      formData.requiredTools.forEach(tId => {
         const tool = INITIAL_INVENTORY.find(inv => inv.id === tId);
         if (tool && tool.qty < tool.minStock) warnings.push(`${tool.name} is low on stock! (${tool.qty} left)`);
      });
      return warnings;
   };

   const inventoryWarnings = checkInventory();

   return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 flex justify-center items-center p-4">
         <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center shrink-0">
               <h2 className="font-bold flex items-center gap-2"><Target size={18} /> {taskToEdit ? 'Edit Operational Task' : 'Create New Activity'}</h2>
               <button onClick={onClose} className="hover:text-red-400 transition"><X size={18} /></button>
            </div>

            <div className="flex-1 flex overflow-hidden">
               {/* Left Column: Form Fields */}
               <div className="flex-1 p-6 overflow-y-auto space-y-4 border-r border-slate-100">
                  <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-2 flex-wrap gap-2">
                     <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Task Details</h3>
                     <button type="button" onClick={() => setShowSopPicker(!showSopPicker)} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 transition border border-indigo-200">
                        <BookOpen size={14} /> Pull from Training SOP
                     </button>
                  </div>

                  {showSopPicker && (
                     <div className="bg-slate-800 text-white rounded-lg p-4 mb-4 shadow-inner animate-slideDown">
                        <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
                           <h4 className="font-bold text-sm">Select Standard Operating Procedure</h4>
                           <button onClick={() => setShowSopPicker(false)} className="text-slate-400 hover:text-white"><X size={14} /></button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                           {MOCK_SOPS.map(sop => (
                              <div key={sop.id} onClick={() => loadSop(sop)} className="bg-slate-700 hover:bg-slate-600 p-2 rounded cursor-pointer transition flex flex-col gap-1 border border-slate-600 hover:border-blue-400">
                                 <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm text-blue-100">{sop.title}</span>
                                    <span className="text-[9px] uppercase tracking-widest bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{sop.skillLevel}</span>
                                 </div>
                                 <span className="text-xs text-slate-400 truncate">{sop.description}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Task Title <span className="text-red-500">*</span></label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" required placeholder="e.g. Deep clean filter" />
                     </div>

                     <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Detailed Instructions / Guidelines</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm leading-relaxed" rows="4" placeholder="Step-by-step description..."></textarea>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Assigned Staff</label>
                        <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500">
                           {STAFF_LIST.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                        </select>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Skill Level Constraint</label>
                        <select name="skillLevel" value={formData.skillLevel} onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-slate-50 outline-none">
                           <option>Beginner</option>
                           <option>Intermediate</option>
                           <option>Expert</option>
                        </select>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Timeframe Scope</label>
                        <select name="timeframe" value={formData.timeframe} onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-slate-50 outline-none">
                           {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Dynamic Bounty ($)</label>
                        <input type="number" name="rewardPrice" value={formData.rewardPrice} onChange={handleChange} placeholder="0 for standard duties" className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                     </div>
                  </div>
               </div>

               {/* Right Column: Scheduling & Inventory */}
               <div className="w-80 shrink-0 bg-slate-50 p-6 overflow-y-auto flex flex-col gap-6">
                  <div>
                     <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Scheduling</h3>
                     <div className="space-y-4">
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Target Date</label>
                           <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded outline-none shadow-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Start Time</label>
                              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-2 border rounded outline-none shadow-sm" />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Est. Hours</label>
                              <input type="number" name="durationHours" value={formData.durationHours} onChange={handleChange} min="0.5" step="0.5" className="w-full p-2 border rounded outline-none shadow-sm" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                     <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider border-b border-slate-200 pb-2 mb-4 flex items-center justify-between">
                        <span><WrenchIcon size={14} className="inline mr-1" /> Resource Dep.</span>
                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[9px]">{formData.requiredTools.length} selected</span>
                     </h3>
                     <div className="flex-1 bg-white border border-slate-200 rounded-lg p-2 overflow-y-auto max-h-[250px] shadow-inner space-y-1">
                        {INITIAL_INVENTORY.map(tool => (
                           <label key={tool.id} className={`flex items-center gap-2 text-xs cursor-pointer p-2 rounded transition border ${formData.requiredTools.includes(tool.id) ? 'bg-blue-50 border-blue-200 text-blue-800' : 'hover:bg-slate-50 border-transparent text-slate-600'}`}>
                              <input type="checkbox" checked={formData.requiredTools.includes(tool.id)} onChange={() => toggleTool(tool.id)} className="rounded text-blue-600" />
                              <span className="font-medium flex-1 truncate">{tool.name}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${tool.qty < tool.minStock ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>{tool.qty} left</span>
                           </label>
                        ))}
                     </div>
                     {inventoryWarnings.length > 0 && (
                        <div className="mt-3 text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm animate-fadeIn">
                           <p className="font-bold flex items-center gap-1 mb-1"><AlertTriangle size={14} /> Low Inventory Warning</p>
                           <ul className="list-disc pl-4 space-y-0.5">
                              {inventoryWarnings.map((w, i) => <li key={i}>{w}</li>)}
                           </ul>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
               <button onClick={onClose} className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition">Cancel</button>
               <button onClick={() => { onSave(formData); onClose(); }} className="px-8 py-2.5 bg-blue-600 font-bold text-white rounded-lg hover:bg-blue-700 shadow-md flex items-center gap-2 transition hover:-translate-y-0.5">
                  <Save size={18} /> {taskToEdit ? 'Save Changes' : 'Publish Activity'}
               </button>
            </div>
         </div>
      </div>
   );
};

export default function ModuleActivityLog({ onBack, user }) {
   const [tasks, setTasks] = useState(INITIAL_TASKS);
   const [viewMode, setViewMode] = useState(user?.isAdmin ? 'admin-gantt' : 'staff-calendar');
   const [timeFilter, setTimeFilter] = useState('Daily');
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingTask, setEditingTask] = useState(null);

   const isAdmin = user?.isAdmin || user?.role === 'System Admin' || user?.role === 'Manager';

   const myTasks = useMemo(() => tasks.filter(t => t.assignedTo === user?.id && t.timeframe === timeFilter).sort((a, b) => a.startTime.localeCompare(b.startTime)), [tasks, user, timeFilter]);

   const handleSaveTask = (taskData) => {
      if (editingTask) {
         setTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: t.id } : t));
      } else {
         setTasks([...tasks, { ...taskData, id: 't' + Date.now(), status: 'Pending' }]);
      }
      setEditingTask(null);
   };

   const handleStatusUpdate = (taskId, newStatus) => {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
   };

   const handleDelete = (taskId) => {
      if (window.confirm('Delete this task?')) setTasks(tasks.filter(t => t.id !== taskId));
   }

   const renderGantt = () => {
      const hours = Array.from({ length: 16 }, (_, i) => i + 6);

      const staffTasks = STAFF_LIST.reduce((acc, staff) => {
         acc[staff.id] = tasks.filter(t => t.assignedTo === staff.id && t.date === new Date().toISOString().split('T')[0] && t.timeframe === 'Daily');
         return acc;
      }, {});

      return (
         <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col mt-4">
            <div className="bg-slate-100 p-4 border-b flex justify-between items-center">
               <h3 className="font-bold flex items-center gap-2"><BarChart2 className="text-blue-600" /> Operational Master Schedule (Today)</h3>
               <div className="flex items-center gap-2">
                  <button className="text-xs font-bold bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">
                     <Download size={14} /> CSV Export
                  </button>
                  <div className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider border border-blue-200 shadow-sm">Gantt View</div>
               </div>
            </div>

            <div className="overflow-x-auto">
               <div className="min-w-[800px]">
                  <div className="flex border-b bg-slate-50">
                     <div className="w-48 shrink-0 p-3 font-bold text-xs text-slate-500 uppercase border-r border-slate-200 flex items-center bg-slate-100 shadow-[inset_-4px_0_4px_-4px_rgba(0,0,0,0.1)] z-20">Resource</div>
                     <div className="flex-1 flex">
                        {hours.map(h => (
                           <div key={h} className="flex-1 text-center p-2 text-xs font-bold text-slate-400 border-r border-slate-200 last:border-0 truncate">
                              {h.toString().padStart(2, '0')}:00
                           </div>
                        ))}
                     </div>
                  </div>

                  {STAFF_LIST.map(staff => (
                     <div key={staff.id} className="flex border-b last:border-0 hover:bg-slate-50 transition relative group min-h-[64px]">
                        <div className="w-48 shrink-0 p-3 border-r border-slate-200 flex flex-col justify-center bg-white z-20 shadow-[inset_-4px_0_4px_-4px_rgba(0,0,0,0.1)] relative">
                           <span className="font-bold text-sm text-slate-800 truncate leading-tight group-hover:text-blue-600 transition">{staff.name}</span>
                           <span className="text-[9px] text-slate-400 uppercase tracking-widest truncate">{staff.role}</span>
                           {staffTasks[staff.id].length > 0 && (
                              <div className="absolute top-1/2 -translate-y-1/2 right-2 flex space-x-0.5">
                                 {staffTasks[staff.id].map(t => <div key={t.id} className={`w-1.5 h-1.5 rounded-full ${t.status === 'Completed' ? 'bg-green-500' : t.status === 'In Progress' ? 'bg-orange-500' : 'bg-blue-500'}`} />)}
                              </div>
                           )}
                        </div>

                        <div className="flex-1 relative bg-slate-50/50">
                           <div className="absolute inset-0 flex pointer-events-none">
                              {hours.map(h => (
                                 <div key={'bg' + h} className="flex-1 border-r border-slate-200 border-dashed"></div>
                              ))}
                           </div>

                           {staffTasks[staff.id].map(task => {
                              const [h, m] = task.startTime.split(':').map(Number);
                              const startHourFloat = h + (m / 60);
                              if (startHourFloat < 6 || startHourFloat > 22) return null;

                              const leftPercent = ((startHourFloat - 6) / 16) * 100;
                              const widthPercent = (task.durationHours / 16) * 100;

                              let bgClass = 'bg-blue-500';
                              if (task.status === 'Completed') bgClass = 'bg-green-500';
                              else if (task.status === 'In Progress') bgClass = 'bg-orange-500';

                              return (
                                 <div
                                    key={task.id}
                                    className={`absolute top-2 bottom-2 ${bgClass} rounded-md shadow-md text-white overflow-hidden p-1.5 cursor-pointer hover:shadow-lg hover:brightness-110 transition-all z-20 flex flex-col justify-center`}
                                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%`, minWidth: '40px' }}
                                    onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                                    title={`${task.title} (${task.startTime} - ${task.durationHours}h)`}
                                 >
                                    <div className="text-[10px] font-bold leading-tight truncate">{task.title}</div>
                                    <div className="text-[8px] opacity-80 mt-0.5 truncate font-mono bg-black/10 self-start px-1 rounded">{task.startTime} ({task.durationHours}h)</div>
                                 </div>
                              )
                           })}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      );
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
                     <h1 className="text-lg font-bold leading-none">Activity Log & Scheduler</h1>
                     <p className="text-xs text-slate-400">Task Timeline & Operations Tracking</p>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  {isAdmin && (
                     <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 shadow-inner">
                        <button onClick={() => setViewMode('admin-gantt')} className={`px-4 py-1.5 rounded text-xs font-bold transition ${viewMode === 'admin-gantt' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Gantt Timeline</button>
                        <button onClick={() => setViewMode('staff-calendar')} className={`px-4 py-1.5 rounded text-xs font-bold transition ${viewMode === 'staff-calendar' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>My Tasks</button>
                     </div>
                  )}
                  {isAdmin && (
                     <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white font-bold text-sm flex items-center gap-2 shadow-lg transition hover:-translate-y-0.5 ring-2 ring-transparent hover:ring-blue-500/50">
                        <Plus size={16} /> New Activity
                     </button>
                  )}
               </div>
            </div>
         </header>

         <main className="flex-1 overflow-auto p-4 md:p-6 max-w-7xl mx-auto w-full">

            {viewMode === 'staff-calendar' && (
               <div className="mb-6 flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-hide">
                  {TIMEFRAMES.map(t => (
                     <button
                        key={t} onClick={() => setTimeFilter(t)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition shadow-sm ${timeFilter === t ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                     >
                        {t} Tasks
                     </button>
                  ))}
               </div>
            )}

            {viewMode === 'staff-calendar' && (
               <div className="space-y-4">
                  {myTasks.length === 0 ? (
                     <div className="bg-white border text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px] border-slate-200 border-dashed rounded-xl p-10 mt-8 shadow-sm">
                        <div className="bg-slate-50 p-6 rounded-full mb-6">
                           <CheckCircle size={64} className="text-slate-300" />
                        </div>
                        <p className="font-bold text-2xl text-slate-600 mb-2">You're all caught up!</p>
                        <p className="text-sm">No {timeFilter.toLowerCase()} tasks assigned to you right now.</p>
                     </div>
                  ) : (
                     myTasks.map(task => (
                        <div key={task.id} className="bg-white border rounded-xl shadow-sm p-5 md:p-6 hover:shadow-lg transition-all relative flex flex-col md:flex-row gap-6 border-l-4 border-l-blue-500 group">
                           <div className="flex-1">
                              <div className="flex justify-between items-start mb-3">
                                 <div>
                                    <h3 className="font-bold text-xl text-slate-800 leading-tight mb-1">{task.title}</h3>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{task.skillLevel} required</span>
                                 </div>
                                 <div className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-sm border ${task.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : task.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{task.status}</div>
                              </div>
                              <p className="text-sm text-slate-600 mb-5 bg-slate-50 p-4 rounded-lg border border-slate-100 leading-relaxed">{task.description}</p>

                              <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-600 uppercase">
                                 <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"><Clock size={14} className="text-blue-500" /> {task.startTime} ({task.durationHours}h)</div>
                                 <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"><Calendar size={14} className="text-blue-500" /> {task.date}</div>
                                 {task.rewardPrice > 0 && <div className="text-green-700 flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg shadow-sm"><Zap size={14} className="text-green-600" /> Bounty: ${task.rewardPrice}</div>}
                              </div>

                              {task.requiredTools.length > 0 && (
                                 <div className="mt-5 border-t border-slate-100 pt-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2 flex items-center gap-1"><WrenchIcon size={12} /> Required Materials / Tools</span>
                                    <div className="flex flex-wrap gap-2">
                                       {task.requiredTools.map(tId => {
                                          const found = INITIAL_INVENTORY.find(i => i.id === tId);
                                          return found ? <span key={tId} className="bg-blue-50 text-blue-800 px-2.5 py-1.5 flex items-center gap-2 rounded text-xs border border-blue-100 font-medium tracking-wide shadow-sm"><Package size={14} className="text-blue-400" /> {found.name}</span> : null;
                                       })}
                                    </div>
                                 </div>
                              )}
                           </div>

                           <div className="flex flex-col gap-3 shrink-0 md:w-56 pt-3 md:pt-0 md:border-l md:pl-6 border-slate-200">
                              <span className="text-[10px] font-bold uppercase text-center text-slate-400 bg-slate-50 rounded py-1 mb-1">Quick Actions</span>
                              {task.status !== 'In Progress' && task.status !== 'Completed' && (
                                 <button onClick={() => handleStatusUpdate(task.id, 'In Progress')} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-xs transition shadow flex items-center justify-center gap-2 hover:-translate-y-0.5">Start Execution</button>
                              )}
                              {task.status === 'In Progress' && (
                                 <button onClick={() => handleStatusUpdate(task.id, 'Completed')} className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xs transition shadow flex items-center justify-center gap-2 hover:-translate-y-0.5"><CheckCircle size={16} /> Mark Completed</button>
                              )}
                              {isAdmin && (
                                 <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
                                    <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="flex-1 py-2 flex justify-center items-center gap-1 font-bold text-[10px] text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition uppercase tracking-wider"><Edit2 size={12} /> Edit</button>
                                    <button onClick={() => handleDelete(task.id)} className="flex-1 py-2 flex justify-center items-center gap-1 font-bold text-[10px] text-red-600 bg-red-50 border border-red-100 rounded hover:bg-red-100 transition uppercase tracking-wider"><Trash2 size={12} /> Delete</button>
                                 </div>
                              )}
                           </div>
                        </div>
                     ))
                  )}
               </div>
            )}

            {viewMode === 'admin-gantt' && renderGantt()}

         </main>

         <AddTaskModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
            onSave={handleSaveTask}
            taskToEdit={editingTask}
         />
      </div>
   );
}
