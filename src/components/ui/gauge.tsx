'use client';

import React from 'react';

interface GaugeProps {
  value: number; // 0 to 100
  title?: string;
  subtitle?: string;
  size?: number; // width/height in px
  strokeWidth?: number;
}

export const Gauge: React.FC<GaugeProps> = ({ 
  value, 
  title, 
  subtitle,
  size = 120, 
  strokeWidth = 10 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  // Color selection based on value
  const getColor = (val: number) => {
    if (val >= 85) return 'stroke-emerald-500';
    if (val >= 70) return 'stroke-teal-500';
    if (val >= 50) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  const getTextColor = (val: number) => {
    if (val >= 85) return 'text-emerald-400';
    if (val >= 70) return 'text-teal-400';
    if (val >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="flex flex-col items-center justify-center p-1 text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            className="stroke-slate-800"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className={`transition-all duration-1000 ease-out ${getColor(value)}`}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {/* Value text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-extrabold tracking-tight ${getTextColor(value)}`}>
            {value}
          </span>
          {subtitle && (
            <span className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {title && <h5 className="mt-2 text-xs font-semibold text-slate-300 tracking-wide">{title}</h5>}
    </div>
  );
};
export default Gauge;
