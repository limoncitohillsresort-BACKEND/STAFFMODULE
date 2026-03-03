import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  FileText, 
  BookOpen, 
  Calendar, 
  Activity, 
  Clock, 
  Users, 
  Home, 
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Printer,
  Trash2,
  Plus,
  X,
  Save,
  Check,
  Truck,
  DollarSign,
  Briefcase,
  Settings,
  Edit2,
  RefreshCw,
  Eraser,
  Inbox
} from 'lucide-react';

/* --- CONFIGURATION --- */
const API_URL = "YOUR_N8N_WEBHOOK_URL_HERE"; 

const COLOR_PALETTE = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Violet', hex: '#a855f7' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Magenta', hex: '#d946ef' },
  { name: 'Yellow-Green', hex: '#84cc16' },
  { name: 'Black', hex: '#1f2937' },
  { name: 'White', hex: '#ffffff' }, 
  { name: 'Purple', hex: '#9333ea' }
];

const MODULE_CONFIG = {
  // Base Modules
  buzon: { title: "Buzón RH", id: "buzon", icon: <Inbox size={24} />, color: "#e74c3c" }, // Replaces submit_complaint
  incident_report: { title: "Incident Reports", id: "incident_report", icon: <FileText size={24} />, color: "#e67e22" },
  training_manuals: { title: "Training Manuals", id: "training_manuals", icon: <BookOpen size={24} />, color: "#27ae60" },
  check_schedule: { title: "My Schedule", id: "check_schedule", icon: <Calendar size={24} />, color: "#2980b9" },
  activity_logs: { title: "Activity Logs", id: "activity_logs", icon: <Activity size={24} />, color: "#8e44ad" },
  // Manager Modules
  schedule_generator: { title: "Schedule Gen", id: "schedule_generator", icon: <Calendar size={24} />, color: "#16a085" },
  event_timeline: { title: "Event Timeline", id: "event_timeline", icon: <Clock size={24} />, color: "#f1c40f" },
  guest_logs: { title: "Guest Logs", id: "guest_logs", icon: <Users size={24} />, color: "#34495e" },
  property_management: { title: "Property Mgmt", id: "property_management", icon: <Home size={24} />, color: "#795548" },
  inventory_list: { title: "Inventory", id: "inventory_list", icon: <ClipboardList size={24} />, color: "#95a5a6" }
};

/* --- UTILS --- */
const formatDateDDMMYYYY = (dateObj) => {
  if (!dateObj) return '';
  const d = new Date(dateObj);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateForInput = (dateObj) => {
   if (!dateObj) return '';
   const year = dateObj.getFullYear();
   const month = String(dateObj.getMonth() + 1).padStart(2, '0');
   const day = String(dateObj.getDate()).padStart(2, '0');
   return `${year}-${month}-${day}`;
};

/* --- COMPONENTS --- */

// 1. Login Component
const Login = ({ onLoginSuccess }) => {
  const [employeename, setEmployeename] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if ((employeename === 'jdoe' || employeename === 'staff') && password === 'password') {
        const isManager = employeename === 'jdoe';
        const mockResponse = {
          valid: true,
          user: {
            id: isManager ? 'M001' : 'E005',
            employeename: isManager ? "John Doe" : "Sarah Smith",
            role: isManager ? "Resort Manager" : "Housekeeping Staff",
            // Removed submit_complaint, added buzon
            modules: isManager ? Object.keys(MODULE_CONFIG) : ["check_schedule", "buzon", "activity_logs"]
          }
        };
        onLoginSuccess(mockResponse.user);
      } else {
        setError("Invalid credentials. Try 'jdoe' or 'staff' with 'password'");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-header">
          <h1>EcoResort <span>Portal</span></h1>
          <p>Staff & Management Access</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Employee Name</label>
            <input type="text" value={employeename} onChange={(e) => setEmployeename(e.target.value)} placeholder="Enter 'jdoe' or 'staff'" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter 'password'" required />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="login-btn">{loading ? 'Authenticating...' : 'Sign In'}</button>
          <p className="demo-hint">Manager: <b>jdoe</b> | Staff: <b>staff</b> (Pass: <b>password</b>)</p>
        </form>
      </div>
    </div>
  );
};

// 2. Dashboard Component
const Dashboard = ({ user, onLogout, onNavigate }) => {
  const allowedModules = user.modules.filter(modKey => MODULE_CONFIG[modKey]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-info">
          <h2>Welcome, {user.employeename}</h2>
          <span className="badge">{user.role}</span>
        </div>
        <button onClick={onLogout} className="logout-btn"><LogOut size={16} style={{marginRight: '8px'}}/> Logout</button>
      </header>
      <div className="content-area">
        <div className="modules-grid">
          {allowedModules.length > 0 ? (
            allowedModules.map((modKey) => {
              const module = MODULE_CONFIG[modKey];
              return (
                <div key={modKey} className="module-card" onClick={() => onNavigate(modKey)}>
                  <div className="icon-wrapper" style={{ backgroundColor: module.color + '20', color: module.color }}>{module.icon}</div>
                  <h3>{module.title}</h3>
                </div>
              );
            })
          ) : (<div className="no-access"><p>No modules assigned.</p></div>)}
        </div>
      </div>
    </div>
  );
};

// 3. Buzon Module (Formerly Incident Report Logic)
const Buzon = ({ onBack }) => {
  const [rows, setRows] = useState([{ id: 1, date: '', time: '', location: '', description: '', witnesses: '' }, { id: 2, date: '', time: '', location: '', description: '', witnesses: '' }]);
  const [modal, setModal] = useState({ isOpen: false, rowId: null, text: '' });
  const [headerInfo] = useState({ refId: 'RH-' + Math.floor(100000 + Math.random() * 900000), currentDate: formatDateDDMMYYYY(new Date()) });

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows([...rows, { id: newId, date: '', time: '', location: '', description: '', witnesses: '' }]);
  };
  const removeRow = (id) => rows.length > 1 ? setRows(rows.filter(r => r.id !== id)) : setRows([{ id: 1, date: '', time: '', location: '', description: '', witnesses: '' }]);
  const updateRow = (id, field, value) => setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  const openEditor = (id, currentText) => setModal({ isOpen: true, rowId: id, text: currentText });
  const saveModal = () => { updateRow(modal.rowId, 'description', modal.text); setModal({ ...modal, isOpen: false }); };
  const clearForm = () => { 
    if (window.confirm('¿Está seguro de que desea borrar todo el formulario?')) { 
      setRows([{ id: 1, date: '', time: '', location: '', description: '', witnesses: '' }]); 
      const inputs = document.querySelectorAll('.cell-input');
      inputs.forEach(input => input.value = '');
    } 
  };

  return (
    <div className="module-page bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-4 flex justify-between items-center no-print">
         <div>
            <h1 className="text-2xl font-bold text-gray-800">Bitácora Confidencial de Incidentes</h1>
            <p className="text-sm text-gray-500">Documento Interno Seguro • Formulario RH-902</p>
         </div>
         <div className="flex gap-3">
            <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2">
                <ChevronLeft size={16}/> Volver
            </button>
            <button onClick={clearForm} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors">
                Borrar Formulario
            </button>
            <button onClick={() => window.print()} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                <Printer size={16} /> Imprimir / Guardar PDF
            </button>
         </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white sheet-container border border-gray-300 mb-8">
        <div className="p-6 border-b border-gray-300 bg-gray-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-800 text-white flex items-center justify-center font-bold text-xl rounded">RH</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Reporte de Mala Conducta</h2>
                <p className="text-xs text-gray-500">ESTRICTAMENTE CONFIDENCIAL</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 font-mono">ID REF: <span className="font-bold text-gray-900">{headerInfo.refId}</span></div>
              <div className="text-xs text-gray-500">Fecha: <span>{headerInfo.currentDate}</span></div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
            <strong>Instrucciones:</strong> Por favor complete todas las secciones con hechos concretos. Limítese a comportamientos observables y citas específicas. No especule sobre los motivos. Este documento es un registro legal.
          </div>
        </div>

        <div className="grid grid-cols-4 border-b border-gray-300">
           <div className="cell-header col-span-4 bg-gray-100 text-center border-b border-gray-300">Sección A: Información del Reportante</div>
           <div className="cell-header">Nombre Completo</div>
           <div className="cell-data"><input type="text" className="cell-input" placeholder="Ingrese su nombre" /></div>
           <div className="cell-header">Puesto / Cargo</div>
           <div className="cell-data"><input type="text" className="cell-input" placeholder="Ingrese su puesto" /></div>
           <div className="cell-header">No. de Empleado</div>
           <div className="cell-data"><input type="text" className="cell-input" placeholder="Ej. 88203" /></div>
           <div className="cell-header">Departamento / Área</div>
           <div className="cell-data"><input type="text" className="cell-input" placeholder="Ej. Ventas" /></div>
           <div className="cell-header">Teléfono / Ext</div>
           <div className="cell-data"><input type="text" className="cell-input" placeholder="Extensión" /></div>
           <div className="cell-header">Correo Electrónico</div>
           <div className="cell-data"><input type="email" className="cell-input" placeholder="correo@empresa.com" /></div>
        </div>

        <div className="grid grid-cols-4 border-b border-gray-300">
           <div className="cell-header col-span-4 bg-gray-100 text-center border-b border-gray-300">Sección B: Contexto del Incidente</div>
           <div className="cell-header col-span-1">Naturaleza del Incidente</div>
           <div className="cell-data col-span-3">
              <select className="cell-input cursor-pointer bg-white" defaultValue="">
                 <option value="" disabled>Seleccione categoría...</option>
                 <option>Acoso / Hostigamiento Laboral</option>
                 <option>Discriminación</option>
                 <option>Robo / Daño a Propiedad</option>
                 <option>Violación de Seguridad</option>
                 <option>Insubordinación</option>
                 <option>Abuso de Sustancias</option>
                 <option>Otro (Especifique en notas)</option>
              </select>
           </div>
           <div className="cell-header col-span-1">Partes Involucradas</div>
           <div className="cell-data col-span-3"><input type="text" className="cell-input" placeholder="Nombre(s) de la(s) persona(s) reportada(s)" /></div>
        </div>

        <div>
          <div className="cell-header bg-gray-100 text-center border-b border-gray-300">Sección C: Bitácora Cronológica de Eventos</div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="cell-header w-24">Fecha</th>
                <th className="cell-header w-24">Hora</th>
                <th className="cell-header w-48">Ubicación</th>
                <th className="cell-header">Descripción del Evento / Comportamiento / Cita</th>
                <th className="cell-header w-48">Testigos Presentes</th>
                <th className="cell-header w-12 text-center no-print">Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="cell-data"><input type="date" className="cell-input" value={row.date} onChange={(e) => updateRow(row.id, 'date', e.target.value)} /></td>
                  <td className="cell-data"><input type="time" className="cell-input" value={row.time} onChange={(e) => updateRow(row.id, 'time', e.target.value)} /></td>
                  <td className="cell-data"><input type="text" className="cell-input" placeholder="Ej. Comedor" value={row.location} onChange={(e) => updateRow(row.id, 'location', e.target.value)} /></td>
                  <td className="cell-data relative group">
                    <div className={`cell-desc-preview ${!row.description ? 'empty' : ''}`} onClick={() => openEditor(row.id, row.description)} data-placeholder="Clic para redactar detalles...">
                      {row.description}
                    </div>
                  </td>
                  <td className="cell-data"><input type="text" className="cell-input" placeholder="Nombres" value={row.witnesses} onChange={(e) => updateRow(row.id, 'witnesses', e.target.value)} /></td>
                  <td className="cell-data text-center no-print">
                    <button onClick={() => removeRow(row.id)} className="text-red-400 hover:text-red-600 font-bold p-2"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-2 bg-gray-50 border-b border-gray-300 no-print">
            <button onClick={addRow} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"><Plus size={16} /> Añadir Fila de Entrada</button>
          </div>
        </div>

        <div className="p-6 bg-white">
           <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Declaración de Veracidad</h3>
           <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Al firmar a continuación, certifico que la información proporcionada en este reporte es verdadera y precisa según mi leal saber y entender. Entiendo que presentar un reporte de mala conducta a sabiendas de que es falso puede resultar en medidas disciplinarias.
           </p>
           <div className="flex flex-col md:flex-row gap-8 mt-8">
              <div className="flex-1">
                 <div className="border-b-2 border-gray-300 mb-2">
                    <input type="text" className="w-full py-1 bg-transparent outline-none font-script text-xl text-blue-900" placeholder="(Escriba su nombre como firma)" />
                 </div>
                 <label className="text-xs text-gray-500 uppercase font-bold">Firma del Empleado</label>
              </div>
              <div className="w-48">
                 <div className="border-b-2 border-gray-300 mb-2 h-9 flex items-end pb-1">
                    <span className="text-gray-900">{headerInfo.currentDate}</span>
                 </div>
                 <label className="text-xs text-gray-500 uppercase font-bold">Fecha de Firma</label>
              </div>
           </div>
        </div>

        <div className="bg-gray-100 p-4 border-t border-gray-300 text-center text-xs text-gray-400">
           <p>Depto. de RH • Uso Interno Exclusivo • No Distribuir</p>
        </div>
      </div>

      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Editor de Descripción</h3>
              <button onClick={() => setModal({...modal, isOpen: false})} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-4 flex-1">
              <p className="text-sm text-gray-500 mb-2">Detalle el evento. Use saltos de línea para mayor claridad.</p>
              <textarea value={modal.text} onChange={(e) => setModal({...modal, text: e.target.value})} className="w-full h-64 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 leading-relaxed resize-none"></textarea>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
              <button onClick={() => setModal({...modal, isOpen: false})} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 font-medium">Cancelar</button>
              <button onClick={saveModal} className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 font-medium shadow-sm">Insertar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Role Manager Component
const RoleManager = ({ isOpen, onClose, roles, setRoles }) => {
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#000000');

  if (!isOpen) return null;

  const addRole = () => {
    if(!newRoleName) return;
    const newId = 'R_' + Date.now();
    setRoles(prev => [...prev, { id: newId, name: newRoleName, color: newRoleColor }]);
    setNewRoleName('');
  };

  const deleteRole = (id) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Manage Roles</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="bg-gray-50 p-3 rounded mb-4 border border-gray-200">
          <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Add New Role</h4>
          <div className="flex gap-2 mb-2">
            <input type="text" className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Role Name" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {COLOR_PALETTE.map(c => (
              <button key={c.hex} onClick={() => setNewRoleColor(c.hex)} className={`w-6 h-6 rounded-full border border-gray-200 ${newRoleColor === c.hex ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`} style={{ backgroundColor: c.hex }} title={c.name} />
            ))}
          </div>
          <button onClick={addRole} className="w-full bg-blue-600 text-white text-sm py-1 rounded">Add Role</button>
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {roles.map(r => (
            <div key={r.id} className="flex justify-between items-center p-2 border rounded bg-white">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: r.color }}></div>
                <span className="text-sm font-medium">{r.name}</span>
              </div>
              <button onClick={() => deleteRole(r.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Schedule Generator Module
const ScheduleGenerator = ({ user, onBack, mode = 'personal' }) => {
  // Mode check: user must be manager AND in master mode to see edit controls
  const isMasterMode = user.role === 'Resort Manager' && mode === 'master';
  
  const [viewDate, setViewDate] = useState(new Date());
  
  // Roles
  const [roles, setRoles] = useState([
    { id: 'R1', name: 'Laundry AM', color: '#eab308' },
    { id: 'R2', name: 'Beach PM', color: '#06b6d4' },
    { id: 'R3', name: 'Housekeeping', color: '#22c55e' },
    { id: 'R4', name: 'Day Off', color: '#1f2937' },
    { id: 'R5', name: 'Double Shift', color: '#d946ef' },
    { id: 'R6', name: 'Transport', color: '#9333ea' }
  ]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const [staffList] = useState([
    { id: 'E001', name: 'Dalia M.' },
    { id: 'E002', name: 'Carlos R.' },
    { id: 'E003', name: 'Sarah S.' },
    { id: 'E004', name: 'Mike T.' },
    { id: 'E005', name: 'Sarah Smith' }
  ]);

  // Shifts (status: 'active' | 'cancelled')
  const [shifts, setShifts] = useState([
    { id: 1, empId: 'E001', date: formatDateForInput(new Date()), roleId: 'R1', type: 'AM', pay: 15, status: 'active' },
    { id: 3, empId: 'E005', date: formatDateForInput(new Date()), roleId: 'R3', type: 'Full', pay: 20, status: 'active' },
  ]);

  const [requests, setRequests] = useState([
    { id: 1, empId: 'E002', type: 'Day Off', date: formatDateForInput(new Date(Date.now() + 864000000)), note: 'Dentist Appt', status: 'pending' },
    { id: 2, empId: 'E005', type: 'Transport', date: formatDateForInput(new Date(Date.now() + 432000000)), note: 'Resupply run', status: 'pending' }
  ]);

  // Admin Assignment UI State
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [payRate, setPayRate] = useState('');
  const [assignMonth, setAssignMonth] = useState(new Date()); 
  const [selectedDates, setSelectedDates] = useState(new Set()); 

  const [shiftEditModal, setShiftEditModal] = useState({ isOpen: false, shift: null });
  
  // New Request Modal State
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('Day Off');
  const [requestDate, setRequestDate] = useState('');
  const [requestNote, setRequestNote] = useState('');
  
  // For picking date in request modal
  const [reqMonth, setReqMonth] = useState(new Date());

  // --- SYNC VIEW WITH MINI CALENDAR ---
  // This hook updates the Master Calendar view whenever the Mini Calendar month changes
  useEffect(() => {
    setViewDate(new Date(assignMonth));
  }, [assignMonth]);

  // --- HELPERS ---
  const getRoleById = (id) => roles.find(r => r.id === id) || { name: 'Unknown', color: '#ccc' };

  // Master Calendar Days (Rolling 28)
  const getCalendarDays = () => {
    const days = [];
    const start = new Date(viewDate);
    start.setDate(start.getDate() - start.getDay()); // Start Sunday
    for (let i = 0; i < 28; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Mini Calendar Days (Month)
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

  const calculateWeeklyStats = () => {
    const calendarDays = getCalendarDays();
    const weeks = [0, 1, 2, 3].map(weekIndex => {
      const startIdx = weekIndex * 7;
      const endIdx = startIdx + 7;
      const weekDays = calendarDays.slice(startIdx, endIdx);
      const startStr = formatDateDDMMYYYY(weekDays[0]);
      const endStr = formatDateDDMMYYYY(weekDays[6]);
      
      let totalHours = 0;
      let totalPay = 0;

      weekDays.forEach(day => {
        const dayStr = formatDateForInput(day);
        const dayShifts = shifts.filter(s => s.empId === user.id && s.date === dayStr && s.status !== 'cancelled');
        
        dayShifts.forEach(shift => {
          const hours = shift.type === 'Full' ? 8 : shift.type === 'Half' ? 4 : shift.type === 'Double' ? 16 : 0;
          totalHours += hours;
          totalPay += hours * shift.pay;
        });
      });

      return { weekLabel: `${startStr} - ${endStr}`, hours: totalHours, pay: totalPay };
    });
    return weeks;
  };

  // --- HANDLERS ---
  const handleShiftTime = (direction) => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + (direction * 28));
    setViewDate(newDate);
  };

  const toggleDateSelection = (dateStr) => {
    const newSet = new Set(selectedDates);
    if (newSet.has(dateStr)) newSet.delete(dateStr);
    else newSet.add(dateStr);
    setSelectedDates(newSet);
  };

  const selectAllMiniCalendar = () => {
    const days = getMiniCalendarDays(assignMonth).filter(d => d);
    const newSet = new Set(selectedDates);
    days.forEach(d => newSet.add(formatDateForInput(d))); // Use consistent formatted string
    setSelectedDates(newSet);
  };

  const handleApplySchedule = (isReplacement = false) => {
    if (!selectedStaff || !selectedRole || selectedDates.size === 0) {
      alert("Please select Staff, Role, and at least one Date.");
      return;
    }

    const datesToApply = Array.from(selectedDates);
    
    setShifts(prevShifts => {
      let updatedShifts = isReplacement 
        ? prevShifts.filter(s => !(s.empId === selectedStaff && selectedDates.has(s.date)))
        : [...prevShifts];

      datesToApply.forEach(dateStr => {
        const existingShiftIndex = !isReplacement 
          ? updatedShifts.findIndex(s => s.empId === selectedStaff && s.date === dateStr && s.status === 'active') 
          : -1;

        if (existingShiftIndex >= 0) {
          updatedShifts[existingShiftIndex] = { ...updatedShifts[existingShiftIndex], type: 'Half' };
          updatedShifts.push({
            id: Math.random(),
            empId: selectedStaff,
            date: dateStr,
            roleId: selectedRole,
            type: 'Half',
            pay: parseFloat(payRate) || 0,
            status: 'active'
          });
        } else {
          updatedShifts.push({
            id: Math.random(),
            empId: selectedStaff,
            date: dateStr,
            roleId: selectedRole,
            type: 'Full',
            pay: parseFloat(payRate) || 0,
            status: 'active'
          });
        }
      });
      return updatedShifts;
    });

    setSelectedDates(new Set());
    alert(isReplacement ? "Shifts Replaced!" : "Schedule Updated!");
  };

  const handleClearEmployeeShifts = () => {
    if (!selectedStaff || selectedDates.size === 0) {
      alert("Select Staff and Dates to clear.");
      return;
    }
    if (window.confirm("Remove shifts for selected employee on these dates?")) {
      setShifts(prev => prev.filter(s => !(s.empId === selectedStaff && selectedDates.has(s.date))));
      setSelectedDates(new Set());
    }
  };

  const handleClearMonthCalendar = () => {
    if (window.confirm("ARE YOU SURE? This will delete ALL shifts for ALL employees in the selected month.")) {
      const year = assignMonth.getFullYear();
      const month = assignMonth.getMonth();
      const firstDayStr = formatDateForInput(new Date(year, month, 1));
      const lastDayStr = formatDateForInput(new Date(year, month + 1, 0));
      
      setShifts(prev => prev.filter(s => s.date < firstDayStr || s.date > lastDayStr));
      alert("Month cleared.");
    }
  };

  const handleRequestAction = (reqId, action) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: action } : r));
    
    if (action === 'approved') {
      const req = requests.find(r => r.id === reqId);
      
      if (req.type === 'Day Off') {
        const scheduledShift = shifts.find(s => s.empId === req.empId && s.date === req.date);
        if (scheduledShift) {
          setShifts(prev => prev.map(s => s.id === scheduledShift.id ? { ...s, status: 'cancelled' } : s));
        } else {
           let dayOffRole = roles.find(r => r.name === 'Day Off') || roles.find(r => r.id === 'R4');
           setShifts(prev => [...prev, { id: Math.random(), empId: req.empId, date: req.date, roleId: dayOffRole.id, type: 'Full', pay: 0, status: 'active' }]);
        }
      } else if (req.type === 'Transport') {
         let transportRole = roles.find(r => r.name === 'Transport') || roles.find(r => r.id === 'R6');
         setShifts(prev => [...prev, {
           id: Math.random(),
           empId: req.empId,
           date: req.date,
           roleId: transportRole.id,
           type: 'Transport', 
           pay: 0,
           status: 'active'
         }]);
      }
    }
  };

  const openShiftEditor = (shift) => { if (!isMasterMode) return; setShiftEditModal({ isOpen: true, shift: { ...shift } }); };
  const saveShiftEdit = () => {
    const updated = shiftEditModal.shift;
    setShifts(shifts.map(s => s.id === updated.id ? updated : s));
    setShiftEditModal({ isOpen: false, shift: null });
  };
  const deleteShift = () => {
    setShifts(shifts.filter(s => s.id !== shiftEditModal.shift.id));
    setShiftEditModal({ isOpen: false, shift: null });
  };
  const handleSubmitRequest = () => {
    if (!requestDate || !requestNote) {
      alert("Please select a date and enter a reason.");
      return;
    }
    const newReq = { id: Math.random(), empId: user.id, type: requestType, date: requestDate, note: requestNote, status: 'pending' };
    setRequests([...requests, newReq]); setRequestNote(''); setRequestDate(''); alert("Request Submitted");
  };

  return (
    <div className="module-page bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center no-print">
         <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900"><ChevronLeft size={20} /> Back to Dashboard</button>
         <div className="text-right">
           <h2 className="text-xl font-bold text-gray-800">{isMasterMode ? "Master Schedule Generator" : "My Schedule"}</h2>
           <p className="text-sm font-bold text-blue-600">{user.employeename}</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white sheet-container border border-gray-300 mb-8 p-6">
        
        {/* --- ADMIN CONTROLS --- */}
        {isMasterMode && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-blue-800 uppercase flex items-center gap-2"><Briefcase size={16}/> Assign Shifts</h3>
              <button onClick={() => setIsRoleModalOpen(true)} className="text-xs flex items-center gap-1 bg-white border border-blue-300 text-blue-700 px-2 py-1 rounded shadow-sm hover:bg-blue-50">
                <Settings size={12}/> Manage Roles
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column: Parameters */}
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                 <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Employee</label>
                    <select className="w-full border p-2 rounded text-sm bg-white" value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)}>
                      <option value="">Select Staff...</option>
                      {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Role</label>
                    <select className="w-full border p-2 rounded text-sm bg-white" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                      <option value="">Select Role...</option>
                      {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Pay Rate ($/hr)</label>
                    <input type="number" className="w-full border p-2 rounded text-sm" placeholder="0.00" value={payRate} onChange={e => setPayRate(e.target.value)} />
                 </div>
                 <div className="mt-auto">
                    <p className="text-[10px] text-gray-500 italic">* Select dates on grid to apply</p>
                 </div>
              </div>

              {/* Right Column: Calendar & Actions */}
              <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-4">
                 <div className="w-72 bg-white border border-gray-300 rounded p-2 shadow-sm flex-shrink-0">
                    <div className="flex justify-between items-center mb-2">
                       <button onClick={() => setAssignMonth(new Date(assignMonth.setMonth(assignMonth.getMonth()-1)))} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={16}/></button>
                       <span className="text-xs font-bold">{assignMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                       <button onClick={() => setAssignMonth(new Date(assignMonth.setMonth(assignMonth.getMonth()+1)))} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={16}/></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="text-[10px] text-center text-gray-400 font-bold">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {getMiniCalendarDays(assignMonth).map((d, i) => {
                        if (!d) return <div key={i}></div>;
                        const dStr = formatDateForInput(d);
                        const isSel = selectedDates.has(dStr);
                        return (
                          <div key={i} 
                               onClick={() => toggleDateSelection(dStr)}
                               className={`h-8 flex items-center justify-center text-xs rounded cursor-pointer transition-colors
                               ${isSel ? 'bg-blue-600 text-white font-bold' : 'hover:bg-blue-50 text-gray-700'}`}>
                            {d.getDate()}
                          </div>
                        )
                      })}
                    </div>
                    <button onClick={selectAllMiniCalendar} className="w-full mt-3 bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold py-2 rounded hover:bg-gray-200">
                      Select All Month
                    </button>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex-1 grid grid-cols-2 gap-3 content-start">
                    <button onClick={() => handleApplySchedule(false)} className="bg-blue-600 text-white py-2 rounded font-bold text-xs shadow hover:bg-blue-700 flex flex-col items-center justify-center gap-1">
                      <Plus size={16}/> Apply to Calendar
                    </button>
                    <button onClick={() => handleApplySchedule(true)} className="bg-orange-500 text-white py-2 rounded font-bold text-xs shadow hover:bg-orange-600 flex flex-col items-center justify-center gap-1">
                      <RefreshCw size={16}/> Replace Shifts
                    </button>
                    <button onClick={handleClearEmployeeShifts} className="bg-gray-200 text-gray-700 py-2 rounded font-bold text-xs shadow hover:bg-gray-300 flex flex-col items-center justify-center gap-1">
                      <Eraser size={16}/> Clear Emp. Shifts
                    </button>
                    <button onClick={handleClearMonthCalendar} className="bg-red-50 text-red-600 border border-red-200 py-2 rounded font-bold text-xs shadow hover:bg-red-100 flex flex-col items-center justify-center gap-1">
                      <Trash2 size={16}/> Clear Month
                    </button>
                    <div className="col-span-2 text-[10px] text-gray-400 text-center mt-2">
                      Use "Clear Month" to wipe the entire schedule for the selected view.
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MASTER CALENDAR GRID --- */}
        <div className="flex justify-between items-center mb-2 px-2">
           <button onClick={() => handleShiftTime(-1)} className="flex items-center text-sm font-bold text-gray-600 hover:text-blue-600 px-3 py-1 border rounded bg-white"><ChevronLeft size={16}/> Prev Month</button>
           <span className="font-mono text-sm font-bold bg-gray-100 px-3 py-1 rounded border">View: {formatDateDDMMYYYY(getCalendarDays()[0])} — {formatDateDDMMYYYY(getCalendarDays()[27])}</span>
           <button onClick={() => handleShiftTime(1)} className="flex items-center text-sm font-bold text-gray-600 hover:text-blue-600 px-3 py-1 border rounded bg-white">Next Month <ChevronRight size={16}/></button>
        </div>

        <div className="border border-gray-200 rounded overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-300 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="py-2 text-xs font-bold text-gray-600 uppercase border-r border-gray-200 last:border-0">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 bg-gray-50">
            {getCalendarDays().map((day, idx) => {
              const dayStr = formatDateForInput(day);
              let dayShifts = shifts.filter(s => s.date === dayStr);
              if (!isMasterMode) dayShifts = dayShifts.filter(s => s.empId === user.id);
              
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <div key={idx} className={`min-h-[120px] bg-white border-r border-b border-gray-200 p-1 relative ${isToday ? 'bg-blue-50/30' : ''}`}>
                  <div className={`text-right text-xs mb-1 px-1 ${isToday ? 'font-bold text-blue-600' : 'text-gray-400'}`}>{day.getDate()}</div>
                  <div className="space-y-1">
                    {dayShifts.map((shift) => {
                      const role = getRoleById(shift.roleId);
                      const isCancelled = shift.status === 'cancelled';
                      const isTransport = shift.type === 'Transport';

                      // Transport / Supply Run Styling
                      if (isTransport) {
                        return (
                          <div key={shift.id}
                               onClick={() => openShiftEditor(shift)}
                               className="text-[10px] p-1 rounded border border-purple-200 bg-purple-50 text-purple-700 font-bold flex items-center justify-between cursor-pointer hover:bg-purple-100 h-6">
                             <div className="flex items-center gap-1 overflow-hidden">
                               <Truck size={10}/> 
                               <span className="truncate">{isMasterMode ? staffList.find(s=>s.id === shift.empId)?.name : 'Me'}</span>
                             </div>
                             <span>Run</span>
                          </div>
                        );
                      }

                      // Standard Shift Styling
                      return (
                        <div key={shift.id} 
                             onClick={() => openShiftEditor(shift)}
                             className={`text-[10px] p-1 rounded border shadow-sm cursor-pointer hover:ring-2 ring-offset-1 transition-all
                             ${shift.type === 'Half' ? 'w-1/2 inline-block align-top' : 'w-full'}
                             ${isCancelled ? 'border-red-500 bg-red-50 opacity-75' : ''}`}
                             style={!isCancelled ? { backgroundColor: role.color + '20', borderColor: role.color, borderLeftWidth: '4px' } : {}}>
                          {isMasterMode && <div className="font-bold text-gray-800 truncate leading-tight">{staffList.find(s=>s.id === shift.empId)?.name}</div>}
                          <div className={`font-medium truncate ${isCancelled ? 'text-red-600 line-through' : 'text-gray-700'}`}>{role.name}</div>
                          <div className="text-gray-500 flex justify-between scale-90 origin-left">
                            <span>{isCancelled ? 'CANCELLED' : shift.type}</span>
                            {isMasterMode && !isCancelled && <span>${shift.pay}</span>}
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

        {/* --- WEEKLY PAYOUT TABLE (Personal Only) --- */}
        {!isMasterMode && (
          <div className="mt-6 border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-bold text-sm text-gray-700">Estimated Weekly Payout</div>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                  <th className="px-4 py-2 font-medium">Week Range</th>
                  <th className="px-4 py-2 font-medium">Total Hours</th>
                  <th className="px-4 py-2 font-medium text-right">Est. Amount</th>
                </tr>
              </thead>
              <tbody>
                {calculateWeeklyStats().map((week, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-2">{week.weekLabel}</td>
                    <td className="px-4 py-2 font-medium">{week.hours}h</td>
                    <td className="px-4 py-2 text-right font-bold text-green-700">${week.pay.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- PENDING REQUESTS --- */}
        <div className="mt-8 border-t pt-6">
           <h3 className="text-sm font-bold text-gray-700 mb-4">{isMasterMode ? "Pending Staff Requests" : "My Requests"}</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.filter(r => isMasterMode || r.empId === user.id).map(req => (
                 <div key={req.id} className="border p-3 rounded bg-white shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                         <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${req.type === 'Day Off' ? 'bg-pink-100 text-pink-700' : 'bg-indigo-100 text-indigo-700'}`}>{req.type}</span>
                         <span className={`text-xs font-bold ${req.status === 'approved' ? 'text-green-600' : req.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{req.status}</span>
                      </div>
                      <div className="text-xs font-bold mb-1">{formatDateDDMMYYYY(req.date)} — {isMasterMode ? staffList.find(s=>s.id === req.empId)?.name : 'Me'}</div>
                      <p className="text-xs text-gray-600 italic border-l-2 pl-2 border-gray-200">"{req.note}"</p>
                    </div>
                    {isMasterMode && req.status === 'pending' && (
                       <div className="flex gap-2 mt-3 pt-2 border-t">
                          <button onClick={() => handleRequestAction(req.id, 'approved')} className="flex-1 bg-green-50 text-green-700 text-xs font-bold py-1 rounded hover:bg-green-100">Approve</button>
                          <button onClick={() => handleRequestAction(req.id, 'denied')} className="flex-1 bg-red-50 text-red-700 text-xs font-bold py-1 rounded hover:bg-red-100">Deny</button>
                       </div>
                    )}
                 </div>
              ))}
              {!isMasterMode && (
                <div className="border border-dashed border-gray-300 p-3 rounded bg-gray-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-blue-400 transition-colors" 
                     onClick={() => setNewRequestModalOpen(true)}>
                   <Plus size={24} className="text-gray-400 mb-1"/>
                   <span className="text-xs font-bold text-gray-500">New Request</span>
                </div>
              )}
           </div>
        </div>
      </div>

      <RoleManager isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} roles={roles} setRoles={setRoles} />

      {/* New Request Modal */}
      {newRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
             <div className="flex justify-between items-center mb-4 pb-2 border-b">
               <h3 className="text-lg font-bold flex items-center gap-2"><Edit2 size={18}/> Submit Request</h3>
               <button onClick={() => setNewRequestModalOpen(false)}><X size={20}/></button>
             </div>
             
             <div className="space-y-4">
                {/* Mini Calendar for Selection */}
                <div className="border rounded p-2">
                   <div className="flex justify-between items-center mb-2">
                       <button onClick={() => setReqMonth(new Date(reqMonth.setMonth(reqMonth.getMonth()-1)))} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={16}/></button>
                       <span className="text-xs font-bold">{reqMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                       <button onClick={() => setReqMonth(new Date(reqMonth.setMonth(reqMonth.getMonth()+1)))} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={16}/></button>
                   </div>
                   <div className="grid grid-cols-7 gap-1">
                      {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} className="text-[10px] text-center text-gray-400">{d}</div>)}
                      {getMiniCalendarDays(reqMonth).map((d, i) => {
                        if (!d) return <div key={i}></div>;
                        const dStr = formatDateForInput(d);
                        const isSel = requestDate === dStr;
                        return (
                          <div key={i} 
                               onClick={() => setRequestDate(dStr)}
                               className={`h-7 flex items-center justify-center text-xs rounded cursor-pointer ${isSel ? 'bg-blue-600 text-white font-bold' : 'hover:bg-blue-50'}`}>
                            {d.getDate()}
                          </div>
                        )
                      })}
                   </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Request Type</label>
                  <select className="w-full border p-2 rounded text-sm bg-gray-50" 
                    value={requestType} 
                    onChange={e => setRequestType(e.target.value)}>
                    <option value="Vacation">Vacation</option>
                    <option value="Day Off">Day Off</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Transport">Transport</option>
                    <option value="Supply Run">Supply Run</option>
                    <option value="Reschedule">Reschedule</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Reason (Required)</label>
                  <textarea className="w-full h-20 border p-2 rounded text-sm resize-none"
                    placeholder="Please explain why..."
                    value={requestNote}
                    onChange={e => setRequestNote(e.target.value)}></textarea>
                </div>

                <button onClick={handleSubmitRequest} className="w-full bg-blue-600 text-white py-2 rounded font-bold text-sm shadow hover:bg-blue-700">
                  Submit Request
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Shift Editor Modal (Admin Only) */}
      {shiftEditModal.isOpen && shiftEditModal.shift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
             <div className="flex justify-between items-center mb-4 pb-2 border-b">
               <h3 className="text-lg font-bold flex items-center gap-2"><Edit2 size={18}/> Edit Shift</h3>
               <button onClick={() => setShiftEditModal({isOpen:false, shift:null})}><X size={20}/></button>
             </div>
             
             <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-500">Employee</label>
                  <select className="w-full border p-2 rounded text-sm bg-gray-50" 
                    value={shiftEditModal.shift.empId} 
                    onChange={e => setShiftEditModal({ ...shiftEditModal, shift: { ...shiftEditModal.shift, empId: e.target.value }})}>
                    {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">Role</label>
                  <select className="w-full border p-2 rounded text-sm" 
                    value={shiftEditModal.shift.roleId} 
                    onChange={e => setShiftEditModal({ ...shiftEditModal, shift: { ...shiftEditModal.shift, roleId: e.target.value }})}>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                   <div className="flex-1">
                      <label className="text-xs font-bold text-gray-500">Type</label>
                      <select className="w-full border p-2 rounded text-sm" 
                        value={shiftEditModal.shift.type} 
                        onChange={e => setShiftEditModal({ ...shiftEditModal, shift: { ...shiftEditModal.shift, type: e.target.value }})}>
                        <option value="Full">Full Shift</option>
                        <option value="Half">Half Shift (4h)</option>
                        <option value="Double">Double Shift</option>
                        <option value="Transport">Transport/Run</option>
                      </select>
                   </div>
                   <div className="flex-1">
                      <label className="text-xs font-bold text-gray-500">Pay ($/hr)</label>
                      <input type="number" className="w-full border p-2 rounded text-sm" 
                        value={shiftEditModal.shift.pay} 
                        onChange={e => setShiftEditModal({ ...shiftEditModal, shift: { ...shiftEditModal.shift, pay: e.target.value }})} />
                   </div>
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500">Status</label>
                   <select className="w-full border p-2 rounded text-sm"
                     value={shiftEditModal.shift.status || 'active'}
                     onChange={e => setShiftEditModal({ ...shiftEditModal, shift: { ...shiftEditModal.shift, status: e.target.value }})}>
                     <option value="active">Active</option>
                     <option value="cancelled">Cancelled</option>
                   </select>
                </div>
             </div>

             <div className="flex justify-between pt-2 border-t">
                <button onClick={deleteShift} className="text-red-500 text-sm font-bold flex items-center gap-1 hover:bg-red-50 px-3 py-2 rounded"><Trash2 size={16}/> Delete</button>
                <button onClick={saveShiftEdit} className="bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded hover:bg-blue-700">Save Changes</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 6. Placeholder / Module Detail Component
const Placeholder = ({ moduleKey, onBack }) => {
  const module = MODULE_CONFIG[moduleKey];

  return (
    <div className="module-page">
      <header className="module-header" style={{ borderBottom: `4px solid ${module.color}` }}>
        <button onClick={onBack} className="back-btn"><ChevronLeft size={20} /> Back to Dashboard</button>
        <div className="module-title-wrapper"><span style={{ color: module.color, marginRight: '10px' }}>{module.icon}</span><h1>{module.title}</h1></div>
      </header>
      <div className="module-content">
        <div className="construction-card">
          <h2>Module Under Development</h2>
          <p>This is where the <strong>{module.title}</strong> functionality will be loaded.</p>
          <div className="loader-animation"></div>
        </div>
      </div>
    </div>
  );
};

/* --- MAIN APP LOGIC --- */
export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => { const storedUser = localStorage.getItem('eco_user'); if (storedUser) setUser(JSON.parse(storedUser)); }, []);
  const handleLoginSuccess = (userData) => { setUser(userData); localStorage.setItem('eco_user', JSON.stringify(userData)); setCurrentView('dashboard'); };
  const handleLogout = () => { setUser(null); localStorage.removeItem('eco_user'); setCurrentView('dashboard'); };

  if (!user) return <div className="app-root"><Styles /><Login onLoginSuccess={handleLoginSuccess} /></div>;

  let content;
  if (currentView === 'dashboard') content = <Dashboard user={user} onLogout={handleLogout} onNavigate={setCurrentView} />;
  else if (currentView === 'buzon') content = <Buzon onBack={() => setCurrentView('dashboard')} />;
  else if (currentView === 'incident_report') content = <Placeholder moduleKey={currentView} onBack={() => setCurrentView('dashboard')} />;
  else if (currentView === 'schedule_generator') content = <ScheduleGenerator user={user} mode="master" onBack={() => setCurrentView('dashboard')} />;
  else if (currentView === 'check_schedule') content = <ScheduleGenerator user={user} mode="personal" onBack={() => setCurrentView('dashboard')} />;
  else content = <Placeholder moduleKey={currentView} onBack={() => setCurrentView('dashboard')} />;

  return <div className="app-root"><Styles />{content}</div>;
}

/* --- STYLES --- */
const Styles = () => (
  <style>{`
    :root { --primary-green: #2c5530; --accent-gold: #c5a059; --bg-light: #f4f4f0; --text-dark: #2c3e50; --white: #ffffff; --error: #e74c3c; }
    body { margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: var(--bg-light); color: var(--text-dark); -webkit-font-smoothing: antialiased; }
    
    /* SHEET STYLES */
    .sheet-container { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .cell-input { width: 100%; height: 100%; background: transparent; border: none; outline: none; padding: 8px 12px; font-size: 14px; color: #1f2937; }
    .cell-input:focus { background-color: #e0f2fe; box-shadow: inset 0 0 0 2px #3b82f6; }
    .cell-desc-preview { width: 100%; height: 100%; padding: 8px 12px; font-size: 14px; color: #1f2937; background: transparent; cursor: pointer; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; white-space: pre-wrap; min-height: 40px; }
    .cell-desc-preview:hover { background-color: #f1f5f9; }
    .cell-desc-preview.empty::before { content: attr(data-placeholder); color: #9ca3af; }
    .cell-header { background-color: #f8fafc; color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; padding: 8px 12px; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; user-select: none; }
    .cell-data { background-color: #ffffff; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 0; margin: 0; vertical-align: top; }
    .font-script { font-family: 'Brush Script MT', cursive; }

    /* SHARED STYLES */
    .login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(rgba(44, 85, 48, 0.9), rgba(44, 85, 48, 0.8)), url('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80'); background-size: cover; background-position: center; }
    .login-card { background: var(--white); padding: 3rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 100%; max-width: 400px; }
    .brand-header { text-align: center; margin-bottom: 2rem; }
    .brand-header h1 { color: var(--primary-green); margin: 0; font-weight: 300; font-size: 2rem; }
    .brand-header span { font-weight: 700; }
    .brand-header p { margin-top: 5px; color: #888; font-size: 0.9rem; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; color: #666; }
    .form-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-size: 1rem; }
    .form-group input:focus { outline: none; border-color: var(--primary-green); }
    .login-btn { width: 100%; padding: 14px; background-color: var(--primary-green); color: white; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.3s; }
    .login-btn:hover { background-color: #1e3b21; }
    .login-btn:disabled { background-color: #8da18f; cursor: not-allowed; }
    .error-message { color: var(--error); background: #fdeaea; padding: 10px; border-radius: 4px; margin-bottom: 1rem; font-size: 0.9rem; text-align: center; }
    .demo-hint { text-align: center; font-size: 0.8rem; color: #999; margin-top: 1rem; }
    .dashboard-container { min-height: 100vh; display: flex; flex-direction: column; }
    .dashboard-header { background: var(--white); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
    .user-info h2 { margin: 0; font-size: 1.2rem; color: var(--text-dark); }
    .badge { background: var(--accent-gold); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 5px; display: inline-block; font-weight: bold; }
    .modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 25px; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; }
    .module-card { background: var(--white); border-radius: 16px; padding: 1.5rem; text-align: center; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; aspect-ratio: 1; border: 1px solid transparent; }
    .module-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); border-color: rgba(0,0,0,0.05); }
    .icon-wrapper { width: 60px; height: 60px; border-radius: 50%; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
    .module-card:hover .icon-wrapper { transform: scale(1.1); }
    .module-card h3 { margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-dark); }
    .logout-btn { background: transparent; border: 1px solid var(--primary-green); color: var(--primary-green); padding: 8px 16px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; font-weight: 600; transition: all 0.2s; }
    .logout-btn:hover { background: var(--primary-green); color: white; }
    .no-access { text-align: center; width: 100%; padding: 4rem; color: #888; }
    .module-page { min-height: 100vh; background: var(--bg-light); }
    .module-header { background: var(--white); padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .back-btn { display: flex; align-items: center; background: none; border: none; cursor: pointer; font-size: 1rem; color: var(--text-dark); font-weight: 500; }
    .back-btn:hover { color: var(--primary-green); }
    .module-title-wrapper { display: flex; align-items: center; }
    .module-title-wrapper h1 { margin: 0; font-size: 1.25rem; font-weight: 600; }
    .module-content { padding: 2rem; max-width: 1000px; margin: 0 auto; }
    .construction-card { background: var(--white); border-radius: 12px; padding: 3rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .loader-animation { margin: 30px auto 0; width: 40px; height: 40px; border: 3px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: var(--primary-green); animation: spin 1s ease-in-out infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 768px) { .dashboard-header { padding: 1rem; } .modules-grid { grid-template-columns: repeat(2, 1fr); padding: 1rem; gap: 15px; } .module-card { padding: 1rem; } .icon-wrapper { width: 45px; height: 45px; } .module-card h3 { font-size: 0.9rem; } .module-header { flex-direction: column-reverse; gap: 15px; align-items: flex-start; } .sheet-container { border: none; box-shadow: none; } .grid-cols-4 { grid-template-columns: 1fr; } .col-span-1, .col-span-3, .col-span-4 { grid-column: auto; } .cell-header, .cell-data { display: block; width: 100%; border: 1px solid #eee; } }
    @media print { body { background-color: white; } .no-print { display: none !important; } .sheet-container { box-shadow: none; border: 1px solid #000; margin: 0; } .cell-input { padding: 4px; } .cell-desc-preview { -webkit-line-clamp: unset !important; overflow: visible !important; height: auto !important; display: block !important; } }
  `}</style>
);