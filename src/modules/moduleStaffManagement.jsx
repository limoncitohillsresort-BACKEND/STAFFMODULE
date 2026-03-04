import React, { useState } from "react";
import {
  ChevronLeft, Search, Plus, UserCog, Lock, Activity, Trash2, Mail, X, CheckCircle, AlertTriangle, FileText, Camera, ShieldCheck, DollarSign, UploadCloud, MessageSquare, Send, Paperclip
} from "lucide-react";

const generateFiniquito = () => {
  alert("Generating Finiquito PDF based on accrued data...");
};

const MessagingModal = ({ isOpen, onClose, user, onSend }) => {
  const [msg, setMsg] = useState("");
  const [img, setImg] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full"><MessageSquare size={18} /></div>
            <div>
              <h3 className="font-bold leading-none">Message Staff</h3>
              <p className="text-xs text-blue-200 mt-1">To: {user?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:text-blue-200"><X size={20} /></button>
        </div>
        <div className="p-6 bg-slate-50 flex-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-500 text-center mb-4 shadow-sm">
            Internal messages require a read receipt. Target will be notified immediately via push notification.
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Message Content</label>
            <textarea
              className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm min-h-[120px]"
              placeholder="Type your message here..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>

          <div>
            <label className="cursor-pointer border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 transition-colors">
              <span className="flex items-center gap-2 text-sm font-bold"><Paperclip size={16} /> Attach Image (Optional)</span>
              <span className="text-xs mt-1 opacity-70">PNG, JPG up to 5MB</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImg(URL.createObjectURL(file));
              }} />
            </label>
            {img && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 max-h-40">
                <img src={img} className="w-full h-full object-cover" alt="Attachment" />
                <button onClick={() => setImg(null)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md"><X size={14} /></button>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={() => { onSend(msg, img); onClose(); }}
            disabled={!msg}
            className="bg-blue-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow hover:bg-blue-700 transition"
          >
            <Send size={16} /> Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

const StaffModal = ({ isOpen, onClose, user, onSave }) => {
  const isNew = !user;
  const [tab, setTab] = useState('profile'); // profile, onboarding, dossier, offboarding
  const [formData, setFormData] = useState(user || {
    id: "TBD", name: "", role: "Housekeeping", active: true, email: "", phone: "", curp: "",
    onboarding: { contractSigned: false, uniform: false, badge: false, appAccess: false },
    accrued: { holidays: 12, sick: 4, loans: 0 }
  });
  const [loadingOcr, setLoadingOcr] = useState(false);

  if (!isOpen) return null;

  const runMockOcr = () => {
    setLoadingOcr(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        name: "Maria Rodriguez Santos",
        curp: "ROSM920815HDFRRN09",
        email: "mrodriguez@example.com",
        phone: "+52 55 1234 5678"
      }));
      setLoadingOcr(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        <div className="bg-slate-900 p-5 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold leading-tight flex items-center gap-3">
              <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg"><UserCog size={20} /></div>
              {isNew ? "New Hire Setup" : `Staff Dossier: ${user.name}`}
            </h2>
          </div>
          <button onClick={onClose} className="hover:text-red-400 transition-colors p-1"><X size={20} /></button>
        </div>

        <div className="flex border-b border-slate-200 shrink-0 overflow-x-auto">
          {[
            { id: 'profile', icon: <FileText size={16} />, label: 'Profile & Contact' },
            { id: 'onboarding', icon: <ShieldCheck size={16} />, label: 'Onboarding & Contracts' },
            { id: 'dossier', icon: <Activity size={16} />, label: 'AI Dossier & Accrued' },
            { id: 'offboarding', icon: <AlertTriangle size={16} />, label: 'Offboarding' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">

          {/* PROFILE TAB */}
          {tab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-blue-900 flex items-center gap-2"><Camera size={18} /> ID Verification OCR</h3>
                  <p className="text-sm text-blue-700 mt-1 max-w-md">Upload an INE or Passport to automatically extract and populate staff identity fields securely.</p>
                </div>
                <label className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition cursor-pointer">
                  {loadingOcr ? 'Scanning...' : <><UploadCloud size={18} /> Scan ID</>}
                  <input type="file" className="hidden" accept="image/*" onChange={runMockOcr} disabled={loadingOcr} />
                </label>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Full Legal Name</label>
                  <input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Juan Perez" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">CURP / Tax ID</label>
                  <input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium font-mono uppercase" value={formData.curp || ''} onChange={e => setFormData({ ...formData, curp: e.target.value })} placeholder="18 Chars" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Primary Email</label>
                  <input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="staff@example.com" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Phone Number</label>
                  <input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium" type="tel" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+52 00 0000 0000" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Assigned Department</label>
                  <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                    <option>Housekeeping</option>
                    <option>Maintenance</option>
                    <option>Front Desk</option>
                    <option>Security</option>
                    <option>Management</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Account Status</label>
                  <div className="flex gap-4 items-center h-10">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="status" checked={formData.active} onChange={() => setFormData({ ...formData, active: true })} className="scale-125 accent-blue-600" />
                      <span className="text-sm font-bold text-green-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="status" checked={!formData.active} onChange={() => setFormData({ ...formData, active: false })} className="scale-125 accent-blue-600" />
                      <span className="text-sm font-bold text-slate-500">Suspended / Inactive</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONBOARDING TAB */}
          {tab === 'onboarding' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><ShieldCheck className="text-blue-500" /> Workflow & Compliance</h3>
                <div className="space-y-3">
                  {[
                    { id: 'contractSigned', label: 'Signed NDA & Employment Contract on File' },
                    { id: 'uniform', label: 'Uniform & Safety Gear Issued' },
                    { id: 'badge', label: 'RFID Badge & Keys Assigned' },
                    { id: 'appAccess', label: 'App Portal Access Credentials Sent' }
                  ].map(item => (
                    <label key={item.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                      <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={formData.onboarding?.[item.id] || false}
                          onChange={e => setFormData({ ...formData, onboarding: { ...formData.onboarding, [item.id]: e.target.checked } })}
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${formData.onboarding?.[item.id] ? 'bg-green-500' : 'bg-slate-300'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.onboarding?.[item.id] ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-white border text-center border-slate-200 rounded-xl p-8 border-dashed flex flex-col items-center justify-center text-slate-400">
                <FileText size={32} className="mb-2 opacity-50" />
                <p className="font-bold text-slate-600 mb-1">Upload Digital Contracts</p>
                <p className="text-xs">Attach signed PDFs here for HR record retention.</p>
                <button className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition">Browse Files...</button>
              </div>
            </div>
          )}

          {/* DOSSIER TAB */}
          {tab === 'dossier' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Accrued Holidays</div>
                  <div className="text-3xl font-black text-blue-600">{formData.accrued?.holidays || 0}</div>
                  <div className="text-xs text-slate-400 mt-2">Days available this year</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Sick Leave</div>
                  <div className="text-3xl font-black text-green-600">{formData.accrued?.sick || 0}</div>
                  <div className="text-xs text-slate-400 mt-2">Paid days remaining</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Outstanding Loans</div>
                  <div className="text-3xl font-black text-orange-600 flex items-center"><DollarSign size={24} /> {formData.accrued?.loans || '0.00'}</div>
                  <div className="text-xs text-slate-400 mt-2">Pending payroll deductions</div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-4"><Activity size={100} /></div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Activity className="text-blue-400" /> AI Performance Dossier</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 max-w-2xl">Based on 6 months of Activity Log completion rates, incident reports, and peer feedback, the AI has generated the following summary:</p>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 text-sm italic text-slate-300">
                  "Consistently completes tasks on time. Strong performance in deep cleaning routines. One minor coaching notation received on Oct 12th regarding uniform standards, resolved promptly. Highly reliable for weekend shifts."
                </div>
              </div>
            </div>
          )}

          {/* OFFBOARDING TAB */}
          {tab === 'offboarding' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-orange-800 font-bold text-lg mb-2 flex items-center gap-2"><AlertTriangle /> Termination & Final Settlement</h3>
                <p className="text-orange-700 text-sm mb-6 max-w-2xl">Initiating the offboarding sequence will suspend portal access immediately. The Finiquito Generator will calculate final payouts based on accrued data (holidays, bonuses) minus outstanding loans and missing tool unreturned penalties.</p>

                <div className="space-y-4 max-w-xl bg-white p-5 rounded-lg border border-orange-100">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Reason for Departure</label>
                    <select className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50">
                      <option>Resignation</option>
                      <option>End of Contract</option>
                      <option>Termination with Cause</option>
                      <option>Layoff</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Unreturned Inventory Penalties</label>
                    <input className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50" type="number" placeholder="$0.00" />
                  </div>
                  <button onClick={generateFiniquito} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-sm transition mt-2">
                    Generate & Print Finiquito (PDF)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-5 shrink-0 flex justify-end gap-3 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition">Cancel</button>
          <button onClick={() => onSave(formData)} className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-2"><Save size={18} /> Save Profile</button>
        </div>
      </div>
    </div>
  );
};

export default function ModuleStaffManagement({ onBack }) {
  const [staff, setStaff] = useState([
    {
      id: "E001", name: "Dalia M.", role: "Housekeeping", active: true, email: "dalia@resort.com", phone: "555-0101",
      onboarding: { contractSigned: true, uniform: true, badge: true, appAccess: true },
      accrued: { holidays: 15, sick: 5, loans: 0 }
    },
    {
      id: "E002", name: "Carlos R.", role: "Maintenance", active: true, email: "carlos@resort.com", phone: "555-0102",
      onboarding: { contractSigned: true, uniform: true, badge: true, appAccess: true }
    },
    {
      id: "E003", name: "Sarah S.", role: "Front Desk", active: false, email: "sarah@resort.com", phone: "555-0103"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });
  const [msgModal, setMsgModal] = useState({ isOpen: false, user: null });

  const handleSaveUser = (userData) => {
    if (userData.id === "TBD") {
      userData.id = "E" + Math.floor(100 + Math.random() * 900);
      setStaff([...staff, userData]);
    } else {
      setStaff(staff.map((s) => s.id === userData.id ? userData : s));
    }
    setEditModal({ isOpen: false, user: null });
  };

  const handleSendMessage = (msg, img) => {
    alert(`Message Sent to ${msgModal.user.name}!\nContent: ${msg}\nAttachment: ${img ? 'Yes' : 'No'}\nRead Receipt tracking initialized.`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <header className="bg-slate-900 text-white p-4 sm:p-6 shadow-md shrink-0 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 w-full">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition">
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-wide flex items-center gap-2"><UserCog size={20} className="text-blue-400" /> STAFF DIRECTORY</h1>
              <p className="text-xs text-slate-400 font-medium">HR, Access Control & Internal Comms</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 pb-20">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden mb-6">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                className="pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium shadow-sm transition"
                placeholder="Search staff by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setEditModal({ isOpen: true, user: null })}
              className="w-full md:w-auto bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 transition"
            >
              <Plus size={18} /> Onboard New Hire
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department / Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff
                  .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-base">{s.name}</span>
                          <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 w-fit mt-1">{s.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-600 border border-slate-200 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                          {s.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex flex-col gap-1 text-xs">
                          <span>{s.email}</span>
                          <span>{s.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${s.active ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                          {s.active && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                          {s.active ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setMsgModal({ isOpen: true, user: s })}
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition shadow-sm"
                            title="Send Message"
                          >
                            <Mail size={16} />
                          </button>
                          <button
                            onClick={() => setEditModal({ isOpen: true, user: { ...s } })}
                            className="p-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800 rounded-lg transition shadow-sm"
                            title="Open Dossier"
                          >
                            <UserCog size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {staff.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">No staff members found matching search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <StaffModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        user={editModal.user}
        onSave={handleSaveUser}
      />

      <MessagingModal
        isOpen={msgModal.isOpen}
        onClose={() => setMsgModal({ isOpen: false, user: null })}
        user={msgModal.user}
        onSend={handleSendMessage}
      />
    </div>
  );
}
