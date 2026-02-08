import React from 'react';
import { ChevronRight, ChevronDown, Atom, Info } from 'lucide-react';

export const GlassCard = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`
      relative group overflow-hidden
      bg-[#141414]/60 backdrop-blur-xl
      border border-white/10 hover:border-[#00d4aa]/50
      rounded-2xl transition-all duration-300 ease-out
      hover:shadow-[0_0_30px_-10px_rgba(0,212,170,0.3)]
      hover:-translate-y-1
      ${className}
    `}
  >
    {children}
  </div>
);

export const Tag = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/5 text-gray-300 border border-white/5">
    {children}
  </span>
);

export const StatItem = ({ label, value, unit }) => (
  <div className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/5">
    <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-sm font-mono text-gray-200">{value ?? '—'}</span>
      {unit && <span className="text-[10px] text-gray-500">{unit}</span>}
    </div>
  </div>
);
