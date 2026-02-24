import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthInput } from '../components/auth/AuthInput';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../components/ui/utils';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate reset
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } }
  };

  return (
    <AuthLayout title="RESET CLEARANCE" subtitle="ENTER SECURE CHANNEL">
      <motion.form 
        onSubmit={handleSubmit} 
        className="w-full flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={itemVariants} className="text-xs text-slate-500 font-medium leading-relaxed text-center px-4">
          Enter your registered email address. We will transmit a secure recovery link to reset your access key.
        </motion.p>

        <motion.div variants={itemVariants}>
          <AuthInput 
            label="Email Address"
            placeholder="user@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
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
                <span className="relative z-10">TRANSMIT RESET LINK</span>
                {/* Subtle sheen effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </>
            )}
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center mt-4">
          <Link 
            to="/login" 
            className="text-slate-500 hover:text-cyan-400 text-xs font-bold transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            RETURN TO LOGIN
          </Link>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
