import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../ui/utils';
import { motion } from 'motion/react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="group flex flex-col gap-1.5 w-full relative">
        {label && (
          <label 
            className={cn(
              "text-xs font-semibold tracking-wide uppercase transition-colors duration-200 ml-1",
              isFocused ? "text-cyan-400" : "text-slate-500"
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative w-full">
          {/* Input container for styling */}
          <div 
            className={cn(
              "relative w-full rounded-lg transition-all duration-200 ease-out",
              // Background & Border Base
              "bg-slate-900/40 border border-slate-800/60 shadow-sm",
              // Hover State
              "group-hover:border-slate-700/80 group-hover:bg-slate-900/60",
              // Focus State (Glow & Highlight)
              isFocused && "border-cyan-500/50 shadow-[0_0_0_4px_rgba(6,182,212,0.1)] bg-slate-900/80",
              // Error State
              error && "border-red-500/50 focus-within:border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]"
            )}
          >
            <input
              ref={ref}
              type={inputType}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              className={cn(
                "w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 font-medium tracking-wide outline-none border-none ring-0 caret-cyan-400",
                "transition-opacity duration-200",
                className
              )}
              {...props}
            />

            {/* Password Toggle Button */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors p-1 rounded-md hover:bg-slate-800/50"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
          
          {/* Subtle bottom highlight line on focus */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0, opacity: isFocused ? 1 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none"
          />
        </div>

        {error && (
          <motion.span 
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 font-medium ml-1 flex items-center gap-1"
          >
            <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
            {error}
          </motion.span>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
