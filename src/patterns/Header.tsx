"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PixelLogo from "@/components/PixelLogo";

const links = [{href:"/listen/",label:"Listen"},{href:"/discography/",label:"Discography"},{href:"/#journal",label:"Journal"},{href:"/about/",label:"About"},{href:"/gallery/",label:"Gallery"},{href:"/contact/",label:"Contact"}];
export interface HeaderProps { className?: string; version: string }
export default function Header(props: HeaderProps) {
  const pathname = usePathname();
  return <HeaderNavigation key={pathname} {...props} pathname={pathname} />;
}

function HeaderNavigation({ className = "", pathname, version }: HeaderProps & { pathname: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  function closeMenu(event: React.KeyboardEvent) {
    if (event.key === "Escape" && open) { setOpen(false); menuRef.current?.focus(); }
  }
  return (
    <header className={"studioHeader " + className} onKeyDown={closeMenu}>
      <div className="studioHeaderBar">
        <span className="studioHeaderVersion" aria-label={`Site version ${version}`}>v{version}</span>
        <PixelLogo />
        <button ref={menuRef} className="studioMenuToggle" type="button" aria-expanded={open} aria-controls="studio-navigation" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? "Close" : "Menu"} <span aria-hidden="true">{open ? "−" : "+"}</span></button>
      </div>
      <nav id="studio-navigation" className={open ? "studioNav studioNavOpen" : "studioNav"} aria-label="Main navigation">
        {links.map(({href,label}) => <Link key={href} href={href} title={label === "Listen" ? "Listen to music" : label === "About" ? "About Random Gorsey" : label === "Contact" ? "Get in touch" : label === "Discography" ? "View releases" : label === "Gallery" ? "Photo gallery" : "Journal"} aria-current={href === pathname ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
      </nav>
    </header>
  );
}
