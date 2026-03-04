import React, { useState } from 'react';
import { ChevronLeft, User, Phone, Mail, MapPin, Calendar, Briefcase, Award, Shield, FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const MOCK_EMPLOYEE = {
   id: 'E001',
   name: 'Dalia M.',
   role: 'Housekeeping Specialist',
   department: 'Housekeeping',
   joinDate: '2025-01-15',
   status: 'Active',
   contact: {
      phone: '+52 55 1234 5678',
      email: 'dalia.m@maracuya.com',
      address: 'Calle Principal 123, Colonia Centro, CP 77710'
   },
   emergency: {
      name: 'Roberto M.',
      relation: 'Spouse',
      phone: '+52 55 8765 4321'
   },
   docs: [
      { name: 'Contrato Individual', type: 'PDF', date: '2025-01-15', status: 'Signed' },
      { name: 'Identificacion Oficial', type: 'IMG', date: '2025-01-14', status: 'Verified' },
      { name: 'Certificado Medico', type: 'PDF', date: '2025-01-10', status: 'Valid' }
   ],
   performance: {
      rating: 4.8,
      tasksCompleted: 428,
      onTimeRate: '98%',
      incidents: 0
   },
   training: [
      { title: 'Standard Cleaning SOPs', completed: '2025-01-16' },
      { title: 'Hazardous Materials Handling', completed: '2025-01-17' },
      { title: 'Guest Interaciton Guidelines', completed: '2025-02-01' }
   ]
};

export default function ModuleEmployeeInfo({ onBack, user }) {
   // In a real app, 'user' prop would dictate the context or fetch data. 
   // We use MOCK_EMPLOYEE for demonstration.
   const data = MOCK_EMPLOYEE;

   return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
         <header className="bg-slate-900 text-white p-4 shadow-md shrink-0 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
               <div className="flex items-center gap-3">
                  {onBack && (
                     <button onClick={onBack} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition">
                        <ChevronLeft size={20} />
                     </button>
                  )}
                  <div>
                     <h1 className="text-lg font-bold leading-none">Employee Profile</h1>
                     <p className="text-xs text-slate-400">Personal Information & HR Records</p>
                  </div>
               </div>
            </div>
         </header>

         <main className="flex-1 overflow-auto p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col xl:flex-row gap-6">
            {/* Left Column: Identity & Contact */}
            <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                  <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                  <div className="px-6 pb-6 pt-0 relative">
                     <div className="w-24 h-24 bg-white rounded-2xl shadow-md border-4 border-white flex items-center justify-center -mt-12 mb-4">
                        <User size={48} className="text-slate-300" />
                     </div>
                     <div className="absolute top-4 right-6 bg-green-100 text-green-700 font-bold text-xs px-3 py-1 rounded-full border border-green-200 shadow-sm flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Active
                     </div>

                     <h2 className="text-2xl font-black text-slate-800 leading-tight">{data.name}</h2>
                     <p className="font-bold text-sm text-blue-600 mb-1">{data.role}</p>
                     <p className="text-xs text-slate-500 mb-6 font-mono flex items-center gap-2">
                        <Briefcase size={14} /> ID: <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">{data.id}</span>
                     </p>

                     <div className="space-y-4">
                        <div className="flex items-start gap-3">
                           <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0"><Phone size={16} /></div>
                           <div>
                              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Mobile Phone</p>
                              <p className="font-medium text-slate-700 text-sm">{data.contact.phone}</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-3">
                           <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0"><Mail size={16} /></div>
                           <div>
                              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Email Address</p>
                              <p className="font-medium text-slate-700 text-sm break-all">{data.contact.email}</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-3">
                           <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0"><MapPin size={16} /></div>
                           <div>
                              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Home Address</p>
                              <p className="font-medium text-slate-700 text-sm leading-tight">{data.contact.address}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-red-800 flex items-center gap-2 mb-4 pb-3 border-b border-red-200/50">
                     <AlertCircle size={18} /> Emergency Contact
                  </h3>
                  <div className="space-y-3">
                     <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-red-500/70">Name</p>
                        <p className="font-bold text-red-900">{data.emergency.name} <span className="font-normal text-xs text-red-700 ml-1">({data.emergency.relation})</span></p>
                     </div>
                     <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-red-500/70">Phone</p>
                        <p className="font-medium text-red-800 font-mono bg-white inline-block px-2 py-1 rounded border border-red-200 text-sm">{data.emergency.phone}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Performance, Training, Documents */}
            <div className="flex-1 flex flex-col gap-6">

               {/* Top Stats */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                     <div className="text-slate-400 mb-1"><Calendar size={20} /></div>
                     <p className="text-2xl font-black text-slate-800">{data.joinDate.split('-')[0]}</p>
                     <p className="text-[10px] font-bold uppercase text-slate-500">Since</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                     <div className="text-blue-400 mb-1"><CheckCircle size={20} /></div>
                     <p className="text-2xl font-black text-slate-800">{data.performance.tasksCompleted}</p>
                     <p className="text-[10px] font-bold uppercase text-slate-500">Tasks Done</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                     <div className="text-green-400 mb-1"><Clock size={20} /></div>
                     <p className="text-2xl font-black text-slate-800">{data.performance.onTimeRate}</p>
                     <p className="text-[10px] font-bold uppercase text-slate-500">On-Time</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                     <div className="text-yellow-400 mb-1"><Award size={20} /></div>
                     <p className="text-2xl font-black text-slate-800">{data.performance.rating} <span className="text-sm font-normal text-slate-400">/ 5</span></p>
                     <p className="text-[10px] font-bold uppercase text-slate-500">Peer Rating</p>
                  </div>
               </div>

               {/* Training History */}
               <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                     <h3 className="font-bold flex items-center gap-2 text-slate-800"><Award className="text-indigo-500" /> Training & Certifications</h3>
                     <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">{data.training.length} Modules</span>
                  </div>
                  <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-64">
                     {data.training.map((t, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:border-slate-300 transition group">
                           <div className="flex items-center gap-3">
                              <div className="bg-indigo-50 text-indigo-600 p-2 rounded-full"><BookOpen size={16} /></div>
                              <p className="font-bold text-sm text-slate-700">{t.title}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed</p>
                              <p className="text-xs font-mono text-slate-600 font-medium">{t.completed}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Documents File Vault */}
               <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <div className="bg-slate-50 p-4 border-b border-slate-200">
                     <h3 className="font-bold flex items-center gap-2 text-slate-800"><Shield className="text-slate-500" /> Legal & HR Documents</h3>
                  </div>
                  <div className="p-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.docs.map((doc, idx) => (
                           <div key={idx} className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md transition cursor-pointer bg-white group">
                              <div className="bg-slate-100 text-slate-500 p-3 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                                 <FileText size={24} />
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-bold text-sm text-slate-800 mb-1">{doc.name}</h4>
                                 <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold">
                                    <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{doc.type}</span>
                                    <span className="text-slate-400">{doc.date}</span>
                                 </div>
                              </div>
                              <div className="shrink-0 pt-1">
                                 {doc.status === 'Signed' || doc.status === 'Verified' || doc.status === 'Valid' ?
                                    <CheckCircle size={16} className="text-green-500" /> :
                                    <AlertCircle size={16} className="text-orange-500" />
                                 }
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

            </div>
         </main>
      </div>
   );
}
