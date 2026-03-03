import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));
const StaffApp = lazy(() => import("./staff/StaffApp.jsx"));

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <BrowserRouter>
         <Suspense fallback={<div className="p-4">Loading Staff Portal...</div>}>
            <Routes>
               {/* Default Route is now the Admin Dashboard */}
               <Route path="/" element={<Navigate to="/admin" replace />} />
               <Route path="/admin/*" element={<AdminApp />} />

               {/* Extra Route for explicit Staff specific dashboard views */}
               <Route path="/staff/*" element={<StaffApp />} />

               {/* Catch-all sends you back to Admin */}
               <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
         </Suspense>
      </BrowserRouter>
   </React.StrictMode>
);
