import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthInput } from '../components/auth/AuthInput';
import { Loader2, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../components/ui/utils';

export function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      navigate('/game');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    // Simulate google login
  };

  const handleGuestLogin = () => {
    navigate('/game');
  };

  // Stagger animation variants for form elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <AuthLayout title="Log in to your account">
      <motion.form 
        onSubmit={handleLogin} 
        className="w-full flex flex-col gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <AuthInput 
            label="Username or Email"
            placeholder="Enter your credentials" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-slate-200"
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
          <AuthInput 
            label="Password"
            type="password" 
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-slate-200"
          />
          <div className="flex justify-between items-center text-xs px-1 mt-1">
            <Link 
              to="/forgot-password" 
              className="text-slate-500 hover:text-cyan-400 transition-colors font-medium tracking-wide"
            >
              Forgot Password?
            </Link>
            <Link 
              to="/signup" 
              className="text-slate-500 hover:text-cyan-400 transition-colors font-medium tracking-wide"
            >
              Create Account
            </Link>
          </div>
        </motion.div>

        <motion.button 
          variants={itemVariants}
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "mt-4 w-full h-12 relative overflow-hidden rounded-md group",
            "bg-cyan-500/10 hover:bg-cyan-500/20",
            "border border-cyan-500/30 hover:border-cyan-400/50",
            "text-cyan-400 hover:text-cyan-300 font-bold tracking-widest uppercase text-sm",
            "shadow-[0_0_20px_-5px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.3)]",
            "transition-all duration-300 ease-out flex items-center justify-center gap-2"
          )}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span className="relative z-10">Log in</span>
              {/* Subtle sheen effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            </>
          )}
        </motion.button>

        <motion.div variants={itemVariants} className="flex flex-col gap-3 mt-4 pt-6 border-t border-slate-800/60 relative">
           {/* Divider label */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050810] px-2 text-[10px] text-slate-600 font-mono tracking-widest">
              OR CONTINUE WITH
           </div>

          <motion.button 
            type="button"
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full h-10 bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 font-medium text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-3 rounded-md group"
          >
            <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
              <span className="text-[10px] font-bold text-slate-300">G</span>
            </div>
            Google Account
          </motion.button>
          
          <motion.button 
            type="button"
            onClick={handleGuestLogin}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full h-10 bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 font-medium text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-3 rounded-md"
          >
            <User className="w-4 h-4 text-slate-500" />
            Guest Access
          </motion.button>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-slate-600 font-mono mt-2 text-[12px]">
          Guest sessions are not saved to the leaderboard database.
        </motion.p>
      </motion.form>
    </AuthLayout>
  );
}
