
import React, { useState } from 'react';
import { 
  LayoutDashboard, School, Users, Calendar, Briefcase, Megaphone, 
  CheckSquare, BarChart3, Settings, ScrollText, TrendingUp, 
  ArrowUpRight, Clock, Download, Search, Filter, MoreVertical,
  UserPlus, Mail, Shield, UserX, ExternalLink, XCircle, Plus, X, Trash2, Edit
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Legend, Filler 
} from 'chart.js';
import { UniGuildData } from '../data';
import DashboardShell from '../components/DashboardShell';
import { motion, AnimatePresence } from 'motion/react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'colleges', label: 'Colleges', icon: <School size={20} /> },
  { id: 'users', label: 'Users', icon: <Users size={20} /> },
  { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
  { id: 'jobs', label: 'Jobs', icon: <Briefcase size={20} /> },
  { id: 'announcements', label: 'Announcements', icon: <Megaphone size={20} /> },
  { id: 'approvals', label: 'Approvals', icon: <CheckSquare size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  { id: 'audit', label: 'Audit Logs', icon: <ScrollText size={20} /> },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'colleges': return <CollegesTab />;
      case 'users': return <UsersTab />;
      case 'events': return <EventsTab />;
      case 'jobs': return <JobsTab />;
      case 'announcements': return <AnnouncementsTab />;
      case 'approvals': return <ApprovalsTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'settings': return <SettingsTab />;
      case 'audit': return <AuditTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <DashboardShell
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      roleName="Super Admin"
      userName="Admin User"
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
function OverviewTab() {
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Users',
        data: [2000, 3500, 4800, 6200, 7500, 9000, 10500, 12000, 13500, 14200, 14800, 15248],
        borderColor: '#f40000',
        backgroundColor: 'rgba(244, 0, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Events',
        data: [5, 12, 18, 22, 28, 30, 35, 40, 42, 38, 35, 34],
        borderColor: '#444444',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
      }
    ]
  };

  const doughnutData = {
    labels: ['Students', 'Coordinators', 'Evaluators', 'Volunteers', 'Orgs'],
    datasets: [{
      data: [12000, 500, 300, 2000, 448],
      backgroundColor: ['#f40000', '#333333', '#666666', '#999999', '#cccccc'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Total Users" value="15,248" trend="+8.2%" icon={<Users size={20} />} />
        <MetricCard label="Active Events" value="34" trend="Stable" icon={<Calendar size={20} />} />
        <MetricCard label="Organizations" value="218" trend="+4.1%" icon={<School size={20} />} />
        <MetricCard label="Pending Approvals" value="7" trend="Urgent" icon={<CheckSquare size={20} />} isUrgent />
        <MetricCard label="Jobs Posted" value="89" trend="+12%" icon={<Briefcase size={20} />} />
        <MetricCard label="Revenue" value="₹4.8L" trend="+18%" icon={<TrendingUp size={20} />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-display font-bold mb-6">Platform Growth (12 Months)</h3>
          <div className="h-80">
            <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-display font-bold mb-6">User Distribution</h3>
          <div className="h-80 flex justify-center">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-xl font-display font-bold mb-6">Events by Category</h3>
          <div className="h-64">
            <Bar 
              data={{
                labels: ['Hackathons', 'Webinars', 'Workshops', 'Competitions', 'Drives'],
                datasets: [{
                  label: 'Events',
                  data: [12, 8, 15, 10, 5],
                  backgroundColor: '#f40000',
                  borderRadius: 6,
                }]
              }} 
              options={{ maintainAspectRatio: false }} 
            />
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-display font-bold mb-6">Live Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-3 border-l-2 border-red-primary pl-4 py-1">
                <div>
                  <p className="text-xs font-bold">New Event Approval Request</p>
                  <p className="text-[10px] text-gray-500">IIT Bombay • 2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, icon, isUrgent }: any) {
  return (
    <div className={`card p-4 ${isUrgent ? 'border-red-primary bg-red-50/30' : ''}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${isUrgent ? 'bg-red-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
        {icon}
      </div>
      <div className="text-2xl font-mono font-bold leading-tight">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase font-bold mt-1">{label}</div>
      <div className={`text-[10px] font-bold mt-2 ${trend.includes('+') ? 'text-green-600' : isUrgent ? 'text-red-primary' : 'text-gray-400'}`}>
        {trend}
      </div>
    </div>
  );
}

// --- COLLEGES TAB ---
function CollegesTab() {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'details' | 'students' | 'coordinators'>('details');

  const [students, setStudents] = useState([
    { id: 'STU001', name: 'Arjun Sharma', branch: 'CSE', year: '3rd Year', email: 'arjun@iitb.ac.in' },
    { id: 'STU002', name: 'Priya Patel', branch: 'ECE', year: '2nd Year', email: 'priya@iitb.ac.in' },
    { id: 'STU003', name: 'Rahul Verma', branch: 'ME', year: '4th Year', email: 'rahul@iitb.ac.in' },
  ]);

  const [coordinators, setCoordinators] = useState([
    { id: 'COORD001', name: 'Dr. Ramesh Kumar', dept: 'CSE', email: 'ramesh.k@iitb.ac.in' },
    { id: 'COORD002', name: 'Prof. Sunita Rao', dept: 'ECE', email: 'sunita.r@iitb.ac.in' },
  ]);

  const removeStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const removeCoordinator = (id: string) => {
    setCoordinators(prev => prev.filter(c => c.id !== id));
  };

  const addStudent = () => {
    const newStu = {
      id: `STU${Math.floor(Math.random() * 1000)}`,
      name: 'New Student',
      branch: 'CSE',
      year: '1st Year',
      email: 'new@college.edu'
    };
    setStudents(prev => [...prev, newStu]);
  };

  const addCoordinator = () => {
    const newCoord = {
      id: `COORD${Math.floor(Math.random() * 1000)}`,
      name: 'New Coordinator',
      dept: 'General',
      email: 'new.coord@college.edu'
    };
    setCoordinators(prev => [...prev, newCoord]);
  };

  return (
    <div className="flex gap-6 relative">
      <div className={`flex-1 grid md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all ${selectedCollege ? 'mr-96' : ''}`}>
        {UniGuildData.colleges.map(college => (
          <div 
            key={college} 
            onClick={() => {
              setSelectedCollege(college);
              setViewMode('details');
            }}
            className="card p-6 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-display font-bold text-2xl group-hover:bg-red-primary group-hover:text-white transition-all">
                {college.charAt(0)}
              </div>
              <button className="text-gray-400 hover:text-red-primary"><MoreVertical size={18} /></button>
            </div>
            <h3 className="text-xl font-display font-bold mb-2">{college}</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Students</p>
                <p className="font-mono font-bold">1,248</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Coordinators</p>
                <p className="font-mono font-bold">12</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Side Panel */}
      <AnimatePresence>
        {selectedCollege && (
          <motion.aside 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-16 right-0 bottom-0 w-96 bg-white border-l border-gray-200 shadow-2xl z-[85] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-red-primary">{selectedCollege}</h2>
                <button onClick={() => setSelectedCollege(null)} className="p-2 hover:bg-gray-100 rounded-full"><XCircle size={24} /></button>
              </div>
              
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                {(['details', 'students', 'coordinators'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${
                      viewMode === mode ? 'bg-white text-red-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-8">
              {viewMode === 'details' && (
                <>
                  <section>
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">Quick Stats</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-lg font-mono font-bold">1.2k</p>
                        <p className="text-[8px] uppercase font-bold text-gray-500">Students</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-lg font-mono font-bold">12</p>
                        <p className="text-[8px] uppercase font-bold text-gray-500">Coordinators</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-lg font-mono font-bold">34</p>
                        <p className="text-[8px] uppercase font-bold text-gray-500">Events</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">College Info</h4>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location</span>
                        <span className="font-bold">Mumbai, Maharashtra</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Established</span>
                        <span className="font-bold">1958</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type</span>
                        <span className="font-bold">Public Technical University</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">Recent Events</h4>
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:border-red-primary cursor-pointer">
                          <p className="text-xs font-bold">Code Rush Hackathon</p>
                          <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold">Active</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <button className="btn-primary w-full flex items-center justify-center gap-2">
                    <Download size={18} /> Download College Report
                  </button>
                </>
              )}

              {viewMode === 'students' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Student List</h4>
                    <button 
                      onClick={addStudent}
                      className="text-[10px] text-red-primary font-bold hover:underline"
                    >
                      Add Student
                    </button>
                  </div>
                  <div className="space-y-3">
                    {students.map(stu => (
                      <div key={stu.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-primary/10 text-red-primary flex items-center justify-center font-bold text-xs">
                              {stu.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold">{stu.name}</p>
                              <p className="text-[10px] text-gray-500">{stu.branch} • {stu.year}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeStudent(stu.id)}
                            className="text-gray-300 hover:text-red-primary opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full btn-secondary py-2 text-xs flex items-center justify-center gap-2">
                    <Download size={16} /> Download Student Data
                  </button>
                </div>
              )}

              {viewMode === 'coordinators' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Coordinators</h4>
                    <button 
                      onClick={addCoordinator}
                      className="text-[10px] text-red-primary font-bold hover:underline"
                    >
                      Add Coordinator
                    </button>
                  </div>
                  <div className="space-y-3">
                    {coordinators.map(coord => (
                      <div key={coord.id} className="p-4 bg-red-50 rounded-xl border border-red-100 group">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-primary text-white flex items-center justify-center font-bold">
                              {coord.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{coord.name}</p>
                              <p className="text-xs text-gray-500">{coord.dept} Department</p>
                              <p className="text-[10px] text-gray-400 mt-1">{coord.email}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeCoordinator(coord.id)}
                            className="text-red-200 hover:text-red-primary opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <UserX size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- USERS TAB ---
function UsersTab() {
  const [roleFilter, setRoleFilter] = useState('All');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {['All', 'Students', 'Coordinators', 'Evaluators', 'Volunteers'].map(role => (
            <button 
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                roleFilter === role ? 'bg-red-primary text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-red-primary'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"><Download size={16} /> Export CSV</button>
          <button className="btn-primary py-2 px-4 text-xs flex items-center gap-2"><UserPlus size={16} /> Add User</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">User</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Role</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">College</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Joined</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <tr key={i} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/${i}/40/40`} className="w-8 h-8 rounded-full" alt="" />
                    <div>
                      <p className="text-sm font-bold">User Name {i}</p>
                      <p className="text-[10px] text-gray-500">user{i}@college.edu</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold uppercase">Student</span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">IIT Bombay</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold uppercase">Active</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">12-03-2026</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-red-primary"><ExternalLink size={16} /></button>
                    <button className="p-2 text-gray-400 hover:text-red-primary"><Shield size={16} /></button>
                    <button className="p-2 text-gray-400 hover:text-red-primary"><UserX size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- EVENTS TAB ---
function EventsTab() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    category: 'Hackathon',
    hostCollege: '',
    date: '',
    time: '',
    venue: '',
    maxParticipants: 100,
    description: '',
    tags: '',
    prizes: '',
    venueType: 'Offline',
  });

  const handleCreateEvent = () => {
    alert(`Event "${newEvent.name}" created successfully!`);
    setShowCreateModal(false);
    setNewEvent({ name: '', category: 'Hackathon', hostCollege: '', date: '', time: '', venue: '', maxParticipants: 100, description: '', tags: '', prizes: '', venueType: 'Offline' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold">Event Management</h3>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2"><Calendar size={18} /> Create Event</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Event Name</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Host College</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Participants</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {UniGuildData.events.map(event => (
              <tr key={event.id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4 font-bold text-sm">{event.name}</td>
                <td className="px-6 py-4 text-sm">{event.host}</td>
                <td className="px-6 py-4 text-sm">{event.date}</td>
                <td className="px-6 py-4 font-mono text-sm">{event.slots.filled}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] bg-red-50 text-red-primary px-2 py-0.5 rounded font-bold uppercase">{event.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="btn-secondary py-1.5 px-3 text-[10px]">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-primary text-white">
                <h3 className="text-xl font-display font-bold flex items-center gap-2"><Calendar size={20} /> Create New Event</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-white/20 rounded-full transition-all"><X size={24} /></button>
              </div>

              <div className="p-8 max-h-[75vh] overflow-y-auto space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-red-primary tracking-widest mb-4">Basic Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Event Name</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="e.g. National Hackathon 2026" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Category</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})}>
                        <option>Hackathon</option>
                        <option>Webinar</option>
                        <option>Workshop</option>
                        <option>Competition</option>
                        <option>Drive</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Host College</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={newEvent.hostCollege} onChange={e => setNewEvent({...newEvent, hostCollege: e.target.value})}>
                        <option value="">Select College...</option>
                        {UniGuildData.colleges.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Description</label>
                      <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary h-24 resize-none" placeholder="Brief event description..." value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Tags (comma separated)</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="AI, Coding, Innovation" value={newEvent.tags} onChange={e => setNewEvent({...newEvent, tags: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Prizes (comma separated)</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="₹1,00,000, ₹50,000" value={newEvent.prizes} onChange={e => setNewEvent({...newEvent, prizes: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Schedule & Venue */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold uppercase text-red-primary tracking-widest mb-4">Schedule & Venue</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Event Date</label>
                      <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Event Time</label>
                      <input type="time" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Venue Type</label>
                      <div className="flex gap-2">
                        {['Online', 'Offline', 'Hybrid'].map(type => (
                          <button key={type} onClick={() => setNewEvent({...newEvent, venueType: type})} className={`flex-1 py-2.5 border rounded-lg text-xs font-bold transition-all ${newEvent.venueType === type ? 'border-red-primary text-red-primary bg-red-50' : 'border-gray-200 hover:border-red-primary hover:text-red-primary'}`}>{type}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Max Participants</label>
                      <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={newEvent.maxParticipants} onChange={e => setNewEvent({...newEvent, maxParticipants: Number(e.target.value)})} />
                    </div>
                    {newEvent.venueType !== 'Online' && (
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Venue / Location</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="e.g. Main Auditorium, Block A" value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setShowCreateModal(false)} className="btn-secondary px-6">Cancel</button>
                <button onClick={handleCreateEvent} className="btn-primary px-10">Create Event</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
    stipend: '',
    appLink: '',
    targetSection: 'All',
    targetBranch: 'All',
    targetYear: 'All',
    targetPersona: 'All',
    targetInstitution: 'All',
    targetCoordinator: 'All'
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold">Job Board Management</h3>
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
                <p className="text-lg font-mono font-bold">124</p>
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
                  {newJob.isPaid && (
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Stipend / Salary</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" 
                        placeholder="e.g. ₹20,000/month or ₹12-18 LPA"
                        value={newJob.stipend}
                        onChange={e => setNewJob({...newJob, stipend: e.target.value})}
                      />
                    </div>
                  )}
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <FilterSelect label="Section" value={newJob.targetSection} onChange={v => setNewJob({...newJob, targetSection: v})} options={['All', 'A', 'B', 'C']} />
                    <FilterSelect label="Branch" value={newJob.targetBranch} onChange={v => setNewJob({...newJob, targetBranch: v})} options={['All', 'CSE', 'ECE', 'ME', 'CE']} />
                    <FilterSelect label="Year" value={newJob.targetYear} onChange={v => setNewJob({...newJob, targetYear: v})} options={['All', '1st', '2nd', '3rd', '4th']} />
                    <FilterSelect label="Persona" value={newJob.targetPersona} onChange={v => setNewJob({...newJob, targetPersona: v})} options={['All', 'Student', 'Volunteer', 'Coordinator']} />
                    <FilterSelect label="Institution" value={newJob.targetInstitution} onChange={v => setNewJob({...newJob, targetInstitution: v})} options={['All', ...UniGuildData.colleges]} />
                    <FilterSelect label="Coordinator" value={newJob.targetCoordinator} onChange={v => setNewJob({...newJob, targetCoordinator: v})} options={['All', 'Dr. Ramesh', 'Prof. Sunita']} />
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

// --- ANNOUNCEMENTS TAB ---
function AnnouncementsTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="card p-8">
        <h3 className="text-2xl font-display font-bold mb-6">Create Platform Announcement</h3>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Subject</label>
            <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="Enter announcement subject..." />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Message</label>
            <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary h-32 resize-none" placeholder="Enter announcement message..." />
            <div className="flex justify-end mt-1 text-[10px] text-gray-400">0 / 500 characters</div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Priority</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary">
                <option>Normal</option>
                <option>Important</option>
                <option>Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Target Audience</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary">
                <option>All Users</option>
                <option>Students Only</option>
                <option>Coordinators Only</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Send Via</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary">
                <option>In-App Only</option>
                <option>Email Only</option>
                <option>Both</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button className="btn-secondary">Save Draft</button>
            <button className="btn-primary px-10">Send Announcement</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- APPROVALS TAB ---
function ApprovalsTab() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
          <CheckSquare size={20} className="text-red-primary" />
          Pending Approvals (7)
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <School size={24} />
                </div>
                <div>
                  <h4 className="font-bold">New Organization Registration</h4>
                  <p className="text-xs text-gray-500">Tech Innovators Club • bits-pilani.ac.in</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-secondary py-2 px-4 text-xs">View Docs</button>
                <button className="btn-primary py-2 px-6 text-xs">Approve</button>
                <button className="bg-gray-100 text-gray-600 font-bold py-2 px-4 rounded-lg text-xs hover:bg-gray-200">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// --- ANALYTICS TAB ---
function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold">Platform Analytics</h3>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold">Last 30 Days</button>
          <button className="btn-primary py-1.5 px-4 text-xs">Download Report</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h4 className="text-sm font-bold uppercase text-gray-400 mb-6 tracking-widest">Students by College</h4>
          <div className="h-80">
            <Bar 
              data={{
                labels: UniGuildData.colleges.slice(0, 8),
                datasets: [{
                  label: 'Students',
                  data: [1200, 1100, 950, 800, 750, 600, 550, 400],
                  backgroundColor: '#f40000',
                  borderRadius: 4,
                }]
              }} 
              options={{ indexAxis: 'y', maintainAspectRatio: false }} 
            />
          </div>
        </div>
        <div className="card p-6">
          <h4 className="text-sm font-bold uppercase text-gray-400 mb-6 tracking-widest">Event Participation Rate</h4>
          <div className="h-80">
            <Line 
              data={{
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                  label: 'Participation %',
                  data: [65, 72, 85, 82],
                  borderColor: '#f40000',
                  tension: 0.4,
                  fill: true,
                  backgroundColor: 'rgba(244, 0, 0, 0.05)'
                }]
              }} 
              options={{ maintainAspectRatio: false }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SETTINGS TAB ---
function SettingsTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card divide-y divide-gray-100">
        <div className="p-6">
          <h3 className="text-xl font-display font-bold mb-6">Platform Settings</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">Maintenance Mode</p>
                <p className="text-xs text-gray-500">Take the platform offline for updates</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">Self-Registration</p>
                <p className="text-xs text-gray-500">Allow new users to register without invite</p>
              </div>
              <div className="w-12 h-6 bg-red-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-display font-bold mb-6">Security & Policy</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Session Timeout (mins)</label>
              <input type="number" defaultValue={30} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Max File Size (MB)</label>
              <input type="number" defaultValue={5} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- AUDIT TAB ---
function AuditTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold">System Audit Logs</h3>
        <button className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"><Download size={16} /> Export Logs</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Timestamp</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">User</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Action</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Target</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <tr key={i} className="text-xs">
                <td className="px-6 py-4 font-mono text-gray-500">15-03-2026 10:45:2{i}</td>
                <td className="px-6 py-4 font-bold">Admin User</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">Update_Settings</span>
                </td>
                <td className="px-6 py-4 text-gray-600">Platform Configuration</td>
                <td className="px-6 py-4 font-mono text-gray-400">192.168.1.{i}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
