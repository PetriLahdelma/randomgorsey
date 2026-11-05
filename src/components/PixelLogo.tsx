import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PixelLogo({ className }: { className?: string }) {
  return <Link href="/" className={cn("studioWordmark", className)} aria-label="Random Gorsey — Home">Random Gorsey</Link>;
}
