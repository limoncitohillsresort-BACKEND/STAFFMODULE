import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, Plus, Search, Edit2, Trash2, CheckCircle, BarChart2, Briefcase, FileText, WrenchIcon, ChevronLeft, MapPin, Target, Zap, CheckSquare } from 'lucide-react';
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
   { id: 't1', title: 'Deep Clean Pool', description: 'Scrub tiles and balance pH', timeframe: 'Daily', date: new Date().toISOString().split('T')[0], startTime: '09:00', durationHours: 2, assignedTo: 'E004', requiredTools: ['pool1'], status: 'Pending', rewardPrice: 0, skillLevel: 'Intermediate' },
   { id: 't2', title: 'Audit Maintenance Logs', description: 'Check quarterly compliance', timeframe: 'Monthly', date: new Date().toISOString().split('T')[0], startTime: '13:00', durationHours: 3, assignedTo: 'M001', requiredTools: [], status: 'In Progress', rewardPrice: 0, skillLevel: 'Expert' },
];

const AddTaskModal = ({ isOpen, onClose, onSave, taskToEdit }) => {
   const [formData, setFormData] = useState(taskToEdit || {
      title: '', description: '', timeframe: 'Daily', date: new Date().toISOString().split('T')[0],
      startTime: '08:00', durationHours: 1, assignedTo: 'E001', requiredTools: [], rewardPrice: 0, skillLevel: 'Beginner'
   });

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

   const checkInventory = () => {
      // Check if tools requested have available stock > 0
      let warnings = [];
      formData.requiredTools.forEach(tId => {
         const tool = INITIAL_INVENTORY.find(inv => inv.id === tId);
         if (tool && tool.available <= 0) warnings.push(`${tool.name} is currently out of stock!`);
      });
      return warnings;
   };

   const inventoryWarnings = checkInventory();

   return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 flex justify-center items-center p-4">
         <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center shrink-0">
               <h2 className="font-bold flex items-center gap-2"><Target size={18} /> {taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
               <button onClick={onClose} className="hover:text-red-400">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Task Title</label>
                     <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded focus:border-blue-500 outline-none" required />
                  </div>

                  <div className="col-span-2">
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Detailed Instructions / SOP</label>
                     <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:border-blue-500 outline-none" rows="3"></textarea>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Timeframe Scope</label>
                     <select name="timeframe" value={formData.timeframe} onChange={handleChange} className="w-full p-2 border rounded bg-slate-50 outline-none">
                        {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Assigned Staff</label>
                     <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full p-2 border rounded bg-slate-50 outline-none">
                        {STAFF_LIST.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Expected Date</label>
                     <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Start Time</label>
                        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-2 border rounded outline-none" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Est. Hours</label>
                        <input type="number" name="durationHours" value={formData.durationHours} onChange={handleChange} min="0.5" step="0.5" className="w-full p-2 border rounded outline-none" />
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Skill Level</label>
                     <select name="skillLevel" value={formData.skillLevel} onChange={handleChange} className="w-full p-2 border rounded bg-slate-50 outline-none">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Expert</option>
                     </select>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Dynamic Bounty ($)</label>
                     <input type="number" name="rewardPrice" value={formData.rewardPrice} onChange={handleChange} placeholder="0 for standard duties" className="w-full p-2 border rounded outline-none" />
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2"><WrenchIcon size={14} className="inline mr-1" /> Required Tools / Materials</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded border">
                     {INITIAL_INVENTORY.map(tool => (
                        <label key={tool.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer p-1 hover:bg-slate-100 rounded">
                           <input type="checkbox" checked={formData.requiredTools.includes(tool.id)} onChange={() => toggleTool(tool.id)} />
                           <span className="truncate">{tool.name}</span>
                           <span className="text-xs text-slate-400 ml-auto mr-2">[{tool.available} left]</span>
                        </label>
                     ))}
                  </div>
                  {inventoryWarnings.length > 0 && (
                     <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        <p className="font-bold flex items-center gap-1"><Zap size={14} /> Warning: Inventory Conflict</p>
                        <ul className="list-disc pl-4 mt-1">
                           {inventoryWarnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                     </div>
                  )}
               </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3 shrink-0">
               <button onClick={onClose} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800">Cancel</button>
               <button onClick={() => { onSave(formData); onClose(); }} className="px-6 py-2 bg-blue-600 font-bold text-white rounded hover:bg-blue-700 shadow flex items-center gap-2">
                  <CheckSquare size={18} /> Save Data
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

   // Gantt Chart Rendering Logic (Daily View)
   // X axis = Hours 06:00 to 22:00 (16 columns)
   const renderGantt = () => {
      const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

      // Group tasks by staff
      const staffTasks = STAFF_LIST.reduce((acc, staff) => {
         acc[staff.id] = tasks.filter(t => t.assignedTo === staff.id && t.date === new Date().toISOString().split('T')[0] && t.timeframe === 'Daily');
         return acc;
      }, {});

      return (
         <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col mt-4">
            <div className="bg-slate-100 p-4 border-b flex justify-between items-center">
               <h3 className="font-bold flex items-center gap-2"><BarChart2 className="text-blue-600" /> Operational Master Schedule (Today)</h3>
               <div className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full uppercase">Gantt View</div>
            </div>

            <div className="overflow-x-auto">
               <div className="min-w-[800px]">
                  {/* Header timeline */}
                  <div className="flex border-b bg-slate-50">
                     <div className="w-48 shrink-0 p-3 font-bold text-xs text-slate-500 uppercase border-r border-slate-200 flex items-center">Staff Member</div>
                     <div className="flex-1 flex">
                        {hours.map(h => (
                           <div key={h} className="flex-1 text-center p-2 text-xs font-bold text-slate-400 border-r border-slate-200 last:border-0 truncate">
                              {h.toString().padStart(2, '0')}:00
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Rows for each staff */}
                  {STAFF_LIST.map(staff => (
                     <div key={staff.id} className="flex border-b last:border-0 hover:bg-slate-50 transition relative group min-h-[60px]">
                        <div className="w-48 shrink-0 p-3 border-r border-slate-200 flex flex-col justify-center bg-white z-10">
                           <span className="font-bold text-sm text-slate-800 truncate">{staff.name}</span>
                           <span className="text-[10px] text-slate-400 uppercase tracking-widest truncate">{staff.role}</span>
                        </div>

                        <div className="flex-1 relative bg-slate-50/50">
                           {/* Background grid lines */}
                           <div className="absolute inset-0 flex pointer-events-none">
                              {hours.map(h => (
                                 <div key={'bg' + h} className="flex-1 border-r border-slate-200 border-dashed"></div>
                              ))}
                           </div>

                           {/* Task Blocks */}
                           {staffTasks[staff.id].map(task => {
                              const [h, m] = task.startTime.split(':').map(Number);
                              const startHourFloat = h + (m / 60);
                              if (startHourFloat < 6 || startHourFloat > 22) return null; // out of bounds

                              const leftPercent = ((startHourFloat - 6) / 16) * 100;
                              const widthPercent = (task.durationHours / 16) * 100;

                              let bgClass = 'bg-blue-500';
                              if (task.status === 'Completed') bgClass = 'bg-green-500';
                              else if (task.status === 'In Progress') bgClass = 'bg-orange-500';

                              return (
                                 <div
                                    key={task.id}
                                    className={`absolute top-2 bottom-2 ${bgClass} rounded shadow-sm text-white overflow-hidden p-1.5 cursor-pointer hover:shadow-md hover:brightness-110 transition z-20 flex flex-col`}
                                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%`, minWidth: '40px' }}
                                    onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                                 >
                                    <div className="text-[10px] font-bold leading-none truncate">{task.title}</div>
                                    <div className="text-[8px] opacity-80 mt-0.5 truncate">{task.startTime} ({task.durationHours}h)</div>
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
                     <div className="flex bg-slate-800 rounded-lg p-1">
                        <button onClick={() => setViewMode('admin-gantt')} className={`px-4 py-1.5 rounded text-xs font-bold transition ${viewMode === 'admin-gantt' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Gantt Timeline</button>
                        <button onClick={() => setViewMode('staff-calendar')} className={`px-4 py-1.5 rounded text-xs font-bold transition ${viewMode === 'staff-calendar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>My Calendar</button>
                     </div>
                  )}
                  {isAdmin && (
                     <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white font-bold text-sm flex items-center gap-2 shadow-lg">
                        <Plus size={16} /> New Task
                     </button>
                  )}
               </div>
            </div>
         </header>

         <main className="flex-1 overflow-auto p-4 md:p-6 max-w-7xl mx-auto w-full">

            {/* TimeScale Filter for Calendar View */}
            {viewMode === 'staff-calendar' && (
               <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {TIMEFRAMES.map(t => (
                     <button
                        key={t} onClick={() => setTimeFilter(t)}
                        className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-shadow shadow-sm ${timeFilter === t ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                     >
                        {t} Tasks
                     </button>
                  ))}
               </div>
            )}

            {viewMode === 'staff-calendar' && (
               <div className="space-y-4">
                  {myTasks.length === 0 ? (
                     <div className="bg-white border border-slate-200 border-dashed rounded-xl p-10 text-center text-slate-400 flex flex-col items-center">
                        <CheckCircle size={48} className="text-slate-200 mb-4" />
                        <p className="font-bold text-lg text-slate-500">You're all caught up!</p>
                        <p className="text-sm">No {timeFilter.toLowerCase()} tasks assigned to you right now.</p>
                     </div>
                  ) : (
                     myTasks.map(task => (
                        <div key={task.id} className="bg-white border rounded-xl shadow-sm p-4 hover:shadow-md transition relative flex flex-col md:flex-row gap-4 border-l-4 border-l-blue-500">
                           <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                 <h3 className="font-bold text-lg text-slate-800">{task.title}</h3>
                                 <div className="bg-slate-100 text-slate-600 px-3 py-1 text-xs font-bold rounded-full">{task.status}</div>
                              </div>
                              <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">{task.description}</p>

                              <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase">
                                 <div className="flex items-center gap-1"><Clock size={14} /> {task.startTime} ({task.durationHours}h)</div>
                                 <div className="flex items-center gap-1"><Calendar size={14} /> {task.date}</div>
                                 {task.rewardPrice > 0 && <div className="text-green-600 flex items-center gap-1"><Zap size={14} /> Bounty: ${task.rewardPrice}</div>}
                              </div>

                              {task.requiredTools.length > 0 && (
                                 <div className="mt-4 border-t pt-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Required Materials</span>
                                    <div className="flex flex-wrap gap-2">
                                       {task.requiredTools.map(tId => {
                                          const found = INITIAL_INVENTORY.find(i => i.id === tId);
                                          return found ? <span key={tId} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100 truncate max-w-[150px]">{found.name}</span> : null;
                                       })}
                                    </div>
                                 </div>
                              )}
                           </div>

                           <div className="flex flex-col gap-2 shrink-0 md:w-48 pt-2 md:pt-0 md:border-l md:pl-4 border-slate-100">
                              <span className="text-[10px] font-bold uppercase text-center text-slate-400">Actions</span>
                              {task.status !== 'In Progress' && task.status !== 'Completed' && (
                                 <button onClick={() => handleStatusUpdate(task.id, 'In Progress')} className="w-full py-2 bg-orange-500 text-white rounded font-bold text-xs hover:bg-orange-600 transition shadow-sm">Start Task</button>
                              )}
                              {task.status === 'In Progress' && (
                                 <button onClick={() => handleStatusUpdate(task.id, 'Completed')} className="w-full py-2 bg-green-500 text-white rounded font-bold text-xs hover:bg-green-600 transition shadow-sm">Mark Complete</button>
                              )}
                              {isAdmin && (
                                 <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
                                    <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="flex-1 py-1.5 flex justify-center text-slate-500 bg-slate-100 rounded hover:bg-blue-100 hover:text-blue-600 transition"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(task.id)} className="flex-1 py-1.5 flex justify-center text-slate-500 bg-slate-100 rounded hover:bg-red-100 hover:text-red-600 transition"><Trash2 size={14} /></button>
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
