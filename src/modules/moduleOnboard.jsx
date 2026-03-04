import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, FileText, User, Shield, Briefcase, PlayCircle, BookOpen } from 'lucide-react';

const ONBOARDING_STEPS = [
   { id: 'welcome', title: 'Welcome', icon: <User size={20} /> },
   { id: 'role', title: 'Role & Duties', icon: <Briefcase size={20} /> },
   { id: 'training', title: 'Training Library', icon: <BookOpen size={20} /> },
   { id: 'forms', title: 'Forms & ID', icon: <FileText size={20} /> },
   { id: 'contract', title: 'Contract', icon: <Shield size={20} /> },
   { id: 'eula', title: 'EULA & Mission', icon: <CheckCircle size={20} /> },
];

export default function ModuleOnboard({ onBack, user }) {
   const [currentStep, setCurrentStep] = useState(0);
   const [formData, setFormData] = useState({
      acceptEula: false,
      signature: '',
      idUploaded: false
   });

   const step = ONBOARDING_STEPS[currentStep];

   const handleNext = () => {
      if (currentStep < ONBOARDING_STEPS.length - 1) {
         setCurrentStep(currentStep + 1);
      }
   };

   const handlePrev = () => {
      if (currentStep > 0) {
         setCurrentStep(currentStep - 1);
      }
   };

   const renderStepContent = () => {
      switch (step.id) {
         case 'welcome':
            return (
               <div className="text-center space-y-6 animate-fade-in max-w-xl mx-auto py-8">
                  <div className="bg-blue-100 text-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-sm">
                     <User size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800">Welcome to Maracuya</h2>
                  <p className="text-slate-600 text-lg leading-relaxed">
                     We are excited to have you join the team! This quick onboarding flow will guide you through your new role, our standards, and the required paperwork to get you started immediately.
                  </p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-8">Click Next to begin</p>
               </div>
            );
         case 'role':
            return (
               <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-4">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Briefcase className="text-blue-500" /> Your Role & Initial Tasks</h2>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                     <h3 className="font-bold text-lg text-slate-700 mb-2">Housekeeping Specialist</h3>
                     <p className="text-slate-600 mb-6">Your primary responsibility is to maintain the highest standard of cleanliness and presentation across all villas.</p>

                     <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-3">Your First 3 Tasks</h4>
                     <div className="space-y-3">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-3 shadow-sm">
                           <div className="bg-blue-100 text-blue-600 p-2 rounded pt-1"><CheckCircle size={16} /></div>
                           <div>
                              <p className="font-bold text-slate-800">Review Villa Layouts</p>
                              <p className="text-sm text-slate-500">Familiarize yourself with the 4 main properties.</p>
                           </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-3 shadow-sm">
                           <div className="bg-slate-100 text-slate-400 p-2 rounded pt-1"><CheckCircle size={16} /></div>
                           <div>
                              <p className="font-bold text-slate-800">Tool Checkout Orientation</p>
                              <p className="text-sm text-slate-500">Learn how to request cleaning supplies from inventory.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            );
         case 'training':
            return (
               <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-4">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3"><BookOpen className="text-blue-500" /> Training & SOPs</h2>
                  <div className="grid gap-4">
                     <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex gap-4 hover:border-blue-400 transition cursor-pointer group">
                        <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition">
                           <PlayCircle size={32} className="text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800">Standard Room Turndown</h3>
                           <p className="text-sm text-slate-500 mt-1">Video Guide • 4 mins</p>
                        </div>
                     </div>
                     <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex gap-4 hover:border-blue-400 transition cursor-pointer group">
                        <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition">
                           <FileText size={32} className="text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800">Hazardous Materials Handling</h3>
                           <p className="text-sm text-slate-500 mt-1">PDF Document • Require Signature</p>
                        </div>
                     </div>
                  </div>
               </div>
            );
         case 'forms':
            return (
               <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-4">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3"><FileText className="text-blue-500" /> Identity Verification</h2>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center shadow-sm">
                     <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <Shield size={32} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Upload Official Gov ID</h3>
                     <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">Please upload a clear photo of your INE, Passport, or Driver's License for automated background verification.</p>

                     {formData.idUploaded ? (
                        <div className="bg-green-100 text-green-800 p-4 rounded-lg font-bold flex items-center justify-center gap-2 border border-green-200">
                           <CheckCircle size={20} /> Verification Complete
                        </div>
                     ) : (
                        <button onClick={() => setFormData({ ...formData, idUploaded: true })} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-slate-800 transition">
                           Tap to Scan ID
                        </button>
                     )}
                  </div>
               </div>
            );
         case 'contract':
            return (
               <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-4">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Shield className="text-blue-500" /> Employment Contract</h2>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                     <div className="bg-slate-100 p-4 border-b border-slate-200 font-mono text-xs font-bold text-slate-500 text-center">
                        CONTRATO INDIVIDUAL DE TRABAJO - MARACUYA LLC
                     </div>
                     <div className="p-6 h-64 overflow-y-auto text-sm text-slate-600 space-y-4 font-serif leading-relaxed bg-slate-50/50">
                        <p>This Employment Agreement is made effective for all purposes in all respects...</p>
                        <p>1. <strong>Position and Duties.</strong> The Employee will serve in the capacity of Housekeeping Specialist...</p>
                        <p>2. <strong>Compensation.</strong> The Employer will pay the Employee a starting wage as defined in Schedule A...</p>
                        <p>3. <strong>Confidentiality.</strong> The Employee acknowledges that during employment they will have access to guest registers which are strictly confidential...</p>
                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 mt-4 text-xs font-sans">
                           Scroll to bottom to agree.
                        </div>
                     </div>
                     <div className="p-6 bg-slate-50 border-t border-slate-200">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Digital Signature</label>
                        <input
                           type="text"
                           placeholder="Type your full legal name to sign"
                           className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-serif"
                           value={formData.signature}
                           onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                        />
                     </div>
                  </div>
               </div>
            );
         case 'eula':
            return (
               <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-4 text-center">
                  <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                     <CheckCircle size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-4">You're Almost Ready!</h2>
                  <p className="text-slate-600 text-lg max-w-lg mx-auto mb-8">
                     By clicking finish, you acknowledge our mission to provide unparalleled hospitality, and you agree to the App Usage EULA regarding GPS tracking during working hours.
                  </p>

                  <label className="flex items-center justify-center gap-3 cursor-pointer mb-8">
                     <input
                        type="checkbox"
                        className="w-5 h-5 accent-blue-600"
                        checked={formData.acceptEula}
                        onChange={(e) => setFormData({ ...formData, acceptEula: e.target.checked })}
                     />
                     <span className="font-bold text-slate-700">I agree to the Terms & Conditions</span>
                  </label>
               </div>
            );
         default:
            return null;
      }
   };

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
                     <h1 className="text-lg font-bold leading-none">New Hire Onboarding</h1>
                     <p className="text-xs text-slate-400">Step {currentStep + 1} of {ONBOARDING_STEPS.length}</p>
                  </div>
               </div>
            </div>
         </header>

         {/* Progress Bar */}
         <div className="bg-white border-b border-slate-200 shadow-sm relative z-20">
            <div className="max-w-4xl mx-auto px-4 py-6">
               <div className="flex justify-between items-center relative z-10 w-full overflow-x-auto pb-2 scrollbar-hide">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded min-w-[500px]"></div>
                  {ONBOARDING_STEPS.map((s, index) => {
                     const isCompleted = index < currentStep;
                     const isCurrent = index === currentStep;
                     return (
                        <div key={s.id} className="flex flex-col items-center gap-2 min-w-[80px]">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border-2 ${isCompleted ? 'bg-blue-600 text-white border-blue-600' :
                              isCurrent ? 'bg-white text-blue-600 border-blue-600 ring-4 ring-blue-100' :
                                 'bg-white text-slate-300 border-slate-200'
                              }`}>
                              {isCompleted ? <CheckCircle size={18} /> : s.icon}
                           </div>
                           <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isCurrent || isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>{s.title}</span>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>

         <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50 relative z-10">
            {renderStepContent()}
         </main>

         {/* Navigation Footer */}
         <footer className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
               <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition disabled:opacity-0"
               >
                  <span className="flex items-center gap-2"><ChevronLeft size={18} /> Back</span>
               </button>

               {currentStep === ONBOARDING_STEPS.length - 1 ? (
                  <button
                     disabled={!formData.acceptEula || !formData.signature || !formData.idUploaded}
                     onClick={() => alert("Onboarding Complete! Redirecting to Dashboard...")}
                     className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Complete Setup <CheckCircle size={18} />
                  </button>
               ) : (
                  <button
                     onClick={handleNext}
                     className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
                  >
                     Continue <ChevronRight size={18} />
                  </button>
               )}
            </div>
         </footer>
      </div>
   );
}
