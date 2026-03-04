import React, { useState, useRef } from "react";
import {
   ChevronLeft, AlertOctagon, FileText, Camera, UploadCloud, Cpu, Sparkles, CheckCircle, Save, Printer, User, Clock, MapPin, X, Target
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

const SignatureCanvas = ({ onClear }) => {
   const canvasRef = useRef(null);
   const [isDrawing, setIsDrawing] = useState(false);

   const getCoords = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
   };

   const startDrawing = (e) => {
      if (e.cancelable) e.preventDefault();
      setIsDrawing(true);
      const ctx = canvasRef.current.getContext("2d");
      const { x, y } = getCoords(e);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#1e3a8a";
      ctx.beginPath();
      ctx.moveTo(x, y);
   };

   const draw = (e) => {
      if (e.cancelable) e.preventDefault();
      if (!isDrawing) return;
      const ctx = canvasRef.current.getContext("2d");
      const { x, y } = getCoords(e);
      ctx.lineTo(x, y);
      ctx.stroke();
   };

   const stopDrawing = () => setIsDrawing(false);

   const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (onClear) onClear();
   };

   return (
      <div className="w-full">
         <div className="border border-slate-300 rounded-lg bg-white relative overflow-hidden shadow-inner">
            <canvas
               ref={canvasRef}
               width={600}
               height={150}
               className="w-full h-32 touch-none cursor-crosshair block"
               onMouseDown={startDrawing}
               onMouseMove={draw}
               onMouseUp={stopDrawing}
               onMouseLeave={stopDrawing}
               onTouchStart={startDrawing}
               onTouchMove={draw}
               onTouchEnd={stopDrawing}
            />
            <div className="absolute top-2 right-2 pointer-events-none text-[10px] text-slate-400 font-bold uppercase tracking-widest select-none">
               Sign Official Report
            </div>
         </div>
         <div className="flex justify-end mt-2">
            <button onClick={clearCanvas} type="button" className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition">
               Clear Signature
            </button>
         </div>
      </div>
   );
};

export default function ModuleIncidentReport({ onBack, user }) {
   const [formData, setFormData] = useState({
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      location: '',
      involvedParties: '',
      description: '',
   });

   const [images, setImages] = useState([]);
   const [isGenerating, setIsGenerating] = useState(false);
   const [reportResult, setReportResult] = useState(null);

   const mockAiForensicReport = `
# 🚨 OFFICIAL INCIDENT FORENSIC REPORT
**Generated via n8n / Staff Operations Matrix**

## 1. Event Timeline & Metadata
- **Date/Time**: ${formData.date} at ${formData.time}
- **Location**: ${formData.location || 'Undisclosed'}
- **Primary Reporting Agent**: ${user ? user.name : 'System Generated'}
- **Involved Parties**: ${formData.involvedParties || 'None recorded'}

## 2. NLP Analysis of Statement
> "${formData.description}"

**AI Extracted Vectors:**
- **Sentiment/Tone**: Urgent, Objective.
- **Risk Assessment Level**: 🟠 MEDIUM PRIORITY
- **Potential Liability**: Low, provided immediate documentation and sign-off is maintained.
- **Cross-Referenced SOP**: \`MAINT_EMERGENCY_04\` - Water Leak Protocol (Confidence: 87%)

## 3. Recommended Remediation & Action Items
1. **Immediate Quarantine**: Restrict access to ${formData.location || 'the area'} until maintenance confirms safety.
2. **Dispatch Protocol**: Auto-ping generated to On-Call Maintenance & Resort Manager via n8n Whatsapp Webhook.
3. **Insurance Alignment**: Capture minimum 3 photographic evidence angles (Currently ${images.length} attached).

---
*End of automated analysis. Final authority rests with Duty Manager.*
`;

   const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;
      const newImages = files.map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
   };

   const removeImage = (idx) => {
      setImages(images.filter((_, i) => i !== idx));
   };

   const generateReport = () => {
      if (!formData.description || !formData.location) {
         alert("Please provide the location and a description of the incident before generating the report.");
         return;
      }
      setIsGenerating(true);
      setReportResult(null);

      // Simulate LLM latency
      setTimeout(() => {
         setReportResult(mockAiForensicReport);
         setIsGenerating(false);
      }, 2500);
   };

   const submitFinalReport = () => {
      alert("Incident Report Encrypted & Submitted to Operations DB successfully.");
      if (onBack) onBack();
   };

   return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
         <header className="bg-slate-900 text-white p-4 sm:p-6 shadow-md shrink-0 sticky top-0 z-30">
            <div className="max-w-5xl mx-auto flex justify-between items-center gap-4 w-full">
               <div className="flex items-center gap-3">
                  {onBack && (
                     <button onClick={onBack} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition">
                        <ChevronLeft size={20} />
                     </button>
                  )}
                  <div>
                     <h1 className="text-xl font-bold tracking-wide flex items-center gap-2 text-red-500"><AlertOctagon size={22} /> INCIDENT AI REPORT</h1>
                     <p className="text-xs text-slate-400 font-medium">Automated Forensic Data Aggregation</p>
                  </div>
               </div>
               {reportResult && (
                  <button onClick={() => window.print()} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-sm print:hidden">
                     <Printer size={16} /> Print Report
                  </button>
               )}
            </div>
         </header>

         <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 pb-20 print:p-0">

            {!reportResult && !isGenerating && (
               <div className="bg-white border text-left border-red-200 shadow-sm rounded-2xl overflow-hidden mb-6 flex flex-col md:flex-row">
                  <div className="bg-red-50 border-r border-red-100 p-6 md:p-8 md:w-1/3 flex flex-col justify-center items-center text-center">
                     <Target size={64} className="text-red-500 mb-4 opacity-80" />
                     <h2 className="text-xl font-black text-red-900 mb-2">Initialize Report</h2>
                     <p className="text-sm text-red-700 leading-relaxed font-medium">Input raw incident variables below. Our n8n / LLM pipeline will automatically generate a highly formatted, compliant forensic analysis report for management review.</p>
                  </div>

                  <div className="p-6 md:p-8 flex-1 space-y-5">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5"><Clock size={14} /> Date of Incident</label>
                           <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition font-medium text-slate-800" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5"><Clock size={14} /> Time</label>
                           <input type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition font-medium text-slate-800" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                        </div>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5"><MapPin size={14} /> Specific Location</label>
                        <input type="text" placeholder="e.g. Near main pool pump room" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition font-medium text-slate-800" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5"><User size={14} /> Involved Parties</label>
                        <input type="text" placeholder="Guest names, staff IDs, contractors..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition font-medium text-slate-800" value={formData.involvedParties} onChange={e => setFormData({ ...formData, involvedParties: e.target.value })} />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5"><FileText size={14} /> Raw Incident Description</label>
                        <textarea rows="4" placeholder="Describe what happened objectively..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition font-medium text-slate-800 leading-relaxed" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                     </div>

                     <div className="border-t border-slate-100 pt-5 mt-5">
                        <label className="cursor-pointer border-2 border-dashed border-red-200 bg-red-50 hover:bg-red-100/50 rounded-xl p-6 flex flex-col items-center justify-center text-red-700 transition-colors shadow-inner">
                           <span className="flex items-center gap-2 font-bold mb-1"><Camera size={20} /> Add Photographic Evidence</span>
                           <span className="text-xs font-medium opacity-80">Highly recommended for insurance claim pipelines</span>
                           <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        {images.length > 0 && (
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                              {images.map((img, idx) => (
                                 <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                    <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Evidence" />
                                    <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-red-600/90 text-white rounded-full p-1 shadow backdrop-blur-sm hover:bg-red-700"><X size={14} /></button>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>

                     <div className="pt-4 flex justify-end">
                        <button onClick={generateReport} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm w-full md:w-auto justify-center">
                           <Cpu size={18} /> Analyze & Generate Report via AI
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {isGenerating && (
               <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-lg h-96">
                  <div className="relative mb-6">
                     <Cpu size={48} className="text-blue-600 animate-pulse" />
                     <Sparkles size={24} className="text-orange-400 absolute -top-2 -right-2 animate-ping" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Analyzing Incident Vectors...</h2>
                  <p className="text-slate-500 font-medium max-w-sm">Feeding context to LLM forensic module and cross-referencing SOP database via n8n pipeline.</p>

                  <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-8 overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-blue-500 to-red-500 w-1/2 rounded-full animate-[ping_2s_infinite]"></div>
                  </div>
               </div>
            )}


            {reportResult && !isGenerating && (
               <div className="space-y-6 print:space-y-0">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden print:shadow-none print:border-none">

                     <div className="bg-red-600 text-white p-6 md:p-8 flex justify-between items-center print:bg-white print:text-black print:border-b-4 print:border-red-600">
                        <div className="flex items-center gap-4">
                           <AlertOctagon size={48} className="print:text-red-600" />
                           <div>
                              <h2 className="text-3xl font-black uppercase tracking-tight">Forensic Incident Report</h2>
                              <p className="font-bold text-red-200 print:text-gray-500">ID: INC-{Math.floor(Math.random() * 90000) + 10000}</p>
                           </div>
                        </div>
                     </div>

                     <div className="p-6 md:p-8 prose prose-slate prose-red max-w-none print:p-0 print:py-4 prose-h2:text-slate-800 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2 prose-h2:mb-4">
                        <ReactMarkdown>{reportResult}</ReactMarkdown>
                     </div>

                     {images.length > 0 && (
                        <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 print:bg-white print:p-0 print:mt-4">
                           <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider">Photographic Evidence Logs</h3>
                           <div className="grid grid-cols-2 gap-4">
                              {images.map((img, idx) => (
                                 <div key={idx} className="rounded-xl overflow-hidden border border-slate-300 bg-white p-2">
                                    <img src={img} className="w-full h-48 object-cover rounded-lg" alt="Evidence Print" />
                                    <p className="text-[10px] text-slate-400 font-mono mt-2 text-center uppercase">Evidence_IMG_{idx + 1}_TS_{Date.now()}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     <div className="p-6 md:p-8 border-t border-slate-200">
                        <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
                           <div className="w-full md:w-1/2">
                              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                 <SignatureCanvas />
                              </div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mt-2">Authorized Sign-Off: {user ? user.name : 'Duty Manager'}</p>
                           </div>
                           <div className="text-right text-xs text-slate-400 font-mono border border-slate-100 p-4 rounded-lg bg-slate-50">
                              Hash: SHA256:{Math.random().toString(36).substring(2, 15)}{Math.random().toString(36).substring(2, 15)}<br />
                              Generated timestamp: {new Date().toISOString()}<br />
                              Powered by n8n Ops Automation Server
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end pt-4 print:hidden gap-3">
                     <button onClick={() => { setReportResult(null); setFormData(f => ({ ...f, description: '' })); setImages([]); }} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition">
                        Start Over
                     </button>
                     <button onClick={submitFinalReport} className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-slate-800 transition flex items-center gap-2">
                        <Save size={18} /> Securely Store Official Record
                     </button>
                  </div>
               </div>
            )}

         </main>
      </div>
   );
}
