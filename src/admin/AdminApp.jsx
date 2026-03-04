import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  Settings,
  LogOut,
  Inbox,
  Calendar,
  Activity,
  UserCog,
  BookOpen,
  ClipboardList,
  Home,
  CheckSquare,
  CalendarDays,
  Users,
  Package,
  DollarSign,
} from "lucide-react";
import ModuleBuzon from "../modules/moduleBuzon.jsx";
import ModuleActivityLog from "../modules/moduleActivityLog.jsx";
import ModuleEventTimeline from "../modules/moduleEventTimeline.jsx";
import ModuleGuestLogs from "../modules/moduleGuestLogs.jsx";
import ModuleInventory from "../modules/moduleInventory.jsx";
import ModulePayroll from "../modules/modulePayroll.jsx";
import ModuleStaffManagement from "../modules/moduleStaffManagement.jsx";
import ModuleScheduleGenerator from "../modules/moduleScheduleGenerator.jsx";
const StaffTraining = lazy(() =>
  import("../TESTENV/moduleStaffTraining.tsx").then((m) => ({
    default: m.default,
  }))
);
const ToolCheckout = lazy(() =>
  import("../TESTENV/moduleToolCheckout.tsx").then((m) => ({
    default: m.default,
  }))
);
const MaintenanceDashboard = lazy(() =>
  import("../TESTENV/dashboardMaintenance.tsx").then((m) => ({
    default: m.default,
  }))
);

const MODULES = {
  payroll: {
    title: "Payroll",
    icon: <DollarSign size={24} />,
    color: "#f1c40f",
    component: ModulePayroll,
  },
  global_inventory: {
    title: "Global Inventory",
    icon: <Package size={24} />,
    color: "#27ae60",
    component: ModuleInventory,
  },
  guest_logs: {
    title: "Guest Logs",
    icon: <Users size={24} />,
    color: "#2c3e50",
    component: ModuleGuestLogs,
  },
  event_timeline: {
    title: "Event Timeline",
    icon: <CalendarDays size={24} />,
    color: "#d35400",
    component: ModuleEventTimeline,
  },
  activity_log: {
    title: "Activity Log",
    icon: <CheckSquare size={24} />,
    color: "#8e44ad",
    component: ModuleActivityLog,
  },
  buzon: {
    title: "Buzón RH",
    icon: <Inbox size={24} />,
    color: "#e74c3c",
    component: ModuleBuzon,
  },
  staff_management: {
    title: "Staff Mgmt",
    icon: <UserCog size={24} />,
    color: "#475569",
    component: ModuleStaffManagement,
  },
  schedule_generator: {
    title: "Schedule Gen",
    icon: <Calendar size={24} />,
    color: "#16a085",
    component: ModuleScheduleGenerator,
  },
  check_schedule: {
    title: "My Schedule",
    icon: <Activity size={24} />,
    color: "#2980b9",
    component: ModuleScheduleGenerator,
  },
  training_manuals: {
    title: "Training Manuals",
    icon: <BookOpen size={24} />,
    color: "#27ae60",
    component: StaffTraining,
  },
  inventory_list: {
    title: "Tool Checkout",
    icon: <ClipboardList size={24} />,
    color: "#95a5a6",
    component: ToolCheckout,
  },
  property_management: {
    title: "Maintenance",
    icon: <Home size={24} />,
    color: "#795548",
    component: MaintenanceDashboard,
  },
};

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Enter username and password");
      return;
    }
    const isAdmin = username === "admin";
    onLogin({
      id: isAdmin ? "A001" : "M001",
      employeename: isAdmin ? "Admin User" : "Resort Manager",
      role: isAdmin ? "System Admin" : "Resort Manager",
      isAdmin,
    });
  };

  return (
    <div className="login-container px-4">
      <div className="login-card">
        <div className="brand-header">
          <h1>
            EcoResort <span>Ops</span>
          </h1>
          <p>Staff & Management Access</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin or manager"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout, onOpenModule }) {
  const cards = Object.entries(MODULES);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header flex justify-between items-center bg-white shadow-sm px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-800 text-white rounded-full flex items-center justify-center font-bold text-lg">
            {user.employeename.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800 leading-tight">
              {user.employeename}
            </h2>
            <span className="text-xs text-gray-500 block">
              {user.role} • Admin
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="text-red-500 hover:bg-red-50 p-2 rounded-full"
            title="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>
      <div className="content-area p-4">
        <div className="modules-grid">
          {cards.map(([key, m]) => (
            <div
              key={key}
              className="module-card"
              onClick={() => onOpenModule(key)}
            >
              <div
                className="icon-wrapper"
                style={{
                  backgroundColor: m.color + "20",
                  color: m.color,
                }}
              >
                {m.icon}
              </div>
              <h3>{m.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("eco_admin_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("eco_admin_user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("eco_admin_user");
    setActiveModule(null);
  };

  if (!user) {
    return (
      <div className="app-root">
        <Styles />
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  if (!activeModule) {
    return (
      <div className="app-root">
        <Styles />
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onOpenModule={setActiveModule}
        />
      </div>
    );
  }

  const moduleConfig = MODULES[activeModule];
  const ModuleComponent = moduleConfig.component;

  return (
    <div className="app-root">
      <Styles />
      <Suspense fallback={<div className="p-4">Loading module...</div>}>
        {activeModule === "schedule_generator" || activeModule === "check_schedule" ? (
          <ModuleComponent
            user={user}
            mode={activeModule === "check_schedule" ? "personal" : "master"}
            onBack={() => setActiveModule(null)}
          />
        ) : (
          <ModuleComponent user={user} onBack={() => setActiveModule(null)} />
        )}
      </Suspense>
    </div>
  );
}

const Styles = () => (
  <style>{`
    :root { --primary-green: #2c5530; --accent-gold: #c5a059; --bg-light: #f4f4f0; --text-dark: #2c3e50; --white: #ffffff; --error: #e74c3c; }
    body { margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: var(--bg-light); color: var(--text-dark); -webkit-font-smoothing: antialiased; }
    .dashboard-container { min-height: 100vh; display: flex; flex-direction: column; }
    .dashboard-header { background: var(--white); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
    .modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 25px; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; }
    .module-card { background: var(--white); border-radius: 16px; padding: 1.5rem; text-align: center; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; aspect-ratio: 1; border: 1px solid transparent; }
    .module-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); border-color: rgba(0,0,0,0.05); }
    .icon-wrapper { width: 60px; height: 60px; border-radius: 50%; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
    .module-card:hover .icon-wrapper { transform: scale(1.1); }
    .module-card h3 { margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-dark); }
    .login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(rgba(44, 85, 48, 0.9), rgba(44, 85, 48, 0.8)); }
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
    .error-message { color: var(--error); background: #fdeaea; padding: 10px; border-radius: 4px; margin-bottom: 1rem; font-size: 0.9rem; text-align: center; }
    @media (max-width: 768px) { .dashboard-header { padding: 1rem; } .modules-grid { grid-template-columns: repeat(2, 1fr); padding: 1rem; gap: 15px; } .module-card { padding: 1rem; } .icon-wrapper { width: 45px; height: 45px; } .module-card h3 { font-size: 0.9rem; } }
  `}</style>
);

