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
      "font-europa text-[1.1rem] font-bold",
      "text-blue-800 uppercase tracking-[0.03em]",
      className
    )}
    style={style}
  >
    {children}
    {required && (
      <span className="ml-1 text-[1em] text-destructive">*</span>
    )}
  </div>
);

export default GroupLabel;
