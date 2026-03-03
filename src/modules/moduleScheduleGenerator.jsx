import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Settings,
  Truck,
  Edit2,
  Trash2,
  Check,
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Manage Roles</h3>
          <button onClick={onClose}>
            <Trash2 size={20} />
          </button>
        </div>
        <div className="bg-gray-50 p-3 rounded mb-4 border">
          <input
            type="text"
            className="border rounded px-2 py-1 text-sm w-full mb-2"
            placeholder="Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 mb-2">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.hex}
                onClick={() => setNewRoleColor(c.hex)}
                className={`w-6 h-6 rounded-full border ${
                  newRoleColor === c.hex ? "ring-2" : ""
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <button
            onClick={addRole}
            className="w-full bg-blue-600 text-white text-sm py-1 rounded"
          >
            Add Role
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {roles.map((r) => (
            <div
              key={r.id}
              className="flex justify-between items-center p-2 border rounded bg-white"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: r.color }}
                ></div>
                <span className="text-sm font-medium">{r.name}</span>
              </div>
              <button
                onClick={() =>
                  setRoles((prev) => prev.filter((x) => x.id !== r.id))
                }
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ModuleScheduleGenerator({
  user,
  mode = "master",
  onBack,
}) {
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
  const [requests, setRequests] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [payRate, setPayRate] = useState("");
  const [viewScope, setViewScope] = useState(
    mode === "master" ? "full" : "personal"
  );
  const [filterRole, setFilterRole] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [shiftEditModal, setShiftEditModal] = useState({
    isOpen: false,
    shift: null,
  });

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
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getMiniCalendarDays = (baseDate) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
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
    setShifts(
      shifts.map((s) =>
        s.id === shiftEditModal.shift.id ? shiftEditModal.shift : s
      )
    );
    setShiftEditModal({ isOpen: false, shift: null });
  };

  const deleteShift = () => {
    setShifts(shifts.filter((s) => s.id !== shiftEditModal.shift.id));
    setShiftEditModal({ isOpen: false, shift: null });
  };

  return (
    <div className="module-page bg-gray-100 min-h-screen">
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-800"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-800 leading-none">
                {isMasterMode ? "Master Schedule" : "My Schedule"}
              </h2>
              {user && (
                <p className="text-xs text-blue-600 font-bold">
                  {user.employeename || user.name}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200 p-0.5">
              <button
                onClick={() =>
                  isMasterMode
                    ? handleAssignMonthNav(-1)
                    : handlePersonalShiftTime(-1)
                }
                className="p-1.5 hover:bg-white rounded shadow-sm text-gray-600"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold w-24 text-center truncate px-2">
                {isMasterMode
                  ? assignMonth.toLocaleString("default", {
                      month: "short",
                      year: "numeric",
                    })
                  : viewDate.toLocaleString("default", {
                      month: "short",
                      year: "numeric",
                    })}
              </span>
              <button
                onClick={() =>
                  isMasterMode
                    ? handleAssignMonthNav(1)
                    : handlePersonalShiftTime(1)
                }
                className="p-1.5 hover:bg-white rounded shadow-sm text-gray-600"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {isMasterMode && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-blue-800 uppercase flex items-center gap-2">
                <Briefcase size={16} /> Assign Shifts
              </h3>
              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="text-xs flex items-center gap-1 bg-white border border-blue-300 text-blue-700 px-2 py-1 rounded shadow-sm hover:bg-blue-50"
              >
                <Settings size={12} /> Manage Roles
              </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    Employee
                  </label>
                  <select
                    className="w-full border p-2 rounded text-sm bg-white"
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                  >
                    <option value="">Select Staff...</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    Role
                  </label>
                  <select
                    className="w-full border p-2 rounded text-sm bg-white"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">Select Role...</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    Pay Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded text-sm"
                    placeholder="0.00"
                    value={payRate}
                    onChange={(e) => setPayRate(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full lg:w-2/3">
                <div className="w-full sm:w-72 bg-white border border-gray-300 rounded p-2 shadow-sm mx-auto lg:mx-0">
                  <div className="flex justify-between items-center mb-2">
                    <button
                      onClick={() => handleAssignMonthNav(-1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {assignMonth.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() => handleAssignMonthNav(1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div
                        key={i}
                        className="text-[10px] text-center text-gray-400 font-bold"
                      >
                        {d}
                      </div>
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
                          className={`h-8 flex itemsCenter justify-center text-xs rounded cursor-pointer transition-colors ${
                            isSel
                              ? "bg-blue-600 text-white font-bold"
                              : "hover:bg-blue-50 text-gray-700"
                          }`}
                        >
                          {d.getDate()}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={selectAllMiniCalendar}
                    className="w-full mt-3 bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold py-2 rounded hover:bg-gray-200"
                  >
                    Select All Month
                  </button>
                  <button
                    onClick={handleApplySchedule}
                    className="w-full mt-2 bg-blue-600 text-white py-2 rounded font-bold text-sm shadow hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border border-gray-200 rounded overflow-hidden shadow-sm bg-white">
          <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-300 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, i) => (
                <div
                  key={i}
                  className="py-2 text-[10px] sm:text-xs font-bold text-gray-600 uppercase border-r border-gray-200 last:border-0"
                >
                  {day}
                </div>
              )
            )}
          </div>
          <div className="grid grid-cols-7 bg-gray-50">
            {getCalendarDays().map((day, idx) => {
              if (!day)
                return (
                  <div
                    key={idx}
                    className="bg-gray-50 border-r border-b border-gray-200"
                  ></div>
                );
              const dayStr = formatDateForInput(day);
              let dayShifts = shifts.filter((s) => s.date === dayStr);
              if (!isMasterMode && viewScope === "personal")
                dayShifts = dayShifts.filter((s) => s.empId === user?.id);
              if (filterRole !== "all")
                dayShifts = dayShifts.filter((s) => s.roleId === filterRole);
              if (filterType !== "all")
                dayShifts = dayShifts.filter((s) => s.type === filterType);
              const isToday =
                day.toDateString() === new Date().toDateString();
              return (
                <div
                  key={idx}
                  className={`min-h-[80px] sm:min-h-[100px] bg-white border-r border-b border-gray-200 p-0.5 sm:p-1 relative ${
                    isToday ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div
                    className={`text-right text-[10px] sm:text-xs mb-1 px-1 ${
                      isToday ? "font-bold text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
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
                            className={`text-[8px] sm:text-[10px] p-0.5 sm:p-1 rounded border font-bold flex items-center justify-between cursor-pointer h-5 sm:h-6 overflow-hidden ${
                              isMine
                                ? "border-purple-300 bg-purple-100 text-purple-800"
                                : "border-gray-200 bg-gray-50 text-gray-500 opacity-80"
                            }`}
                          >
                            <div className="flex items-center gap-1 overflow-hidden">
                              <Truck size={10} />{" "}
                              <span className="truncate">
                                {isMasterMode || viewScope === "full"
                                  ? staffList.find(
                                      (s) => s.id === shift.empId
                                    )?.name
                                  : "Me"}
                              </span>
                            </div>
                            <span className="hidden sm:inline">Run</span>
                          </div>
                        );
                      return (
                        <div
                          key={shift.id}
                          onClick={() => openShiftEditor(shift)}
                          className={`text-[8px] sm:text-[10px] p-0.5 sm:p-1 rounded border shadow-sm cursor-pointer hover:ring-2 ring-offset-1 transition-all overflow-hidden ${
                            shift.type === "Half"
                              ? "w-full sm:w-1/2 sm:inline-block align-top"
                              : "w-full"
                          } ${
                            isCancelled
                              ? "border-red-500 bg-red-50 opacity-75"
                              : ""
                          } ${
                            !isMine && !isMasterMode ? "opacity-70" : ""
                          }`}
                          style={
                            !isCancelled
                              ? {
                                  backgroundColor: role.color + "20",
                                  borderColor: role.color,
                                  borderLeftWidth: "3px",
                                }
                              : {}
                          }
                        >
                          {(isMasterMode || viewScope === "full") && (
                            <div className="font-bold text-gray-800 truncate leading-tight">
                              {
                                staffList
                                  .find((s) => s.id === shift.empId)
                                  ?.name.split(" ")[0]
                              }
                            </div>
                          )}
                          <div
                            className={`font-medium truncate ${
                              isCancelled
                                ? "text-red-600 line-through"
                                : "text-gray-700"
                            }`}
                          >
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Edit2 size={18} /> Edit Shift
                </h3>
                <button
                  onClick={() =>
                    setShiftEditModal({ isOpen: false, shift: null })
                  }
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-500">
                    Employee
                  </label>
                  <select
                    className="w-full border p-2 rounded text-sm bg-gray-50"
                    value={shiftEditModal.shift.empId}
                    onChange={(e) =>
                      setShiftEditModal({
                        ...shiftEditModal,
                        shift: {
                          ...shiftEditModal.shift,
                          empId: e.target.value,
                        },
                      })
                    }
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">
                    Role
                  </label>
                  <select
                    className="w-full border p-2 rounded text-sm"
                    value={shiftEditModal.shift.roleId}
                    onChange={(e) =>
                      setShiftEditModal({
                        ...shiftEditModal,
                        shift: {
                          ...shiftEditModal.shift,
                          roleId: e.target.value,
                        },
                      })
                    }
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500">
                      Type
                    </label>
                    <select
                      className="w-full border p-2 rounded text-sm"
                      value={shiftEditModal.shift.type}
                      onChange={(e) =>
                        setShiftEditModal({
                          ...shiftEditModal,
                          shift: {
                            ...shiftEditModal.shift,
                            type: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="Full">Full Shift</option>
                      <option value="Half">Half Shift (4h)</option>
                      <option value="Double">Double Shift</option>
                      <option value="Transport">Transport/Run</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500">
                      Pay ($/hr)
                    </label>
                    <input
                      type="number"
                      className="w-full border p-2 rounded text-sm"
                      value={shiftEditModal.shift.pay}
                      onChange={(e) =>
                        setShiftEditModal({
                          ...shiftEditModal,
                          shift: {
                            ...shiftEditModal.shift,
                            pay: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">
                    Status
                  </label>
                  <select
                    className="w-full border p-2 rounded text-sm"
                    value={shiftEditModal.shift.status || "active"}
                    onChange={(e) =>
                      setShiftEditModal({
                        ...shiftEditModal,
                        shift: {
                          ...shiftEditModal.shift,
                          status: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <button
                  onClick={deleteShift}
                  className="text-red-500 text-sm font-bold flex items-center gap-1 hover:bg-red-50 px-3 py-2 rounded"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button
                  onClick={saveShiftEdit}
                  className="bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <RoleManager
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        roles={roles}
        setRoles={setRoles}
      />
    </div>
  );
}

