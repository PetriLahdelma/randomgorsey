"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { COOKIE_PREFERENCES_EVENT } from "./CookieConsent";

export interface CookiePreferencesButtonProps {
  className?: string;
}

const CookiePreferencesButton: React.FC<CookiePreferencesButtonProps> = ({
  className,
}) => (
  <button
    type="button"
    className={cn("bg-transparent border-0 p-0 font-inherit cursor-pointer", className)}
    onClick={() => window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT))}
  >
    Cookie preferences
  </button>
);

export default CookiePreferencesButton;
