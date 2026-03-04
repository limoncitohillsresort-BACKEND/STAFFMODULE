import React, { useState, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Briefcase, Settings, Truck, Edit2, Trash2, Check, Plus, X, Calendar as CalendarIcon, DollarSign, Activity, Bell
} from "lucide-react";

const COLOR_PALETTE = [
  { name: "Red", hex: "#ef4444" },
  { name: "Orange", hex: "#f97316" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Green", hex: "#22c55e" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Violet", hex: "#d946ef" },
];

const formatDateDDMMYYYY = (dateObj) => {
  if (!dateObj) return "";
  const d = new Date(dateObj);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateForInput = (dateObj) => {
  if (!dateObj) return "";
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const RoleManager = ({ isOpen, onClose, roles, setRoles }) => {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleColor, setNewRoleColor] = useState("#000000");

  if (!isOpen) return null;

  const addRole = () => {
    if (!newRoleName) return;
    setRoles((prev) => [
      ...prev,
      { id: "R_" + Date.now(), name: newRoleName, color: newRoleColor },
    ]);
    setNewRoleName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><Settings size={18} /> Manage Roles</h3>
          <button onClick={onClose} className="hover:text-red-400 transition"><X size={18} /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200 shadow-inner">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Create New Role</label>
            <input
              type="text"
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full mb-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="e.g. Morning Shift"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setNewRoleColor(c.hex)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${newRoleColor === c.hex ? "border-slate-800 scale-110 shadow-md" : "border-transparent"}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <button
              onClick={addRole}
              className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition shadow"
            >
              <Plus size={16} /> Add Role
            </button>
          </div>

          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Existing Roles</h4>
          <div className="space-y-2">
            {roles.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center p-3 border border-slate-200 rounded-lg bg-white shadow-sm hover:border-blue-300 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: r.color }}></div>
                  <span className="text-sm font-bold text-slate-700">{r.name}</span>
                </div>
                <button
                  onClick={() => setRoles((prev) => prev.filter((x) => x.id !== r.id))}
                  className="text-slate-400 hover:text-red-600 transition bg-slate-50 hover:bg-red-50 p-1.5 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ModuleScheduleGenerator({ user, mode = "master", onBack }) {
  const isMasterMode = user?.role === "Resort Manager" && mode === "master";
  const [viewDate, setViewDate] = useState(new Date());
  const [roles, setRoles] = useState([
    { id: "R1", name: "Laundry AM", color: "#eab308" },
    { id: "R2", name: "Beach PM", color: "#06b6d4" },
    { id: "R3", name: "Housekeeping", color: "#22c55e" },
    { id: "R4", name: "Day Off", color: "#1f2937" },
    { id: "R5", name: "Double Shift", color: "#d946ef" },
    { id: "R6", name: "Transport", color: "#9333ea" },
  ]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [assignMonth, setAssignMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [shifts, setShifts] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [payRate, setPayRate] = useState("");
  const [viewScope, setViewScope] = useState(mode === "master" ? "full" : "personal");
  const [filterRole, setFilterRole] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [shiftEditModal, setShiftEditModal] = useState({ isOpen: false, shift: null });

  const staffList = [
    { id: "E001", name: "Dalia M." },
    { id: "E002", name: "Carlos R." },
    { id: "E003", name: "Sarah S." },
    { id: "E004", name: "Mike T." },
    { id: "E005", name: "Sarah Smith" },
  ];

  useEffect(() => {
    if (isMasterMode) setViewDate(new Date(assignMonth));
  }, [assignMonth, isMasterMode]);

  useEffect(() => {
    setViewScope(mode === "master" ? "full" : "personal");
  }, [mode]);

  const getRoleById = (id) =>
    roles.find((r) => r.id === id) || { name: "Unknown", color: "#ccc" };

  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const getMiniCalendarDays = (baseDate) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const handlePersonalShiftTime = (direction) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setViewDate(newDate);
  };

  const handleAssignMonthNav = (direction) => {
    const newDate = new Date(assignMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setAssignMonth(newDate);
  };

  const toggleDateSelection = (dateStr) => {
    const newSet = new Set(selectedDates);
    if (newSet.has(dateStr)) newSet.delete(dateStr);
    else newSet.add(dateStr);
    setSelectedDates(newSet);
  };

  const selectAllMiniCalendar = () => {
    const days = getMiniCalendarDays(assignMonth).filter((d) => d);
    const newSet = new Set(selectedDates);
    days.forEach((d) => newSet.add(formatDateForInput(d)));
    setSelectedDates(newSet);
  };

  const handleApplySchedule = () => {
    if (!selectedStaff || !selectedRole || selectedDates.size === 0) {
      alert("Please select Staff, Role, and Date.");
      return;
    }
    const datesToApply = Array.from(selectedDates);
    setShifts((prev) => {
      let updated = [...prev];
      datesToApply.forEach((dateStr) => {
        updated.push({
          id: Math.random(),
          empId: selectedStaff,
          date: dateStr,
          roleId: selectedRole,
          type: "Full",
          pay: parseFloat(payRate) || 0,
          status: "active",
        });
      });
      return updated;
    });
    setSelectedDates(new Set());
    alert("Schedule Updated!");
  };

  const openShiftEditor = (shift) => {
    if (!isMasterMode) return;
    setShiftEditModal({ isOpen: true, shift: { ...shift } });
  };

  const saveShiftEdit = () => {
    setShifts(shifts.map((s) => s.id === shiftEditModal.shift.id ? shiftEditModal.shift : s));
    setShiftEditModal({ isOpen: false, shift: null });
  };

  const deleteShift = () => {
    setShifts(shifts.filter((s) => s.id !== shiftEditModal.shift.id));
    setShiftEditModal({ isOpen: false, shift: null });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-slate-900 text-white p-4 shadow-md shrink-0 sticky top-0 z-30 tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold leading-none">
                {isMasterMode ? "Master Schedule Generator" : "My Synced Schedule"}
              </h1>
              <p className="text-xs text-blue-400 font-bold tracking-wider uppercase mt-1">
                {user ? (user.employeename || user.name) : 'Staff Portal'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 shadow-inner">
              <button
                onClick={() => isMasterMode ? handleAssignMonthNav(-1) : handlePersonalShiftTime(-1)}
                className="p-1.5 hover:bg-slate-700 rounded transition text-slate-300 hover:text-white"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold w-28 text-center truncate px-2 text-white">
                {isMasterMode
                  ? assignMonth.toLocaleString("default", { month: "short", year: "numeric" })
                  : viewDate.toLocaleString("default", { month: "short", year: "numeric" })}
              </span>
              <button
                onClick={() => isMasterMode ? handleAssignMonthNav(1) : handlePersonalShiftTime(1)}
                className="p-1.5 hover:bg-slate-700 rounded transition text-slate-300 hover:text-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col gap-6">

        {/* SYNCHRONIZED STAFF DASHBOARD (Personal Mode) */}
        {!isMasterMode && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full"><CalendarIcon size={24} /></div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shifts This Week</p>
                <p className="text-2xl font-black text-slate-800">5</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full"><DollarSign size={24} /></div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Est. Weekly Pay</p>
                <p className="text-2xl font-black text-slate-800">$450.00</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-full"><Activity size={24} /></div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Activities</p>
                <p className="text-2xl font-black text-slate-800">2 <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full ml-2 border border-orange-200">Due Today</span></p>
              </div>
            </div>
          </div>
        )}

        {isMasterMode && (
          <div className="bg-white border border-blue-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Briefcase size={120} className="text-blue-600" /></div>

            <div className="flex justify-between items-center mb-5 relative z-10 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
                <Briefcase size={18} /> Assign & Distribute Shifts
              </h3>
              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="text-xs font-bold flex items-center gap-1.5 bg-slate-50 border border-slate-300 text-slate-600 px-3 py-1.5 rounded-lg shadow-sm hover:bg-white hover:text-blue-600 transition"
              >
                <Settings size={14} /> Manage Roles
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 relative z-10">
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-inner">
                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">1. Target Employee</label>
                    <select
                      className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                    >
                      <option value="">Select Staff...</option>
                      {staffList.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">2. Role Function</label>
                    <select
                      className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="">Select Role...</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Pay Rate Override ($/hr)</label>
                    <input
                      type="number"
                      className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                      placeholder="Default: Standard Rate"
                      value={payRate}
                      onChange={(e) => setPayRate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-2/3 flex items-center justify-center lg:justify-start">
                <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-4 shadow-md">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center border-b border-slate-100 pb-2">3. Select Days & Apply</p>
                  <div className="flex justify-between items-center mb-3">
                    <button onClick={() => handleAssignMonthNav(-1)} className="p-1 hover:bg-slate-100 rounded transition text-slate-500 hover:text-slate-800"><ChevronLeft size={18} /></button>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-700">
                      {assignMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                    </span>
                    <button onClick={() => handleAssignMonthNav(1)} className="p-1 hover:bg-slate-100 rounded transition text-slate-500 hover:text-slate-800"><ChevronRight size={18} /></button>
                  </div>
                  <div className="grid grid-cols-7 mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => (
                      <div key={i} className="text-[10px] text-center text-slate-400 font-bold uppercase">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {getMiniCalendarDays(assignMonth).map((d, i) => {
                      if (!d) return <div key={i}></div>;
                      const dStr = formatDateForInput(d);
                      const isSel = selectedDates.has(dStr);
                      return (
                        <div
                          key={i}
                          onClick={() => toggleDateSelection(dStr)}
                          className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${isSel ? "bg-blue-600 text-white font-black shadow-md scale-105" : "bg-slate-50 hover:bg-blue-100 text-slate-700 font-medium hover:border-blue-300"}`}
                        >
                          {d.getDate()}
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={selectAllMiniCalendar}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-lg transition"
                    >
                      Select All
                    </button>
                    <button
                      onClick={handleApplySchedule}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold text-sm shadow hover:shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> Apply Shifts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-300 text-center shadow-[0_2px_4px_-2px_rgba(0,0,0,0.05)] z-10 relative">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, i) => (
                <div key={i} className="py-3 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest border-r border-slate-200 last:border-0">
                  {day}
                </div>
              )
            )}
          </div>
          <div className="grid grid-cols-7 bg-slate-50 relative z-0">
            {getCalendarDays().map((day, idx) => {
              if (!day) return <div key={idx} className="bg-slate-50 border-r border-b border-slate-200 opacity-50"></div>;
              const dayStr = formatDateForInput(day);
              let dayShifts = shifts.filter((s) => s.date === dayStr);
              if (!isMasterMode && viewScope === "personal") dayShifts = dayShifts.filter((s) => s.empId === user?.id);
              if (filterRole !== "all") dayShifts = dayShifts.filter((s) => s.roleId === filterRole);
              if (filterType !== "all") dayShifts = dayShifts.filter((s) => s.type === filterType);
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div key={idx} className={`min-h-[100px] sm:min-h-[120px] bg-white border-r border-b border-slate-200 p-1 sm:p-2 transition-colors ${isToday ? "bg-blue-50/40" : "hover:bg-slate-50/50"}`}>
                  <div className={`text-right text-[10px] sm:text-xs mb-1.5 px-1 ${isToday ? "font-black text-blue-600 bg-blue-100 rounded-full w-fit ml-auto py-0.5 px-2" : "font-bold text-slate-400"}`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1.5">
                    {dayShifts.map((shift) => {
                      const role = getRoleById(shift.roleId);
                      const isCancelled = shift.status === "cancelled";
                      const isTransport = shift.type === "Transport";
                      const isMine = shift.empId === user?.id;

                      if (isTransport)
                        return (
                          <div
                            key={shift.id}
                            onClick={() => openShiftEditor(shift)}
                            className={`text-[9px] sm:text-[10px] p-1 sm:p-1.5 rounded bg-purple-50 border font-bold flex items-center justify-between cursor-pointer h-6 sm:h-7 overflow-hidden transition-all shadow-sm ${isMine ? "border-purple-300 text-purple-800" : "border-slate-200 text-slate-500 opacity-80"}`}
                          >
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              <Truck size={12} className={isMine ? 'text-purple-600' : 'text-slate-400'} />{" "}
                              <span className="truncate">
                                {isMasterMode || viewScope === "full" ? staffList.find((s) => s.id === shift.empId)?.name : "Transport"}
                              </span>
                            </div>
                            <span className="hidden sm:inline bg-white px-1 py-0.5 rounded shadow-sm">Run</span>
                          </div>
                        );

                      return (
                        <div
                          key={shift.id}
                          onClick={() => openShiftEditor(shift)}
                          className={`text-[9px] sm:text-[10px] p-1.5 rounded-md border shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all overflow-hidden relative group ${shift.type === "Half" ? "w-[95%] sm:inline-block align-top" : "w-full"} ${isCancelled ? "border-red-500 bg-red-50/80 opacity-75" : ""} ${!isMine && !isMasterMode ? "opacity-70 grayscale-[30%]" : ""}`}
                          style={!isCancelled ? { backgroundColor: role.color + "15", borderColor: role.color + "50", borderLeftWidth: "4px", borderLeftColor: role.color } : {}}
                        >
                          {(isMasterMode || viewScope === "full") && (
                            <div className="font-bold text-slate-800 truncate leading-tight mb-0.5">
                              {staffList.find((s) => s.id === shift.empId)?.name.split(" ")[0]}
                            </div>
                          )}
                          <div className={`font-semibold truncate ${isCancelled ? "text-red-700 line-through" : "text-slate-700"}`}>
                            {role.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {shiftEditModal.isOpen && shiftEditModal.shift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><Edit2 size={16} /> Edit Scheduled Shift</h3>
                <button onClick={() => setShiftEditModal({ isOpen: false, shift: null })} className="hover:text-red-400 transition"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4 bg-slate-50 flex-1">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Employee</label>
                  <select
                    className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={shiftEditModal.shift.empId}
                    onChange={(e) => setShiftEditModal({ ...shiftEditModal, shift: { ...shiftEditModal.shift, empId: e.target.value } })}
                  >
                    {staffList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Role</label>
                  <select
                    className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={shiftEditModal.shift.roleId}
                    onChange={(e) => setShiftEditModal({ ...shiftEditModal, shift: { ...shiftEditModal.shift, roleId: e.target.value } })}
                  >
                    {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Duration</label>
                    <select
                      className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      value={shiftEditModal.shift.type}
                      onChange={(e) => setShiftEditModal({ ...shiftEditModal, shift: { ...shiftEditModal.shift, type: e.target.value } })}
                    >
                      <option value="Full">Full (8h)</option>
                      <option value="Half">Half (4h)</option>
                      <option value="Double">Double (16h)</option>
                      <option value="Transport">Transport</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Pay Rate</label>
                    <input
                      type="number"
                      className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      value={shiftEditModal.shift.pay}
                      onChange={(e) => setShiftEditModal({ ...shiftEditModal, shift: { ...shiftEditModal.shift, pay: e.target.value } })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Status Code</label>
                  <select
                    className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={shiftEditModal.shift.status || "active"}
                    onChange={(e) => setShiftEditModal({ ...shiftEditModal, shift: { ...shiftEditModal.shift, status: e.target.value } })}
                  >
                    <option value="active">Active & Confirmed</option>
                    <option value="cancelled">Cancelled Warning</option>
                  </select>
                </div>
              </div>
              <div className="bg-white p-4 border-t flex justify-between items-center shrink-0">
                <button
                  onClick={deleteShift}
                  className="text-red-500 text-sm font-bold flex items-center gap-1.5 hover:bg-red-50 px-4 py-2.5 rounded-lg transition"
                >
                  <Trash2 size={16} /> Delete Entry
                </button>
                <button
                  onClick={saveShiftEdit}
                  className="bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow flex items-center gap-2 transition hover:-translate-y-0.5"
                >
                  <Check size={16} /> Save Updates
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <RoleManager
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        roles={roles}
        setRoles={setRoles}
      />
    </div>
  );
}
