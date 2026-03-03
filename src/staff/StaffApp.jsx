import React, { useState, useEffect, Suspense, lazy } from "react";
import { LogOut, Inbox, BookOpen, ClipboardList, Home } from "lucide-react";
import ModuleBuzon from "../modules/moduleBuzon.jsx";

const StaffTraining = lazy(() => import("../TESTENV/moduleStaffTraining.tsx"));
const ToolCheckout = lazy(() => import("../TESTENV/moduleToolCheckout.tsx"));
const MaintenanceDashboard = lazy(() => import("../TESTENV/dashboardMaintenance.tsx"));

const STAFF_MODULES = {
  buzon: {
    title: "Buzón RH",
    icon: <Inbox size={22} />,
    color: "#e74c3c",
    component: ModuleBuzon,
  },
  training_manuals: {
    title: "Training Manuals",
    icon: <BookOpen size={22} />,
    color: "#27ae60",
    component: StaffTraining,
  },
  inventory_list: {
    title: "Tool Checkout",
    icon: <ClipboardList size={22} />,
    color: "#95a5a6",
    component: ToolCheckout,
  },
  property_management: {
    title: "Maintenance",
    icon: <Home size={22} />,
    color: "#795548",
    component: MaintenanceDashboard,
  },
};

function StaffLogin({ onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onLogin({
      id: "E005",
      employeename: name,
      role: "Staff",
    });
  };

  return (
    <div className="login-container px-4">
      <div className="login-card">
        <div className="brand-header">
          <h1>
            EcoResort <span>Staff</span>
          </h1>
          <p>Staff Tools & Manuals</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

function StaffDashboard({ user, onLogout, onOpenModule }) {
  const cards = Object.entries(STAFF_MODULES);
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
            <span className="text-xs text-gray-500 block">Staff</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-red-500 hover:bg-red-50 p-2 rounded-full"
          title="Logout"
        >
          <LogOut size={22} />
        </button>
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

export default function StaffApp() {
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("eco_staff_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("eco_staff_user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("eco_staff_user");
    setActiveModule(null);
  };

  if (!user) {
    return (
      <div className="app-root">
        <Styles />
        <StaffLogin onLogin={handleLogin} />
      </div>
    );
  }

  if (!activeModule) {
    return (
      <div className="app-root">
        <Styles />
        <StaffDashboard
          user={user}
          onLogout={handleLogout}
          onOpenModule={setActiveModule}
        />
      </div>
    );
  }

  const moduleConfig = STAFF_MODULES[activeModule];
  const ModuleComponent = moduleConfig.component;

  return (
    <div className="app-root">
      <Styles />
      <Suspense fallback={<div className="p-4">Loading module...</div>}>
        <ModuleComponent onBack={() => setActiveModule(null)} />
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
    @media (max-width: 768px) { .dashboard-header { padding: 1rem; } .modules-grid { grid-template-columns: repeat(2, 1fr); padding: 1rem; gap: 15px; } .module-card { padding: 1rem; } .icon-wrapper { width: 45px; height: 45px; } .module-card h3 { font-size: 0.9rem; } }
  `}</style>
);

