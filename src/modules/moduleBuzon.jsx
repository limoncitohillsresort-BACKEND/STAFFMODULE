import React, { useState, useRef } from "react";
import {
  ChevronLeft, Printer, Trash2, Plus, X, Paperclip, Check, Eraser,
  Inbox, Send, AlertTriangle, MessageSquare, CheckCircle, Clock, ShieldAlert, Wrench, Sparkles, User
} from "lucide-react";

const formatDateDDMMYYYY = (dateObj) => {
  if (!dateObj) return "";
  const d = new Date(dateObj);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const CATEGORIES = [
  { id: 'housekeeping', label: 'Housekeeping & Cleanliness', icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 'maintenance', label: 'Facilities Maintenance', icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 'staff', label: 'HR / Staff Conduct', icon: User, color: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 'security', label: 'Security & Safety', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-100' },
  { id: 'other', label: 'Other', icon: MessageSquare, color: 'text-slate-500', bg: 'bg-slate-100' }
];

const INITIAL_INBOX = [
  {
    id: 'TKT-82910',
    date: '12/10/2023',
    time: '14:30',
    reporter: 'Carlos R.',
    category: 'maintenance',
    location: 'Villa 2 AC Unit',
    description: 'Compressor is making a loud grinding noise and leaking freon.',
    witnesses: 'None',
    status: 'Pending',
    resolutionNotes: ''
  },
  {
    id: 'TKT-91022',
    date: '10/10/2023',
    time: '09:15',
    reporter: 'Sarah S.',
    category: 'staff',
    location: 'Staff Breakroom',
    description: 'Found uniform items left in the sink again. Happens every Tuesday.',
    witnesses: 'Dalia M.',
    status: 'Resolved',
    resolutionNotes: 'Spoke with morning shift. Issued warning.'
  }
];

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
          Sign Here
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <button onClick={clearCanvas} type="button" className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition">
          <Eraser size={14} /> Clear Signature
        </button>
      </div>
    </div>
  );
};

export default function ModuleBuzon({ onBack, user }) {
  const isAdmin = user?.isAdmin || user?.role === 'System Admin' || user?.role === 'Manager';
  const [viewMode, setViewMode] = useState(isAdmin ? 'inbox' : 'submit');

  const [tickets, setTickets] = useState(INITIAL_INBOX);
  const [activeTicket, setActiveTicket] = useState(null);

  // Submit Form State
  const [formData, setFormData] = useState({
    category: '', location: '', description: '', witnesses: '', date: new Date().toISOString().split('T')[0], time: '12:00'
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const removeImage = (idx) => {
    const newImgs = [...images];
    newImgs.splice(idx, 1);
    setImages(newImgs);
  };

  const submitReport = () => {
    if (!formData.category || !formData.description) {
      alert("Please select a category and provide a description.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newTicket = {
        id: 'TKT-' + Math.floor(100000 + Math.random() * 900000),
        date: formatDateDDMMYYYY(formData.date),
        time: formData.time,
        reporter: user?.name || 'Anonymous Staff',
        category: formData.category,
        location: formData.location,
        description: formData.description,
        witnesses: formData.witnesses,
        status: 'Pending',
        resolutionNotes: ''
      };
      setTickets([newTicket, ...tickets]);
      setSubmitting(false);
      alert("Report submitted successfully.");
      setFormData({ category: '', location: '', description: '', witnesses: '', date: new Date().toISOString().split('T')[0], time: '12:00' });
      setImages([]);
      if (isAdmin) setViewMode('inbox');
    }, 1000);
  };

  const resolveTicket = () => {
    if (!activeTicket.resolutionNotes) {
      alert("Please provide resolution notes before closing.");
      return;
    }
    setTickets(tickets.map(t => t.id === activeTicket.id ? { ...t, status: 'Resolved', resolutionNotes: activeTicket.resolutionNotes } : t));
    setActiveTicket(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-slate-900 text-white p-4 shadow-md shrink-0 sticky top-0 z-30 tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition">
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold leading-none">Buzón RH / Internal Reports</h1>
              <p className="text-xs text-slate-400">Confidential Ticket Routing & Incident Logging</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 shadow-inner mr-2">
                <button onClick={() => setViewMode('inbox')} className={`px-4 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${viewMode === 'inbox' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}><Inbox size={14} /> Inbox</button>
                <button onClick={() => setViewMode('submit')} className={`px-4 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${viewMode === 'submit' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}><Plus size={14} /> Submit</button>
              </div>
            )}
            <button onClick={() => window.print()} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
              <Printer size={14} /> Print
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col items-center">

        {viewMode === 'submit' && (
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col mt-4">
            <div className="bg-slate-800 text-white p-6 md:p-8 relative overflow-hidden">
              <AlertTriangle className="absolute right-[-20px] top-[-20px] text-white/5" size={150} />
              <h2 className="text-2xl font-black relative z-10">Confidential Incident Report</h2>
              <p className="text-slate-300 text-sm mt-1 max-w-lg relative z-10">Use this form to document incidents, property damage, HR violations, or operational anomalies. Reports are securely routed to corresponding management.</p>
            </div>

            <div className="p-6 md:p-8 space-y-8">

              {/* Category Selection */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">1. Incident Category</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {CATEGORIES.map(cat => (
                    <div key={cat.id}
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all duration-200 ${formData.category === cat.id ? `border-blue-500 ${cat.bg} shadow-md` : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      <div className={`p-2 rounded-full ${formData.category === cat.id ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                        <cat.icon size={24} className={formData.category === cat.id ? cat.color : 'text-slate-400'} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.category === cat.id ? 'text-blue-800' : 'text-slate-500'}`}>{cat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Context */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block border-b border-slate-100 pb-2">2. Context & Timing</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Date of Incident</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition font-medium text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Time</label>
                    <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition font-medium text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Specific Location</label>
                    <input type="text" name="location" placeholder="e.g. Pool Deck" value={formData.location} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition font-medium text-slate-700" />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block border-b border-slate-100 pb-2">3. Statement of Events</label>
                <textarea rows="5" name="description" placeholder="Provide a detailed, objective account of what occurred..." value={formData.description} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition text-sm leading-relaxed font-medium text-slate-700"></textarea>
                <input type="text" name="witnesses" placeholder="Names of any witnesses present (optional)" value={formData.witnesses} onChange={handleChange} className="w-full mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition font-medium text-slate-700 text-sm" />
              </div>

              {/* Evidence Attachments */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block border-b border-slate-100 pb-2 flex justify-between items-center">
                  <span>4. Photographic Evidence</span>
                  <label className="cursor-pointer text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                    <Paperclip size={14} /> Attach Photos
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </label>
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group shadow-sm border border-slate-200 bg-black">
                        <img src={img} className="w-full h-full object-cover group-hover:opacity-70 transition" alt="evidence" />
                        <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-700 text-xs font-bold">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 flex flex-col items-center justify-center">
                    <Paperclip size={24} className="mb-2 opacity-30" />
                    <span className="text-sm font-medium">No attachments added.</span>
                  </div>
                )}
              </div>

              {/* Veracity & Signature */}
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Declaration of Veracity</h3>
                <p className="text-xs text-slate-500 mb-4 max-w-xl leading-relaxed">By submitting this form and signing below, I certify that the information provided is true and accurate to the best of my knowledge. I understand this constitutes an official internal document.</p>
                <SignatureCanvas />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={submitReport} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2 group w-full md:w-auto justify-center disabled:opacity-70">
                {submitting ? 'Encrypting & Sending...' : <><Send size={18} className="group-hover:translate-x-1 transition-transform" /> Submit Confidential Report</>}
              </button>
            </div>
          </div>
        )}


        {/* --- ADMIN INBOX VIEW --- */}
        {viewMode === 'inbox' && isAdmin && (
          <div className="w-full flex flex-col md:flex-row gap-6 mt-4 items-start">

            {/* Left List */}
            <div className="w-full md:w-1/3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px] shrink-0">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2 text-slate-800"><Inbox className="text-blue-600" size={18} /> Active Reports</h2>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{tickets.length}</span>
              </div>
              <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                {tickets.length === 0 ? (
                  <div className="p-8 text-center text-slate-400"><CheckCircle size={32} className="mx-auto mb-2 opacity-50" /> Inbox Zero</div>
                ) : (
                  tickets.map(tkt => {
                    const catDef = CATEGORIES.find(c => c.id === tkt.category) || CATEGORIES[4];
                    const isSelected = activeTicket?.id === tkt.id;
                    return (
                      <div key={tkt.id} onClick={() => setActiveTicket(tkt)} className={`p-4 cursor-pointer hover:bg-slate-50 transition border-l-4 ${isSelected ? 'bg-blue-50 border-blue-500' : tkt.status === 'Resolved' ? 'border-green-400 opacity-60 bg-slate-50/50' : 'border-orange-400'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`p-1.5 rounded-md ${catDef.bg}`}><catDef.icon size={12} className={catDef.color} /></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tkt.id}</span>
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${tkt.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{tkt.status}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm truncate">{tkt.location || 'General Report'}</h3>
                        <p className="text-xs text-slate-500 mt-1 truncate">{tkt.description}</p>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-3 flex justify-between items-center">
                          <span>By: {tkt.reporter}</span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {tkt.date}</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Right Active Ticket */}
            <div className="flex-1 w-full relative">
              {!activeTicket ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-xl h-[600px] flex flex-col items-center justify-center text-slate-400">
                  <Inbox size={48} className="mb-4 opacity-20" />
                  <p className="font-bold text-lg">Select a report to review</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <div className="bg-slate-800 text-white p-6 relative">
                    <div className="flex justify-between items-start z-10 relative">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-500/20 text-blue-200 border border-blue-500/50 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">{activeTicket.id}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${activeTicket.status === 'Resolved' ? 'bg-green-500/20 text-green-300 border border-green-500/50' : 'bg-orange-500/20 text-orange-300 border border-orange-500/50'}`}>{activeTicket.status}</span>
                        </div>
                        <h2 className="text-2xl font-black">{activeTicket.location || 'General Report'}</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{activeTicket.reporter}</p>
                        <p className="text-xs text-slate-400 flex items-center justify-end gap-1 mt-1"><Clock size={12} /> {activeTicket.date} - {activeTicket.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">Description of Events</h3>
                      <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">{activeTicket.description}</p>
                    </div>

                    {activeTicket.witnesses && activeTicket.witnesses !== 'None' && (
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">Cited Witnesses</h3>
                        <p className="text-sm font-bold text-slate-600">{activeTicket.witnesses}</p>
                      </div>
                    )}

                    <div className={`mt-8 p-6 rounded-xl border ${activeTicket.status === 'Resolved' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                      <h3 className="font-bold text-sm mb-3 flex items-center gap-2 uppercase tracking-wide">
                        {activeTicket.status === 'Resolved' ? <><CheckCircle size={16} className="text-green-600" /> Resolution Log</> : <><Wrench size={16} className="text-orange-600" /> Admin Action Required</>}
                      </h3>

                      {activeTicket.status === 'Resolved' ? (
                        <p className="text-sm text-slate-700">{activeTicket.resolutionNotes}</p>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            placeholder="Document the resolution steps taken to close this report..."
                            className="w-full p-3 border border-orange-300 rounded outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            rows="3"
                            value={activeTicket.resolutionNotes || ''}
                            onChange={e => setActiveTicket({ ...activeTicket, resolutionNotes: e.target.value })}
                          ></textarea>
                          <button onClick={resolveTicket} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded shadow transition flex items-center gap-2 justify-center w-full">
                            <CheckCircle size={18} /> Mark as Resolved & Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
