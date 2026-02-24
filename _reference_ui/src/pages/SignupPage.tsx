import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthInput } from '../components/auth/AuthInput';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../components/ui/utils';

export function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate signup
    setTimeout(() => {
      setLoading(false);
      navigate('/game');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] } }
  };

  return (
    <AuthLayout title="CREATE NEW CLEARANCE">
      <motion.form 
        onSubmit={handleSubmit} 
        className="w-full flex flex-col gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <AuthInput 
            name="username"
            label="Agent ID (Username)"
            placeholder="Choose a username" 
            value={form.username}
            onChange={handleChange}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AuthInput 
            name="email"
            type="email"
            label="Secure Channel (Email)"
            placeholder="user@example.com" 
            value={form.email}
            onChange={handleChange}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <AuthInput 
            name="password"
            type="password" 
            label="Access Key"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
          />
          <AuthInput 
            name="confirmPassword"
            type="password" 
            label="Verify Key"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4">
          <motion.button 
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full h-12 relative overflow-hidden rounded-md group",
              "bg-cyan-500/10 hover:bg-cyan-500/20",
              "border border-cyan-500/30 hover:border-cyan-400/50",
              "text-cyan-400 hover:text-cyan-300 font-bold tracking-widest uppercase text-sm",
              "shadow-[0_0_20px_-5px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.3)]",
              "transition-all duration-300 ease-out flex items-center justify-center gap-2"
            )}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <span className="relative z-10">Create A</span>
                {/* Subtle sheen effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </>
            )}
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center mt-6">
          <span className="text-slate-500 text-xs font-medium tracking-wide">
            Already have clearance?{' '}
            <Link 
              to="/login" 
              className="text-cyan-500 hover:text-cyan-300 transition-colors ml-1 font-bold hover:underline decoration-cyan-500/30 underline-offset-4"
            >
              Log In
            </Link>
          </span>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
