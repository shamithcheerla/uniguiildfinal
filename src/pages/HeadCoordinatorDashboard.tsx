
import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, PlusCircle, Users, ClipboardCheck, 
  Megaphone, BarChart3, User, Clock, CheckCircle2, MoreVertical,
  Download, Search, Filter, Mail, Trash2, Edit, ExternalLink,
  MapPin, Globe, Users2, UserPlus, Award, FileText, Check, Plus, Eye, QrCode, Briefcase, X
} from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { UniGuildData } from '../data';
import DashboardShell from '../components/DashboardShell';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'my-events', label: 'My Events', icon: <Calendar size={20} /> },
  { id: 'create-event', label: 'Create Event', icon: <PlusCircle size={20} /> },
  { id: 'my-team', label: 'My Team', icon: <Users size={20} /> },
  { id: 'attendance', label: 'Attendance', icon: <ClipboardCheck size={20} /> },
  { id: 'certificates', label: 'Certificates', icon: <Award size={20} /> },
  { id: 'jobs', label: 'Jobs', icon: <Briefcase size={20} /> },
  { id: 'announcements', label: 'Announcements', icon: <Megaphone size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { id: 'profile', label: 'Profile', icon: <User size={20} /> },
];

export default function HeadCoordinatorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab onCreateEvent={() => setActiveTab('create-event')} onViewAttendance={() => setActiveTab('attendance')} />;
      case 'my-events': return <MyEventsTab />;
      case 'create-event': return <CreateEventTab />;
      case 'my-team': return <MyTeamTab />;
      case 'attendance': return <AttendanceTab />;
      case 'certificates': return <CertificatesTab />;
      case 'jobs': return <JobsTab />;
      case 'announcements': return <AnnouncementsTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'profile': return <ProfileTab />;
      default: return <OverviewTab onCreateEvent={() => setActiveTab('create-event')} onViewAttendance={() => setActiveTab('attendance')} />;
    }
  };

  return (
    <DashboardShell
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      roleName="Head Coordinator"
      userName="Dr. Ramesh Kumar"
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
function OverviewTab({ onCreateEvent, onViewAttendance }: { onCreateEvent: () => void; onViewAttendance: () => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-primary to-red-dark rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight mb-2">Good morning, Dr. Ramesh Kumar!</h2>
          <p className="opacity-90 mb-4">IIT Bombay • Department of Computer Science</p>
          <div className="flex gap-3">
            <button onClick={onCreateEvent} className="bg-white text-red-primary font-bold py-2 px-6 rounded-lg text-sm shadow-md hover:bg-gray-50 transition-all">+ Create Event</button>
            <button onClick={onViewAttendance} className="bg-white/20 backdrop-blur text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-white/30 transition-all">View Attendance</button>
          </div>
        </div>
        <div className="hidden lg:block">
          <img src="https://picsum.photos/seed/coordinator/300/200" className="w-64 rounded-xl shadow-2xl border-4 border-white/20" alt="" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Events Managed" value="12" icon={<Calendar size={20} />} />
        <StatCard label="Upcoming" value="3" icon={<Clock size={20} />} />
        <StatCard label="Team Members" value="28" icon={<Users size={20} />} />
        <StatCard label="Participants" value="1,840" icon={<Users2 size={20} />} />
        <StatCard label="Avg Attendance" value="87%" icon={<CheckCircle2 size={20} />} />
        <StatCard label="Pending Tasks" value="5" icon={<ClipboardCheck size={20} />} isUrgent />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-xl font-display font-bold mb-6">Participation by Event</h3>
          <div className="h-64">
            <Bar 
              data={{
                labels: ['Code Rush', 'AI Summit', 'Design Day', 'Web Dev', 'Cyber Sec', 'ML Camp'],
                datasets: [{
                  label: 'Participants',
                  data: [423, 312, 250, 210, 180, 150],
                  backgroundColor: '#f40000',
                  borderRadius: 4
                }]
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-display font-bold mb-6">Next 3 Events</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-red-primary">Mar</span>
                  <span className="text-lg font-mono font-bold">2{i}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold leading-tight">Code Rush Hackathon 2025</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                    <span className="font-mono text-red-primary">02:14:35</span>
                    <span>•</span>
                    <span className="bg-red-50 text-red-primary px-1.5 rounded font-bold uppercase">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, isUrgent }: any) {
  return (
    <div className={`card p-4 text-center ${isUrgent ? 'border-red-primary bg-red-50/30' : ''}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3 ${isUrgent ? 'bg-red-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
        {icon}
      </div>
      <div className="text-2xl font-mono font-bold">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase font-bold mt-1">{label}</div>
    </div>
  );
}

// --- MY EVENTS TAB ---
function MyEventsTab() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  return (
    <div className="flex gap-6 relative">
      <div className={`flex-1 space-y-6 transition-all ${selectedEvent ? 'mr-96' : ''}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-display font-bold">Managed Events</h3>
          <div className="flex gap-2">
            <button className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"><Download size={16} /> Export All</button>
          </div>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Event Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Participants</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Attendance</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {UniGuildData.events.map(event => (
                <tr key={event.id} onClick={() => setSelectedEvent(event)} className="hover:bg-gray-50 cursor-pointer transition-all">
                  <td className="px-6 py-4 font-bold text-sm">{event.name}</td>
                  <td className="px-6 py-4 text-xs font-medium">{event.category}</td>
                  <td className="px-6 py-4 text-xs">{event.date}</td>
                  <td className="px-6 py-4 font-mono text-sm">{event.slots.filled}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-primary w-[87%]" />
                      </div>
                      <span className="text-[10px] font-bold">87%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-red-primary"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.aside 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-16 right-0 bottom-0 w-96 bg-white border-l border-gray-200 shadow-2xl z-[85] overflow-y-auto p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold text-red-primary">{selectedEvent.name}</h2>
              <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-gray-100 rounded-full"><XCircle size={24} /></button>
            </div>

            <div className="space-y-8">
              <section>
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">Stage Progress</h4>
                <div className="space-y-4">
                  {selectedEvent.stages.map((stage: any, i: number) => (
                    <div key={stage.name} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        stage.status === 'Completed' ? 'bg-green-500 text-white' : stage.status === 'Ongoing' ? 'bg-red-primary text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {stage.status === 'Completed' ? '✓' : i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold">{stage.name}</p>
                        <p className="text-[10px] text-gray-500">Deadline: {stage.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">Team Assigned</h4>
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img src={`https://picsum.photos/seed/${i+10}/40/40`} className="w-8 h-8 rounded-full" alt="" />
                      <div>
                        <p className="text-xs font-bold">Volunteer Name {i}</p>
                        <p className="text-[10px] text-gray-500">Gate A • Active</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <button className="btn-secondary py-2 text-xs flex items-center justify-center gap-2"><Download size={14} /> Export CSV</button>
                <button className="btn-primary py-2 text-xs flex items-center justify-center gap-2">Publish Results</button>
              </div>
              <button className="w-full bg-green-600 text-white font-bold py-3 rounded-lg text-sm hover:bg-green-700 transition-all">Mark Event Complete</button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- CREATE EVENT TAB ---
function CreateEventTab() {
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    name: '', category: 'Hackathon', tags: '', description: '',
    coverImage: null as string | null,
    startDate: '', endDate: '', venueType: 'Offline', maxParticipants: 100, location: '',
  });

  const steps = ['Basic', 'Schedule', 'Stages', 'Judging', 'Team'];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="flex justify-between mb-10 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
        {steps.map((label, i) => (
          <div key={label} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center font-bold transition-all ${
              step > i + 1 ? 'bg-green-500 text-white shadow-lg' : step === i + 1 ? 'bg-red-primary text-white shadow-lg shadow-red-primary/30' : 'bg-gray-100 text-gray-400'
            }`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${step >= i + 1 ? 'text-red-primary' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="card p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-red-primary">Step 1: Basic Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Event Name</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="e.g. Code Rush Hackathon 2026" value={eventData.name} onChange={e => setEventData({...eventData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Category</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={eventData.category} onChange={e => setEventData({...eventData, category: e.target.value})}>
                  <option>Hackathon</option>
                  <option>Webinar</option>
                  <option>Workshop</option>
                  <option>Competition</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Tags</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="Coding, Innovation, AI..." value={eventData.tags} onChange={e => setEventData({...eventData, tags: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Short Description (150 chars)</label>
                <textarea maxLength={150} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary h-20 resize-none" value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Cover Image</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${ eventData.coverImage ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-red-primary hover:bg-red-50/30' }`}
                  onClick={() => setEventData({...eventData, coverImage: 'uploaded'})}
                >
                  {eventData.coverImage ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"><Check size={24} /></div>
                      <p className="text-sm font-bold text-green-700">Cover Image Uploaded</p>
                      <button onClick={e => { e.stopPropagation(); setEventData({...eventData, coverImage: null}); }} className="text-[10px] font-bold text-red-primary hover:underline">Remove</button>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3"><Plus size={24} /></div>
                      <p className="text-sm font-bold text-gray-500">Click to Upload Cover Image</p>
                      <p className="text-[10px] text-gray-400 mt-2">Recommended size: 1200x600px (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-red-primary">Step 2: Schedule & Venue</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Start Date & Time</label>
                <input type="datetime-local" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={eventData.startDate} onChange={e => setEventData({...eventData, startDate: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">End Date & Time</label>
                <input type="datetime-local" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={eventData.endDate} onChange={e => setEventData({...eventData, endDate: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Venue Type</label>
                <div className="flex gap-2">
                  {['Online', 'Offline', 'Hybrid'].map(type => (
                    <button key={type} onClick={() => setEventData({...eventData, venueType: type})} className={`flex-1 py-2 border rounded-lg text-xs font-bold transition-all ${ eventData.venueType === type ? 'border-red-primary text-red-primary bg-red-50' : 'border-gray-200 hover:border-red-primary hover:text-red-primary' }`}>{type}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Max Participants</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={eventData.maxParticipants} onChange={e => setEventData({...eventData, maxParticipants: Number(e.target.value)})} />
              </div>
              {eventData.venueType !== 'Online' && (
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Venue / Location</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" placeholder="e.g. Main Auditorium" value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})} />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-red-primary">Step 3: Event Stages</h3>
            <p className="text-sm text-gray-500">Define the stages/rounds of your event. Each stage has a name and deadline.</p>
            <div className="space-y-4">
              {['Idea Submission', 'Prototype Demo', 'Final Pitch'].map((stage, i) => (
                <div key={stage} className="flex items-center gap-4 card p-4">
                  <div className="w-8 h-8 rounded-full bg-red-primary text-white flex items-center justify-center font-bold text-sm shrink-0">{i+1}</div>
                  <div className="flex-1">
                    <input type="text" defaultValue={stage} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-primary" />
                  </div>
                  <input type="date" className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-primary" />
                </div>
              ))}
              <button className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-400 hover:border-red-primary hover:text-red-primary transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Add Stage
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-red-primary">Step 4: Judging Criteria</h3>
            <p className="text-sm text-gray-500">Set weight criteria that evaluators will use to score participants.</p>
            <div className="space-y-4">
              {['Innovation (30%)', 'Technical Complexity (25%)', 'Presentation (25%)', 'Feasibility (20%)'].map(c => (
                <div key={c} className="flex items-center gap-4 card p-4">
                  <div className="flex-1">
                    <input type="text" defaultValue={c} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-primary" />
                  </div>
                  <input type="number" defaultValue={25} className="w-20 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-primary text-center" />
                  <span className="text-gray-400 text-sm">%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-red-primary">Step 5: Assign Team</h3>
            <p className="text-sm text-gray-500">Assign event coordinators and volunteers to this event.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-4 card p-4">
                  <img src={`https://picsum.photos/seed/team${i}/100/100`} className="w-10 h-10 rounded-full" alt="" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">Team Member {i}</p>
                    <p className="text-[10px] text-gray-500">Event Coordinator</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-red-primary" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="btn-secondary py-2 px-8 disabled:opacity-30"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (step < 5) setStep(s => s + 1);
              else alert('Event Published Successfully!');
            }}
            className="btn-primary py-2 px-10"
          >
            {step === 5 ? 'Publish Event' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MY TEAM TAB ---
function MyTeamTab() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <p className="text-3xl font-mono font-bold text-red-primary">08</p>
          <p className="text-[10px] font-bold uppercase text-gray-400">Event Coordinators</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-3xl font-mono font-bold text-red-primary">05</p>
          <p className="text-[10px] font-bold uppercase text-gray-400">Evaluators</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-3xl font-mono font-bold text-red-primary">15</p>
          <p className="text-[10px] font-bold uppercase text-gray-400">Volunteers</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold">Team Directory</h3>
        <button className="btn-primary py-2 px-4 text-xs flex items-center gap-2"><UserPlus size={16} /> Add Member</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Member</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Role</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Assigned Event</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/team${i}/40/40`} className="w-8 h-8 rounded-full" alt="" />
                    <div>
                      <p className="text-sm font-bold">Team Member {i}</p>
                      <p className="text-[10px] text-gray-500">member{i}@college.edu</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold uppercase">Volunteer</span>
                </td>
                <td className="px-6 py-4 text-xs font-medium">Code Rush Hackathon</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold uppercase">Active</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-red-primary"><Mail size={16} /></button>
                    <button className="p-2 text-gray-400 hover:text-red-primary"><Edit size={16} /></button>
                    <button className="p-2 text-gray-400 hover:text-red-primary"><Trash2 size={16} /></button>
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

// --- ATTENDANCE TAB ---
function AttendanceTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold">Attendance Tracking</h3>
        <div className="flex gap-3">
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs font-bold outline-none focus:border-red-primary">
            <option>Select Event</option>
            <option>Code Rush Hackathon</option>
            <option>AI Summit</option>
          </select>
          <button className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"><Download size={16} /> Export CSV</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Student</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Roll No</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Check-in</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <tr key={i} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://picsum.photos/seed/stu${i}/40/40`} className="w-8 h-8 rounded-full" alt="" />
                      <p className="text-sm font-bold">Student Name {i}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">21B0300{i}</td>
                  <td className="px-6 py-4 text-xs">09:1{i} AM</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold uppercase">Present</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card p-6">
          <h4 className="text-sm font-bold uppercase text-gray-400 mb-6 tracking-widest">Attendance Breakdown</h4>
          <div className="h-64 flex justify-center">
            <Pie 
              data={{
                labels: ['Present', 'Absent', 'Late'],
                datasets: [{
                  data: [198, 42, 12],
                  backgroundColor: ['#16a34a', '#f40000', '#d97706'],
                  borderWidth: 0
                }]
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total Registered</span>
              <span className="font-bold">252</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Avg Duration</span>
              <span className="font-bold">6h 12m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ANNOUNCEMENTS TAB ---
function AnnouncementsTab() {
  const [selectedAudience, setSelectedAudience] = useState('All');
  const [targetEvent, setTargetEvent] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleBroadcast = () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in Subject and Message.');
      return;
    }
    const eventName = targetEvent === 'all' ? 'All My Events' : UniGuildData.events.find(e => e.id === targetEvent)?.name || 'Unknown';
    alert(`Announcement sent to: ${selectedAudience} • Event: ${eventName}`);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="card p-8">
        <h3 className="text-2xl font-display font-bold mb-6">Send Announcement</h3>
        <div className="space-y-6">
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
              {['All', 'Coordinators', 'Participants', 'Volunteers'].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedAudience(t)}
                  className={`flex-1 py-2 border rounded-lg text-[10px] font-bold uppercase transition-all ${
                    selectedAudience === t ? 'border-red-primary text-red-primary bg-red-50' : 'border-gray-200 hover:border-red-primary hover:text-red-primary'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Subject</label>
            <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Message</label>
            <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-primary h-32 resize-none" value={message} onChange={e => setMessage(e.target.value)} />
            <div className="flex justify-end mt-1 text-[10px] text-gray-400">{message.length} / 500 characters</div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleBroadcast} className="btn-primary px-10">Broadcast Message</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ANALYTICS TAB ---
function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold">Event Analytics</h3>
        <button className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"><Download size={16} /> Download PDF Report</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h4 className="text-sm font-bold uppercase text-gray-400 mb-6 tracking-widest">Registration Rate</h4>
          <div className="h-80">
            <Line 
              data={{
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                datasets: [{
                  label: 'Registrations',
                  data: [12, 45, 89, 156, 210, 342, 423],
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
        <div className="card p-6">
          <h4 className="text-sm font-bold uppercase text-gray-400 mb-6 tracking-widest">Feedback Score</h4>
          <div className="h-80 flex flex-col justify-center items-center">
            <div className="text-6xl font-mono font-bold text-red-primary">4.8</div>
            <div className="flex gap-1 text-red-primary mt-2">
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star-half-stroke" />
            </div>
            <p className="text-xs text-gray-400 mt-4 uppercase font-bold tracking-widest">Avg Participant Rating</p>
          </div>
        </div>
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
                <p className="text-lg font-mono font-bold">42</p>
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
function ProfileTab() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
          <div className="relative w-32 h-32">
            <img src="https://picsum.photos/seed/coordinator/200/200" className="w-full h-full rounded-full border-4 border-red-primary p-1" alt="" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-display font-bold">Dr. Ramesh Kumar</h3>
            <p className="text-gray-500 font-medium">Head Coordinator • IIT Bombay</p>
            <div className="flex gap-2 mt-4">
              <span className="bg-red-50 text-red-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase">Computer Science</span>
              <span className="bg-red-50 text-red-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase">12 Years Exp</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="text-xl font-display font-bold border-b border-gray-100 pb-2">Personal Info</h4>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Designation</label>
                <p className="text-sm font-bold">Associate Professor</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Staff ID</label>
                <p className="text-sm font-bold">IITB-CS-2014-045</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Work Email</label>
                <p className="text-sm font-bold">ramesh.k@iitb.ac.in</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-xl font-display font-bold border-b border-gray-100 pb-2">Security</h4>
            <button className="btn-secondary w-full py-2 text-sm">Change Password</button>
            <button className="w-full bg-gray-100 text-gray-600 font-bold py-2 rounded-lg text-sm hover:bg-gray-200">Enable 2FA</button>
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

  React.useEffect(() => {
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
        certificateUrl: 'https://example.com/certificate-template.pdf',
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function XCircle({ size }: { size: number }) {
  return <i className="fa-solid fa-circle-xmark" style={{ fontSize: size }} />;
}
