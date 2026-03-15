
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, Calendar, Megaphone, 
  CheckSquare, BarChart3, Settings, User, 
  Plus, Search, Filter, MoreVertical, 
  Clock, MapPin, AlertCircle, CheckCircle2,
  Trash2, Edit, Send, Download, QrCode, X, Check, History, Award, FileText, Eye, Briefcase, ExternalLink
} from 'lucide-react';
import { UniGuildData } from '../data';
import DashboardShell from '../components/DashboardShell';
import { motion, AnimatePresence } from 'motion/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc, collection, query, where, onSnapshot, getDoc } from 'firebase/firestore';

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'attendance', label: 'Attendance', icon: <QrCode size={20} /> },
  { id: 'certificates', label: 'Certificates', icon: <Award size={20} /> },
  { id: 'volunteers', label: 'Volunteers', icon: <Users size={20} /> },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
  { id: 'jobs', label: 'Jobs', icon: <Briefcase size={20} /> },
  { id: 'announcements', label: 'Announcements', icon: <Megaphone size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { id: 'profile', label: 'Profile', icon: <User size={20} /> },
];

export default function EventCoordinatorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const coordinatorInfo = { id: 'COORD001', name: 'Rahul Sharma' };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab onScanClick={() => setActiveTab('attendance')} />;
      case 'attendance': return <AttendanceTab coordinatorId={coordinatorInfo.id} coordinatorName={coordinatorInfo.name} />;
      case 'certificates': return <CertificatesTab />;
      case 'volunteers': return <VolunteersTab />;
      case 'tasks': return <TasksTab />;
      case 'jobs': return <JobsTab />;
      case 'announcements': return <AnnouncementsTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'profile': return <ProfileTab />;
      default: return <OverviewTab onScanClick={() => setActiveTab('attendance')} />;
    }
  };

  return (
    <DashboardShell
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      roleName="Event Coordinator"
      userName={coordinatorInfo.name}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </DashboardShell>
  );
}

// --- OVERVIEW TAB ---
function OverviewTab({ onScanClick }: { onScanClick: () => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-primary to-red-dark rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-bold tracking-tight mb-2">Code Rush 2026</h2>
          <p className="opacity-90">Event starts in 4 days. 85% of tasks completed.</p>
          <div className="flex gap-4 mt-6">
            <button onClick={onScanClick} className="bg-white text-red-primary px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all flex items-center gap-2">
              <QrCode size={16} /> Scan Attendance
            </button>
            <button className="bg-red-primary/20 border border-white/30 px-6 py-2 rounded-lg font-bold text-sm hover:bg-white/10 transition-all">View Public Page</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Volunteers" value="45" icon={<Users size={20} />} trend="+5 new" />
        <StatCard label="Pending Tasks" value="12" icon={<CheckSquare size={20} />} isUrgent />
        <StatCard label="Registrations" value="342" icon={<Calendar size={20} />} trend="85% capacity" />
        <StatCard label="Budget Used" value="₹45k" icon={<BarChart3 size={20} />} trend="of ₹60k" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-bold">Critical Tasks</h3>
            <button className="text-red-primary text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { task: 'Finalize Catering Menu', priority: 'High', due: 'Today' },
              { task: 'Confirm Guest Speaker', priority: 'High', due: 'Tomorrow' },
              { task: 'Volunteer Briefing Session', priority: 'Medium', due: '16-03-2026' },
              { task: 'Print Event Passes', priority: 'Medium', due: '17-03-2026' }
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-red-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${t.priority === 'High' ? 'bg-red-primary' : 'bg-amber-500'}`} />
                  <div>
                    <p className="text-sm font-bold">{t.task}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Due: {t.due}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-primary"><CheckCircle2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-display font-bold mb-6">Live Updates</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-3 text-xs relative">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-bold">New Registration</p>
                  <p className="text-gray-500">Amit Kumar registered for 'Web Dev Workshop'.</p>
                  <p className="text-[10px] text-gray-400 mt-1">2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, isUrgent, trend }: any) {
  return (
    <div className={`card p-5 ${isUrgent ? 'border-red-primary bg-red-50/20' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUrgent ? 'bg-red-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
          {icon}
        </div>
        {trend && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{trend}</span>}
      </div>
      <div className="text-3xl font-mono font-bold">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider">{label}</div>
    </div>
  );
}

// --- VOLUNTEERS TAB ---
// --- ATTENDANCE TAB ---
function AttendanceTab({ coordinatorId, coordinatorName }: { coordinatorId: string, coordinatorName: string }) {
  const [mode, setMode] = useState<'scan' | 'history'>('scan');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (mode === 'scan' && !scanResult && !isProcessing && !success && !error) {
      const scanner = new Html5QrcodeScanner(
        "reader-coordinator",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
        scannerRef.current = null;
      }
    };
  }, [mode, scanResult, isProcessing, success, error]);

  // Fetch history
  useEffect(() => {
    const q = query(
      collection(db, 'registrations'),
      where('attended', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(historyData);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'registrations');
    });

    return () => unsubscribe();
  }, []);

  async function onScanSuccess(decodedText: string) {
    if (isProcessing) return;
    
    setScanResult(decodedText);
    if (scannerRef.current) {
      await scannerRef.current.clear();
    }
    handleMarkAttendance(decodedText);
  }

  function onScanFailure(error: any) {}

  const handleMarkAttendance = async (registrationId: string) => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const regRef = doc(db, 'registrations', registrationId);
      const regSnap = await getDoc(regRef);

      if (!regSnap.exists()) {
        setError("Invalid Pass: Registration not found.");
        return;
      }

      const data = regSnap.data();
      if (data.attended) {
        setError(`Already Marked: Attendance for ${data.eventName} was already recorded.`);
        return;
      }

      await updateDoc(regRef, {
        attended: true,
        attendedAt: new Date().toISOString(),
        scannedBy: coordinatorId,
        scannedByName: coordinatorName
      });

      setSuccess(`Success! Attendance marked for ${data.studentName} - ${data.eventName}`);
    } catch (err) {
      setError("Failed to mark attendance. Please try again.");
      handleFirestoreError(err, OperationType.UPDATE, `registrations/${registrationId}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setManualId('');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-center">
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setMode('scan')}
          className={`flex-1 pb-3 text-sm font-bold transition-all relative ${mode === 'scan' ? 'text-red-primary' : 'text-gray-400'}`}
        >
          Check-In Scanner
          {mode === 'scan' && <motion.div layoutId="att-coord" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-primary" />}
        </button>
        <button 
          onClick={() => setMode('history')}
          className={`flex-1 pb-3 text-sm font-bold transition-all relative ${mode === 'history' ? 'text-red-primary' : 'text-gray-400'}`}
        >
          Attendance History
          {mode === 'history' && <motion.div layoutId="att-coord" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-primary" />}
        </button>
      </div>

      {mode === 'scan' ? (
        <div className="space-y-6">
          {!scanResult && !success && !error ? (
            <div className="space-y-6">
              <div id="reader-coordinator" className="overflow-hidden rounded-3xl border-4 border-red-primary shadow-2xl bg-black min-h-[400px]" />
              <div>
                <h3 className="text-2xl font-display font-bold">Participant Check-In</h3>
                <p className="text-sm text-gray-500 mt-2 px-8">Scan the student's QR code from their UniGuild event pass.</p>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Manual Entry</p>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input 
                    type="text" 
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder="Enter Registration ID" 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-primary focus:bg-white transition-all shadow-inner"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && manualId.trim()) {
                        handleMarkAttendance(manualId.trim());
                      }
                    }}
                  />
                  <button 
                    onClick={() => manualId.trim() && handleMarkAttendance(manualId.trim())}
                    disabled={!manualId.trim() || isProcessing}
                    className="btn-primary px-6 py-3 text-sm flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                  >
                    <Check size={18} /> Mark Present
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 space-y-6">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="w-16 h-16 border-4 border-red-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-lg font-bold text-gray-500 uppercase tracking-widest">Verifying Pass...</p>
                </div>
              ) : (
                <>
                  {success && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <Check size={48} />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-green-600">Verified Successfully</h3>
                      <p className="text-lg text-gray-600">{success}</p>
                    </div>
                  )}
                  {error && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 bg-red-100 text-red-primary rounded-full flex items-center justify-center">
                        <X size={48} />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-red-primary">Verification Failed</h3>
                      <p className="text-lg text-gray-600">{error}</p>
                    </div>
                  )}
                  <button 
                    onClick={resetScanner}
                    className="btn-primary w-full max-w-xs mx-auto py-4 text-lg"
                  >
                    Scan Next
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 text-left">
          {history.length > 0 ? (
            <div className="card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Student</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Event</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Time</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Scanner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4 text-sm font-bold">{item.studentName}</td>
                      <td className="px-6 py-4 text-xs font-medium">{item.eventName}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{new Date(item.attendedAt).toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs font-bold text-red-primary">{item.scannedByName || 'System'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-24 text-gray-400 card">
              <History size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No attendance records found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VolunteersTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', department: '', role: 'Logistics' });
  const [members, setMembers] = useState(UniGuildData.volunteers);

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      alert('Please fill in name and email.');
      return;
    }
    setMembers(prev => [...prev, { id: `VOL${Date.now()}`, ...newMember, zone: 'TBD', scans: 0, shift: '0h 0m', status: 'Assigned' }]);
    setNewMember({ name: '', email: '', department: '', role: 'Logistics' });
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Department', 'Role', 'Zone', 'Status'];
    const rows = members.map(v => [v.id, v.name, v.email, v.department, v.role, v.zone, v.status]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'volunteers.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold">Volunteer Directory</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search volunteers..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-primary w-64" />
          </div>
          <button onClick={handleExportCSV} className="btn-secondary py-2 text-xs flex items-center gap-2"><Download size={16} /> Export CSV</button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary py-2 text-xs flex items-center gap-2"><Plus size={16} /> Add Volunteer</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Name</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Department</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Role</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map(v => (
              <tr key={v.id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/150?u=${v.id}`} className="w-8 h-8 rounded-full" alt="" />
                    <div>
                      <p className="text-sm font-bold">{v.name}</p>
                      <p className="text-[10px] text-gray-500">{v.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-medium">{v.department}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] bg-red-50 text-red-primary px-2 py-0.5 rounded font-bold uppercase">{v.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" /> {v.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-red-primary"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Volunteer Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-primary text-white">
                <h3 className="text-xl font-display font-bold">Add Volunteer</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/20 rounded-full transition-all"><X size={24} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Full Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="e.g. Arjun Sharma" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Email</label>
                  <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="e.g. arjun@college.edu" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Department</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="e.g. CSE" value={newMember.department} onChange={e => setNewMember({...newMember, department: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Role</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}>
                    {['Logistics', 'Registration', 'Hospitality', 'Technical', 'Marketing', 'Security'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                <button onClick={() => setShowAddModal(false)} className="btn-secondary px-6">Cancel</button>
                <button onClick={handleAddMember} className="btn-primary px-8">Add Volunteer</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- TASKS TAB ---
function TasksTab() {
  const [activeBoard, setActiveBoard] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 border-b border-gray-200">
          {['All Tasks', 'To Do', 'In Progress', 'Done'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveBoard(tab.toLowerCase())}
              className={`pb-3 px-2 text-sm font-bold transition-all relative ${
                activeBoard === tab.toLowerCase() ? 'text-red-primary' : 'text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="btn-primary py-2 text-xs flex items-center gap-2"><Plus size={16} /> New Task</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {['To Do', 'In Progress', 'Done'].map(col => (
          <div key={col} className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">{col}</h4>
              <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold">3</span>
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-4 space-y-3 cursor-grab active:cursor-grabbing">
                <div className="flex justify-between items-start">
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${i === 1 ? 'bg-red-50 text-red-primary' : 'bg-blue-50 text-blue-600'}`}>
                    {i === 1 ? 'Logistics' : 'Marketing'}
                  </span>
                  <button className="text-gray-300 hover:text-red-primary"><MoreVertical size={14} /></button>
                </div>
                <p className="text-sm font-bold">Setup Registration Desk {i}</p>
                <p className="text-[10px] text-gray-500 line-clamp-2">Ensure all QR scanners are charged and connected to the main server.</p>
                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <div className="flex -space-x-2">
                    {[1, 2].map(j => <img key={j} src={`https://i.pravatar.cc/100?u=${j+i}`} className="w-6 h-6 rounded-full border-2 border-white" alt="" />)}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                    <Clock size={12} /> 2 days
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- JOBS TAB ---
function JobsTab() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    skills: '',
    isPaid: true,
    appLink: '',
    targetSection: 'All',
    targetBranch: 'All',
    targetYear: 'All',
    targetPersona: 'All'
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold">Job Board</h3>
        <button 
          onClick={() => setShowPostModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Briefcase size={18} /> Post Job
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {UniGuildData.jobs.map(job => (
          <div key={job.id} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-primary text-white rounded-lg flex items-center justify-center font-display font-bold text-2xl">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{job.title}</h4>
                  <p className="text-xs text-red-primary font-bold">{job.company}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Applications</p>
                <p className="text-lg font-mono font-bold">28</p>
              </div>
            </div>
            <div className="flex gap-4 mb-6">
              <div className="bg-gray-50 px-3 py-1.5 rounded text-[10px] font-bold uppercase text-gray-500">{job.type}</div>
              <div className="bg-gray-50 px-3 py-1.5 rounded text-[10px] font-bold uppercase text-gray-500">{job.domain}</div>
              <div className="bg-gray-50 px-3 py-1.5 rounded text-[10px] font-bold uppercase text-gray-500">{job.stipend}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary flex-1 py-2 text-xs">View Applications</button>
              <button className="btn-secondary py-2 px-4 text-xs">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Job Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPostModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-primary text-white">
                <h3 className="text-xl font-display font-bold">Post New Opportunity</h3>
                <button onClick={() => setShowPostModal(false)} className="p-1 hover:bg-white/20 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Job Title</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" 
                      placeholder="e.g. Software Engineer Intern"
                      value={newJob.title}
                      onChange={e => setNewJob({...newJob, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Company Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" 
                      placeholder="e.g. Google"
                      value={newJob.company}
                      onChange={e => setNewJob({...newJob, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Job Type</label>
                    <div className="flex items-center gap-4 h-11">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={newJob.isPaid} 
                          onChange={e => setNewJob({...newJob, isPaid: e.target.checked})}
                          className="w-4 h-4 accent-red-primary"
                        />
                        <span className="text-sm font-bold">Paid Position</span>
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Required Skills (Comma separated)</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" 
                      placeholder="React, TypeScript, Node.js..."
                      value={newJob.skills}
                      onChange={e => setNewJob({...newJob, skills: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Official Application Link</label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="url" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-red-primary" 
                        placeholder="https://company.com/careers/job-123"
                        value={newJob.appLink}
                        onChange={e => setNewJob({...newJob, appLink: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold uppercase text-red-primary tracking-widest">Targeting Filters</h4>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <FilterSelect label="Section" value={newJob.targetSection} onChange={(v: string) => setNewJob({...newJob, targetSection: v})} options={['All', 'A', 'B', 'C']} />
                    <FilterSelect label="Branch" value={newJob.targetBranch} onChange={(v: string) => setNewJob({...newJob, targetBranch: v})} options={['All', 'CSE', 'ECE', 'ME', 'CE']} />
                    <FilterSelect label="Year" value={newJob.targetYear} onChange={(v: string) => setNewJob({...newJob, targetYear: v})} options={['All', '1st', '2nd', '3rd', '4th']} />
                    <FilterSelect label="Persona" value={newJob.targetPersona} onChange={(v: string) => setNewJob({...newJob, targetPersona: v})} options={['All', 'Student', 'Volunteer']} />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setShowPostModal(false)} className="btn-secondary px-6">Cancel</button>
                <button onClick={() => setShowPostModal(false)} className="btn-primary px-10">Post Job</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{label}</label>
      <select 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs outline-none focus:border-red-primary"
      >
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
function AnnouncementsTab() {
  const [selectedAudience, setSelectedAudience] = useState('All');
  const [targetEvent, setTargetEvent] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendPush, setSendPush] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [broadcasts, setBroadcasts] = useState([
    { id: 1, subject: 'Venue Change: Hall A to Hall B', message: 'Please inform all participants that the keynote has been moved to the main auditorium.', target: 'All', event: 'Code Rush Hackathon', time: '10:30 AM' },
    { id: 2, subject: 'Volunteer Briefing Tomorrow 9AM', message: 'All volunteers please report to Gate C for briefing session.', target: 'Volunteers', event: 'Code Rush Hackathon', time: '09:00 AM' },
    { id: 3, subject: 'Registration Reminder', message: 'Last chance to register for the AI Summit!', target: 'Participants', event: 'AI Summit', time: 'Yesterday' },
  ]);

  const handleBroadcast = () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in Subject and Message.');
      return;
    }
    const newBroadcast = {
      id: Date.now(),
      subject,
      message,
      target: selectedAudience,
      event: targetEvent === 'all' ? 'All Events' : UniGuildData.events.find(e => e.id === targetEvent)?.name || 'Unknown',
      time: 'Just now',
    };
    setBroadcasts(prev => [newBroadcast, ...prev]);
    setSubject('');
    setMessage('');
    alert(`Announcement broadcast to ${selectedAudience} for ${newBroadcast.event}!`);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="card p-6">
          <h3 className="text-xl font-display font-bold mb-6">Send New Announcement</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Target Event</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={targetEvent} onChange={e => setTargetEvent(e.target.value)}>
                <option value="all">All My Events</option>
                {UniGuildData.events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Target Audience</label>
              <div className="flex gap-3">
                {['All', 'Volunteers', 'Participants', 'Coordinators'].map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedAudience(t)}
                    className={`flex-1 py-2 border rounded-lg text-[10px] font-bold uppercase transition-all ${
                      selectedAudience === t
                        ? 'border-red-primary text-red-primary bg-red-50'
                        : 'border-gray-200 hover:border-red-primary hover:text-red-primary'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Subject</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="Emergency Update / General Info..." value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Message</label>
              <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary h-32 resize-none" placeholder="Type your message here..." value={message} onChange={e => setMessage(e.target.value)} />
              <div className="flex justify-end mt-1 text-[10px] text-gray-400">{message.length} / 500 characters</div>
            </div>
            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-red-primary" checked={sendPush} onChange={e => setSendPush(e.target.checked)} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Send as Push</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-red-primary" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Send as Email</span>
                </label>
              </div>
              <button onClick={handleBroadcast} className="btn-primary py-2 text-xs flex items-center gap-2"><Send size={16} /> Broadcast</button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-display font-bold">Recent Broadcasts</h3>
        <div className="space-y-4">
          {broadcasts.map(b => (
            <div key={b.id} className="card p-4 border-l-4 border-red-primary">
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-bold">{b.subject}</p>
                <span className="text-[8px] text-gray-400 shrink-0 ml-2">{b.time}</span>
              </div>
              <p className="text-[10px] text-gray-500 line-clamp-2">{b.message}</p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                <div>
                  <span className="text-[8px] font-bold text-red-primary uppercase">→ {b.target}</span>
                  <span className="text-[8px] text-gray-400 ml-2">• {b.event}</span>
                </div>
                <button onClick={() => setBroadcasts(prev => prev.filter(x => x.id !== b.id))} className="text-gray-400 hover:text-red-primary"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- ANALYTICS TAB ---
function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Registration Conversion</p>
          <p className="text-4xl font-mono font-bold text-red-primary">68%</p>
          <p className="text-[10px] text-green-600 font-bold mt-2">↑ 12% from last week</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Volunteer Efficiency</p>
          <p className="text-4xl font-mono font-bold text-red-primary">92%</p>
          <p className="text-[10px] text-gray-400 font-bold mt-2">Based on task completion</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Social Reach</p>
          <p className="text-4xl font-mono font-bold text-red-primary">12.4k</p>
          <p className="text-[10px] text-red-primary font-bold mt-2">Impressions</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Feedback Score</p>
          <p className="text-4xl font-mono font-bold text-red-primary">4.8</p>
          <p className="text-[10px] text-amber-500 font-bold mt-2">★★★★★</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-bold">Registration Trend</h3>
            <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-red-primary"><Download size={18} /></button>
          </div>
          <div className="h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Chart Visualization Placeholder</p>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-display font-bold mb-6">Department Performance</h3>
          <div className="space-y-6">
            {[
              { dept: 'Technical', val: 95 },
              { dept: 'Marketing', val: 78 },
              { dept: 'Logistics', val: 88 },
              { dept: 'Hospitality', val: 92 }
            ].map(d => (
              <div key={d.dept}>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>{d.dept}</span>
                  <span className="text-red-primary">{d.val}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-primary transition-all duration-1000" style={{ width: `${d.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PROFILE TAB ---
function ProfileTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="card p-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="relative group">
          <img src="https://i.pravatar.cc/300?u=rahul" className="w-32 h-32 rounded-full border-4 border-red-primary p-1" alt="" />
          <button className="absolute bottom-0 right-0 bg-red-primary text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"><Edit size={14} /></button>
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h3 className="text-3xl font-display font-bold">Rahul Sharma</h3>
            <span className="bg-red-50 text-red-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase self-center md:self-auto">Event Coordinator</span>
          </div>
          <p className="text-gray-500 font-medium mb-6">Final Year B.Tech • Computer Science • Sasi Institute of Technology</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="text-center px-6 border-r border-gray-100">
              <p className="text-xl font-mono font-bold">12</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Events Managed</p>
            </div>
            <div className="text-center px-6 border-r border-gray-100">
              <p className="text-xl font-mono font-bold">150+</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Volunteers Led</p>
            </div>
            <div className="text-center px-6">
              <p className="text-xl font-mono font-bold">4.9</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h4 className="text-xl font-display font-bold mb-6 border-b border-gray-50 pb-2">Contact Information</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Email Address</label>
              <p className="text-sm font-bold">rahul.sharma@sasi.ac.in</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Phone Number</label>
              <p className="text-sm font-bold">+91 98765 43210</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Department</label>
              <p className="text-sm font-bold">Computer Science & Engineering</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <h4 className="text-xl font-display font-bold mb-6 border-b border-gray-50 pb-2">Coordinator Skills</h4>
          <div className="flex flex-wrap gap-2">
            {['Team Leadership', 'Public Speaking', 'Crisis Management', 'Logistics Planning', 'Budgeting', 'Vendor Management'].map(s => (
              <span key={s} className="bg-gray-50 text-gray-600 border border-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CERTIFICATES TAB ---
function CertificatesTab() {
  const [template, setTemplate] = useState<string | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isIssuing, setIsIssuing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'registrations'),
      where('attended', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setParticipants(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'registrations');
    });

    return () => unsubscribe();
  }, []);

  const handleIssueCertificate = async (participantId: string) => {
    if (!template) {
      alert("Please upload a certificate template first.");
      return;
    }

    setIsIssuing(true);
    try {
      const regRef = doc(db, 'registrations', participantId);
      await updateDoc(regRef, {
        certificateIssued: true,
        certificateUrl: 'https://example.com/certificate-template.pdf', // In real app, this would be generated
        issuedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `registrations/${participantId}`);
    } finally {
      setIsIssuing(false);
    }
  };

  const filteredParticipants = participants.filter(p => 
    p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold">Issue Certificates</h2>
          <p className="text-sm text-gray-500">Generate and send certificates to verified participants.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download size={16} /> Export List
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FileText size={18} className="text-red-primary" /> Certificate Template
            </h3>
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                template ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-red-primary hover:bg-red-50'
              }`}
              onClick={() => setTemplate('template_v1')}
            >
              {template ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <p className="text-sm font-bold text-green-800">Template Uploaded</p>
                  <p className="text-[10px] text-green-600 uppercase font-bold">Standard_Participation.pdf</p>
                  <button className="text-[10px] font-bold text-red-primary uppercase mt-4 hover:underline">Change Template</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                    <Plus size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-600">Upload Template</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">PDF or Image (Max 5MB)</p>
                </div>
              )}
            </div>
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                <strong>Note:</strong> The system will automatically overlay the student's name and event details onto the selected template.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
              <h3 className="font-bold">Eligible Participants ({participants.length})</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by name or ID..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4">Student</th>
                    <th className="pb-4">College</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} className="group hover:bg-gray-50/50 transition-all">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-50 text-red-primary flex items-center justify-center font-bold text-xs">
                            {p.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{p.studentName}</p>
                            <p className="text-[10px] text-gray-500">{p.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-xs text-gray-600">{p.college || 'IIT Bombay'}</p>
                      </td>
                      <td className="py-4">
                        {p.certificateIssued ? (
                          <span className="bg-green-50 text-green-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                            <Check size={10} /> Issued
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase w-fit">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        {p.certificateIssued ? (
                          <button className="text-gray-400 hover:text-red-primary p-2 transition-all">
                            <Eye size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleIssueCertificate(p.id)}
                            disabled={isIssuing || !template}
                            className="btn-primary py-1.5 px-3 text-[10px] disabled:opacity-50"
                          >
                            Issue
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredParticipants.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                        No eligible participants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

