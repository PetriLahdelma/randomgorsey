import Image from "next/image";

export function BrandMark({ className = "", inverse = false, priority = false }: { className?: string; inverse?: boolean; priority?: boolean }) {
  return <Image src={inverse ? "/images/random-gorsey-logo-white.svg" : "/images/random-gorsey-logo.svg"} alt="Random Gorsey" width={1689} height={681} priority={priority} className={className} style={{display:"block",width:"100%",height:"auto"}}/>;
}
