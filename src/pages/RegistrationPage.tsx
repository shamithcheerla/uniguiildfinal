
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Lock, School, 
  ArrowRight, ArrowLeft, CheckCircle2, 
  Shield, Zap, Globe, Star
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding & Visual */}
      <div className="hidden lg:flex bg-black relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-20">
            <div className="w-10 h-10 bg-red-primary rounded-xl flex items-center justify-center text-white font-display font-bold text-2xl">U</div>
            <span className="font-display font-bold text-2xl tracking-tight">UniGuild</span>
          </Link>
          <h1 className="text-8xl font-display font-bold leading-[0.85] mb-8">
            Start Your <br />
            <span className="text-red-primary italic">Journey.</span>
          </h1>
          <p className="text-xl opacity-60 max-w-md">
            Join the most powerful university ecosystem. Connect with peers, manage events, and grow your career.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {[
            { icon: <Zap size={18} />, text: 'Access to 100+ Campus Events' },
            { icon: <Shield size={18} />, text: 'Verified Internship Sentinel' },
            { icon: <Globe size={18} />, text: 'Global Networking Opportunities' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-red-primary/20 flex items-center justify-center text-red-primary">
                {item.icon}
              </div>
              <span className="text-sm font-bold opacity-80">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Decorative Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-primary/10 rounded-full blur-[120px]" />
      </div>

      {/* Right: Registration Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-12">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-red-primary' : 'bg-gray-100'}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-display font-bold mb-2">Personal Details</h2>
                  <p className="text-gray-500">Let's start with your basic information.</p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-widest">First Name</label>
                      <input type="text" className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-primary focus:bg-white transition-all" placeholder="John" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-widest">Last Name</label>
                      <input type="text" className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-primary focus:bg-white transition-all" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="email" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-primary focus:bg-white transition-all" placeholder="name@university.edu" />
                    </div>
                  </div>
                </div>
                <button onClick={nextStep} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3">
                  Next Step <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-display font-bold mb-2">Academic Info</h2>
                  <p className="text-gray-500">Tell us about your college and course.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-widest">Select College</label>
                    <div className="relative">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-primary focus:bg-white transition-all appearance-none">
                        <option>Sasi Institute of Technology</option>
                        <option>BITS Pilani</option>
                        <option>IIT Madras</option>
                        <option>SRM University</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-widest">Department</label>
                      <input type="text" className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-primary focus:bg-white transition-all" placeholder="CSE" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-widest">Year of Study</label>
                      <select className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-primary focus:bg-white transition-all">
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={prevStep} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button onClick={nextStep} className="flex-[2] btn-primary py-4 text-lg flex items-center justify-center gap-3">
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-display font-bold mb-2">Security</h2>
                  <p className="text-gray-500">Secure your account with a strong password.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="password" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-primary focus:bg-white transition-all" placeholder="••••••••" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-widest">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="password" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-primary focus:bg-white transition-all" placeholder="••••••••" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-4 h-4 accent-red-primary rounded" id="terms" />
                  <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                    I agree to the <a href="#" className="text-red-primary font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-red-primary font-bold hover:underline">Privacy Policy</a>.
                  </label>
                </div>
                <div className="flex gap-4">
                  <button onClick={prevStep} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button onClick={() => navigate('/dashboard/student')} className="flex-[2] btn-primary py-4 text-lg flex items-center justify-center gap-3">
                    Complete <CheckCircle2 size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-red-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
