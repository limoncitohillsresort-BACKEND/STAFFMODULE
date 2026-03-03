import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestModeWidget() {
   const navigate = useNavigate();

   const handleSwitch = (role) => {
      if (role === 'admin') {
         localStorage.setItem("eco_admin_user", JSON.stringify({
            id: "A001", employeename: "Admin User", role: "System Admin", isAdmin: true
         }));
         navigate('/admin');
         window.dispatchEvent(new Event("storage")); // force update in some cases
      } else if (role === 'staff') {
         localStorage.setItem("eco_staff_user", JSON.stringify({
            id: "E005", employeename: "Test Staff", role: "Staff"
         }));
         navigate('/staff');
         window.dispatchEvent(new Event("storage"));
      } else if (role === 'logout') {
         localStorage.removeItem("eco_admin_user");
         localStorage.removeItem("eco_staff_user");
         window.location.reload();
      }
   };

   return (
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 bg-white/90 backdrop-blur border border-slate-200 p-2 rounded-lg shadow-2xl">
         <div className="text-[10px] font-bold text-slate-500 uppercase text-center border-b border-slate-200 pb-1 mb-1">
            Test Mode
         </div>
         <button
            onClick={() => handleSwitch('admin')}
            className="text-xs px-4 py-1.5 bg-slate-800 text-white font-bold rounded shadow-sm hover:bg-slate-700 transition"
         >
            Admin View
         </button>
         <button
            onClick={() => handleSwitch('staff')}
            className="text-xs px-4 py-1.5 bg-green-600 text-white font-bold rounded shadow-sm hover:bg-green-700 transition"
         >
            Staff View
         </button>
         <button
            onClick={() => handleSwitch('logout')}
            className="text-[10px] px-4 py-1 mt-1 font-bold text-red-500 hover:text-red-700 hover:underline transition"
         >
            Clear Session
         </button>
      </div>
   );
}
