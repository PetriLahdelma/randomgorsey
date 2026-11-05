import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface StudioPageHeaderProps {
  kicker: ReactNode;
  title: ReactNode;
  lead: ReactNode;
  className?: string;
  leadClassName?: string;
}

export function StudioPageHeader({
  kicker,
  title,
  lead,
  className,
  leadClassName,
}: StudioPageHeaderProps) {
  return (
    <header className={cn("studioPageHeader", className)}>
      <p className="studioKicker">{kicker}</p>
      <h1 className="studioTitle">{title}</h1>
      <p className={cn("studioLead", leadClassName)}>{lead}</p>
    </header>
  );
}
