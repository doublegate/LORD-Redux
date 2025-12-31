
import React from 'react';

export const TerminalCard = ({ title, children, className = "" }: { title?: string, children: React.ReactNode, className?: string }) => (
  <div className={`border-2 border-slate-700 bg-lord-panel/90 p-5 md:p-7 rounded-sm shadow-2xl backdrop-blur-sm text-lg md:text-xl leading-relaxed ${className}`}>
    {title && (
      <div className="border-b-2 border-slate-700 pb-3 mb-6 flex items-center justify-between">
        <span className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-lord-amber text-shadow-sm">
          {title}
        </span>
        <div className="flex gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-slate-600"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-slate-600"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-slate-600"></div>
        </div>
      </div>
    )}
    {children}
  </div>
);

export const ActionButton = ({ onClick, label, hotkey, disabled = false, variant = 'normal' }: { onClick: () => void, label: string, hotkey?: string, disabled?: boolean, variant?: 'normal' | 'danger' | 'special' }) => {
  let colors = "border-slate-600 text-lord-green hover:bg-lord-green hover:text-lord-panel hover:border-lord-green";
  if (variant === 'danger') colors = "border-slate-600 text-lord-red hover:bg-lord-red hover:text-white hover:border-lord-red";
  if (variant === 'special') colors = "border-slate-600 text-lord-amber hover:bg-lord-amber hover:text-lord-panel hover:border-lord-amber";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative w-full border-2 rounded px-4 py-3 md:py-4 text-left font-mono text-lg md:text-xl uppercase transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${colors}`}
    >
      <span className="relative z-10 flex justify-between items-center">
        <span className="flex-1 truncate">
          {hotkey && <span className="font-black mr-3 bg-slate-800/50 px-2 py-0.5 rounded text-white group-hover:text-inherit inline-block min-w-[30px] text-center">[{hotkey}]</span>}
          <span className="tracking-wide font-bold">{label}</span>
        </span>
        <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all font-bold hidden sm:inline-block pl-2 whitespace-nowrap">
          &lt; SELECT &gt;
        </span>
      </span>
    </button>
  );
};

export const StatsRow = ({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) => (
  <div className={`flex justify-between border-b border-slate-700/50 py-2 font-mono text-lg md:text-xl ${highlight ? 'text-lord-amber font-bold' : 'text-lord-dim'}`}>
    <span>{label}</span>
    <span className={highlight ? '' : 'text-lord-text'}>{value}</span>
  </div>
);

export const ProgressBar = ({ current, max, color = "bg-lord-green" }: { current: number, max: number, color?: string }) => {
  const pct = Math.min(100, Math.max(0, (current / max) * 100));
  return (
    <div className="h-6 w-full border border-slate-600 bg-slate-900/50 rounded-sm overflow-hidden p-0.5">
      <div style={{ width: `${pct}%` }} className={`h-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-500 rounded-sm`} />
    </div>
  );
};
