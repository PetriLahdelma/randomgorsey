import React from 'react';
import { cn } from '@/lib/utils';

export type GroupLabelProps = {
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  style?: React.CSSProperties;
};

const GroupLabel: React.FC<GroupLabelProps> = ({ children, className, required, style }) => (
  <div
    className={cn(
      "block mb-2",
      "font-['Europa_Regular',sans-serif] text-[1.1rem] font-bold",
      "text-[#00f] uppercase tracking-[0.03em]",
      className
    )}
    style={style}
  >
    {children}
    {required && (
      <span className="ml-1 text-[1em] text-[#d32f2f]">*</span>
    )}
  </div>
);

export default GroupLabel;
