
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, Lock, ArrowRight, Github, 
  Chrome, Zap, AlertCircle, Eye, EyeOff 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
  };

  const login = (selectedRole: string) => {
    switch (selectedRole) {
      case 'student': navigate('/dashboard/student'); break;
      case 'superadmin': navigate('/dashboard/superadmin'); break;
      case 'headcoordinator': navigate('/dashboard/headcoordinator'); break;
      case 'eventcoordinator': navigate('/dashboard/eventcoordinator'); break;
      case 'evaluator': navigate('/dashboard/evaluator'); break;
      case 'volunteer': navigate('/dashboard/volunteer'); break;
      default: navigate('/dashboard/student');
    }
  };

  const demoCredentials = [
    { role: 'student', label: 'Student', email: 'student@uniguild.edu', icon: '🎓' },
    { role: 'volunteer', label: 'Volunteer', email: 'vol@uniguild.edu', icon: '🤝' },
    { role: 'eventcoordinator', label: 'Event Coord', email: 'event@uniguild.edu', icon: '📅' },
    { role: 'headcoordinator', label: 'Head Coord', email: 'head@uniguild.edu', icon: '👑' },
    { role: 'evaluator', label: 'Evaluator', email: 'eval@uniguild.edu', icon: '⚖️' },
    { role: 'superadmin', label: 'Super Admin', email: 'admin@uniguild.edu', icon: '🛡️' },
  ];

  const handleDemoLogin = (cred: typeof demoCredentials[0]) => {
    setRole(cred.role);
    setEmail(cred.email);
    setPassword('demo123');
    // Visual feedback before redirect
    const btn = document.getElementById(`demo-${cred.role}`);
    if (btn) btn.classList.add('scale-95', 'bg-red-primary', 'text-white');
    setTimeout(() => login(cred.role), 800);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding & Visual */}
      <div className="hidden lg:flex bg-gray-50 relative overflow-hidden flex-col justify-between p-12 text-gray-900 border-r border-gray-100">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-20">
            <div className="w-10 h-10 bg-red-primary rounded-xl flex items-center justify-center text-white font-display font-bold text-2xl">U</div>
            <span className="font-display font-bold text-2xl tracking-tight">UniGuild</span>
          </Link>
          <h1 className="text-8xl font-display font-bold leading-[0.85] mb-8">
            Welcome <br />
            <span className="text-red-primary">Back.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-md">
            Your gateway to university events, professional growth, and campus collaboration.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-primary flex items-center justify-center text-white">
              <Zap size={24} />
            </div>
            <div>
              <p className="font-bold">50,000+ Students</p>
              <p className="text-xs text-gray-500">Already joined the ecosystem</p>
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-primary/10 rounded-full blur-[80px]" />
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-display font-bold mb-2">Login to Account</h2>
            <p className="text-gray-500">Enter your credentials to access your dashboard.</p>
          </div>

          <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-red-primary uppercase tracking-[0.2em]">Instant Demo Access</p>
              <span className="text-[8px] font-bold text-gray-400 uppercase">Pass: demo123</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoCredentials.map(cred => (
                <button
                  key={cred.role}
                  id={`demo-${cred.role}`}
                  onClick={() => handleDemoLogin(cred)}
                  className="group flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-xl hover:border-red-primary hover:shadow-md transition-all text-left"
                >
                  <span className="text-xl">{cred.icon}</span>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-tight text-gray-900 leading-none mb-0.5">{cred.label}</p>
                    <p className="text-[8px] text-gray-400 font-mono truncate">{cred.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-3 tracking-widest">Select Your Role</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
                {[
                  { label: 'Student', val: 'student' },
                  { label: 'Volunteer', val: 'volunteer' },
                  { label: 'Event Coord', val: 'eventcoordinator' },
                  { label: 'Head Coord', val: 'headcoordinator' },
                  { label: 'Evaluator', val: 'evaluator' },
                  { label: 'Super Admin', val: 'superadmin' }
                ].map(r => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => setRole(r.val)}
                    className={`py-2 text-[9px] font-bold uppercase rounded-lg transition-all ${
                      role === r.val ? 'bg-white text-red-primary shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-primary focus:bg-white transition-all" 
                    placeholder="name@university.edu" 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block tracking-widest">Password</label>
                  <a href="#" className="text-[10px] font-bold text-red-primary uppercase hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-primary focus:bg-white transition-all" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-primary"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 accent-red-primary rounded" id="remember" />
              <label htmlFor="remember" className="text-sm text-gray-600 font-medium">Remember me for 30 days</label>
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3">
              Sign In <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-400"><span className="bg-white px-4">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm">
                <Chrome size={18} /> Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm">
                <Github size={18} /> GitHub
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-red-primary font-bold hover:underline">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
