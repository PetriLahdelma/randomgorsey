"use client";
import { useEffect, useRef } from "react";
import { usePerformance } from "@/lib/performance";
import styles from "./SignalArtwork.module.css";

function drawWaveMesh(ctx: CanvasRenderingContext2D, width: number, height: number, phase: number) {
  const scale = Math.min(width, height);
  const project = (x: number, depth: number) => {
    const wave = Math.sin(x*6 + depth*3 - phase)*0.15
      + Math.sin(depth*8 - x*2 + phase*1.4)*0.08;
    return {
      x: width*0.5 + (x - depth*0.55)*scale*0.31,
      y: height*0.49 + (x*0.17 + depth*0.33 - wave)*scale*0.55,
    };
  };
  ctx.lineWidth = Math.max(0.8, scale/650);
  ctx.strokeStyle = "#17200c";
  for (let axis = 0; axis < 2; axis++) {
    for (let line = 0; line <= 28; line++) {
      const fixed = line/14 - 1;
      ctx.beginPath();
      for (let point = 0; point <= 80; point++) {
        const variable = point/40 - 1;
        const position = axis === 0 ? project(variable, fixed) : project(fixed, variable);
        if (point === 0) ctx.moveTo(position.x, position.y);
        else ctx.lineTo(position.x, position.y);
      }
      ctx.stroke();
    }
  }
}

export function SignalArtwork({className="",active=true,pace="calm"}:{className?:string;active?:boolean;pace?:"calm" | "energetic"}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { effectsEnabled, isReducedMotion } = usePerformance();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let visible = false;
    let lastDraw = 0;
    const draw = (time:number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      if (canvas.width !== Math.round(width*ratio) || canvas.height !== Math.round(height*ratio)) {
        canvas.width = Math.round(width*ratio); canvas.height = Math.round(height*ratio);
      }
      ctx.setTransform(ratio,0,0,ratio,0,0);
      ctx.fillStyle = "#d7ff44"; ctx.fillRect(0,0,width,height);
      if (pace === "energetic") {
        drawWaveMesh(ctx, width, height, time*0.0012);
        return;
      }
      const scale = Math.min(width,height);
      const phase = time * 0.00012;
      ctx.lineWidth = Math.max(0.8,scale/650);
      ctx.strokeStyle = "#17200c";
      for (let line=0;line<91;line++) {
        const latitude = (line/90 - 0.5)*Math.PI;
        ctx.beginPath();
        for (let point=0;point<=140;point++) {
          const angle = point/140*Math.PI*2;
          const band = Math.sin(latitude);
          const warp = Math.sin(angle*3 + band*4 + phase)*0.045 + Math.cos(angle*7-phase)*0.016;
          const radius = (0.33 + warp)*Math.cos(latitude);
          const x = width*0.5 + (Math.cos(angle)*radius + band*0.08)*scale;
          const y = height*0.48 + (Math.sin(angle)*radius*0.82 + band*0.29)*scale;
          if (point===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
    };
    const running = () => Boolean(effectsEnabled && !isReducedMotion && active && visible && !document.hidden);
    const tick = (time:number) => {
      if (!running()) { frame=0; return; }
      if (time-lastDraw>42) { draw(time); lastDraw=time; }
      frame=requestAnimationFrame(tick);
    };
    const sync = () => {
      if (frame) cancelAnimationFrame(frame);
      frame=0;
      if (running()) frame=requestAnimationFrame(tick);
      else draw(0);
    };
    const observer = new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:0.05});
    observer.observe(canvas);
    const resize = new ResizeObserver(()=>{if (!running()) draw(0);});
    resize.observe(canvas);
    document.addEventListener("visibilitychange",sync);
    draw(0);
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();document.removeEventListener("visibilitychange",sync);};
  },[effectsEnabled,isReducedMotion,active,pace]);
  return <div className={styles.artwork+" "+className} data-motion={effectsEnabled && !isReducedMotion && active ? "active" : "static"} data-pace={pace} aria-hidden="true">
    <svg className={styles.fallback} viewBox="0 0 600 600"><rect width="600" height="600" fill="#d7ff44"/>{Array.from({length:28},(_,i)=><ellipse key={i} cx="300" cy="290" rx={150+i*2} ry={20+i*7} fill="none" stroke="#17200c" transform={"rotate("+(i-14)*2+" 300 290)"}/>)}</svg>
    <canvas ref={canvasRef} className={styles.canvas}/>
    <div className={styles.corners}><i/><i/><i/><i/></div>
  </div>;
}
