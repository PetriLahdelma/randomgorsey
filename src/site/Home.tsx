"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Post } from "@/content/post-types";
import { releases } from "@/content/releases";
import PostCard from "@/components/PostCard";
import { StudioWindow } from "@/components/studio/StudioWindow";
import { SignalArtwork } from "@/components/studio/SignalArtwork";
import { SignalLabel } from "@/components/studio/SignalLabel";
import { BrandMark } from "@/components/studio/BrandMark";
import { saveHomeScroll, loadHomeScroll } from "@/lib/session-scroll";
import styles from "./Home.module.css";

const BATCH_SIZE=6;
type ArchiveEntry = Pick<Post, "id" | "title" | "timestamp" | "category">;
export default function Home({posts,archive,totalPosts}:{posts:Post[];archive:ArchiveEntry[];totalPosts:number}) {
  const [loadedPosts,setLoadedPosts]=useState(posts);
  const [loading,setLoading]=useState(false);
  const [loadError,setLoadError]=useState(false);
  const loadingRef=useRef(false);
  const router=useRouter();
  const [view,setView]=useState<"entries"|"index">("entries");
  const [category,setCategory]=useState("all");
  const restoration=useRef(false);
  const featured=posts[0];
  const release=releases[0];
  const categories=[...new Set(archive.flatMap(post=>post.category?[post.category]:[]))];
  const filtered=category==="all"?archive:archive.filter(post=>post.category===category);
  useEffect(()=>{
    const legacy=/^#post-(\d+)$/.exec(window.location.hash);
    if (legacy && archive.some(post=>post.id===Number(legacy[1]))) {
      router.replace("/posts/"+legacy[1]+"/");
      return;
    }
    if (window.location.hash) { restoration.current=true; return; }
    const saved=loadHomeScroll();
    if (saved) {
      const frame=requestAnimationFrame(()=>{window.scrollTo(0,saved.scrollY);restoration.current=true;});
      return ()=>cancelAnimationFrame(frame);
    }
    restoration.current=true;
  },[archive,router]);
  useEffect(()=>{
    const save=()=>{if(restoration.current)saveHomeScroll({scrollY:window.scrollY,expandedPosts:[]});};
    window.addEventListener("beforeunload",save);
    return ()=>{save();window.removeEventListener("beforeunload",save);};
  },[]);
  async function loadMore() {
    if (loadingRef.current) return;
    loadingRef.current=true;
    setLoading(true);
    setLoadError(false);
    try {
      const response=await fetch("/api/posts?offset="+loadedPosts.length+"&limit="+BATCH_SIZE);
      if (!response.ok) throw new Error("Archive request failed");
      const next=await response.json() as {posts:Post[];totalPosts:number};
      if (!Array.isArray(next.posts) || next.posts.length===0 || next.posts.some(post=>loadedPosts.some(loaded=>loaded.id===post.id))) throw new Error("Invalid archive page");
      setLoadedPosts(current=>[...current,...next.posts]);
    } catch {
      setLoadError(true);
    } finally {
      loadingRef.current=false;
      setLoading(false);
    }
  }
  return (
    <>
      <section className={styles.hero} aria-label="Random Gorsey">
        <div className={styles.heroIdentity}>
          <h1 className={styles.artistName}><span className="sr-only">Random Gorsey</span><BrandMark priority alt=""/></h1>
          <div className={styles.heroAction}>
            <Link href="/listen/" className={styles.listen}><span className={styles.playIcon} aria-hidden="true">▶</span>Listen<span aria-hidden="true">↗</span></Link>
            <span className={styles.heroNote}>Recordings &amp; selections</span>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.artworkTitle}><SignalLabel /><span aria-hidden="true">↙</span></div>
          <SignalArtwork className={styles.signal}/>
          <div className={styles.artworkFooter}><span>Random Gorsey</span></div>
        </div>
        <StudioWindow title="Selected recording" className={styles.recordWindow}>
          <Link href={"/discography/#"+release.id} className={styles.recordCover} aria-label={"View "+release.title}>
            <Image src={release.image} alt={release.title+" cover"} width={3000} height={3000} sizes="(max-width:650px) 38vw, 150px" priority/>
          </Link>
          <div className={styles.recordInfo}><span className="studioMeta">{release.catalog} · {release.year}</span><Link href={"/discography/#"+release.id}>{release.title}</Link><a href={release.bandcamp} target="_blank" rel="noopener noreferrer">Bandcamp <span aria-hidden="true">↗</span></a></div>
        </StudioWindow>
      </section>

      <section id="journal" className={styles.journal+" studioJournal"}>
        <div className={styles.journalHeader}><div><span className="studioKicker">Notes from the archive</span><h2>Journal<span className={styles.journalCount}>{totalPosts}</span></h2></div><div className={styles.viewSwitch} aria-label="Journal view"><button type="button" aria-pressed={view==="entries"} onClick={()=>setView("entries")}>Entries</button><button type="button" aria-pressed={view==="index"} onClick={()=>setView("index")}>Index</button></div></div>
        {view==="entries" ? <div className={styles.journalLayout}>
          <div>
            {featured&&<section aria-label="Featured post"><PostCard id={"post-"+featured.id} post={featured} headingLevel={3} truncateLength={Infinity} showFullContent/></section>}
            <section aria-label="All posts">{loadedPosts.slice(1).map(post=><PostCard id={"post-"+post.id} key={post.id} post={post} headingLevel={3}/>)}</section>
            {loadedPosts.length<totalPosts&&<button type="button" className="studioButton" aria-label="Load more posts" disabled={loading} onClick={loadMore}>{loading ? "Loading entries…" : "Load more"} <span aria-hidden="true">↓</span></button>}
            {loadError&&<p role="alert">More entries could not be loaded. Use Load more to try again, or browse the index.</p>}
          </div>
          <aside className={styles.journalAside}><span className="studioMeta">Collected entries</span><p>Studio notes,<br/>field recordings,<br/>things worth hearing.</p><button type="button" className="studioLink" onClick={()=>setView("index")}><span className={styles.journalLinkLabel}>Browse the index</span><span aria-hidden="true">↗</span></button></aside>
        </div> : <div className={styles.archive}>
          <label className={styles.filterLabel}>Category<select value={category} onChange={event=>setCategory(event.target.value)}><option value="all">All entries</option>{categories.map(value=><option key={value} value={value}>{value.replaceAll("-"," ")}</option>)}</select></label>
          <ol>{filtered.map(post=><li id={"post-"+post.id} key={post.id}><Link href={"/posts/"+post.id+"/"}><time dateTime={post.timestamp}>{post.timestamp.slice(0,10)}</time><span>{post.title}</span><span className={styles.archiveArrow} aria-hidden="true">↗</span></Link></li>)}</ol>
        </div>}
      </section>
    </>
  );
}
