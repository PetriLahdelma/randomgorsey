import Link from "next/link";
import { BrandMark } from "@/components/studio/BrandMark";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";
const links = [
  {label:"Spotify",href:"https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q?si=TCP19UlhTpyHb7w0UOukmg"},
  {label:"SoundCloud",href:"https://soundcloud.com/randomgorsey"},
  {label:"Bandcamp",href:"https://randomgorsey.bandcamp.com"},
  {label:"Instagram",href:"https://www.instagram.com/random_gorsey?igsh=am42eWcwNGdnY3hm&utm_source=qr"},
  {label:"YouTube",href:"https://www.youtube.com/@randomgorsey8125"}
];
export interface FooterProps { className?: string }
export default function Footer({className=""}:FooterProps) {
  return <footer className={"studioFooter "+className}>
    <div className="studioFooterTop"><Link href="/" className="studioFooterMark" aria-label="Random Gorsey — Home"><BrandMark /></Link><div className="studioFooterLinks">{links.map(link=><a key={link.label} href={link.href} aria-label={link.label} target="_blank" rel="noopener noreferrer"><span className="studioFooterLinkLabel">{link.label}</span><span aria-hidden="true">↗</span></a>)}</div></div>
    <div className="studioFooterBottom"><span>© {new Date().getFullYear()} Random Gorsey</span><Link href="/contact/"><span className="studioFooterLinkLabel">Contact</span><span aria-hidden="true">↗</span></Link><CookiePreferencesButton className="studioCookieButton"/><a href="#main-content"><span className="studioFooterLinkLabel">Back to top</span><span aria-hidden="true">↑</span></a></div>
  </footer>;
}
