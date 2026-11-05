import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PerformanceProvider } from "@/lib/performance";
import { SignalArtwork } from "@/components/studio/SignalArtwork";
import { StudioWindow } from "@/components/studio/StudioWindow";

function ArtworkControl({ active = true, pace = "calm" }: { active?: boolean; pace?: "calm" | "energetic" }) {
  const [playing,setPlaying] = useState(active);
  return <StudioWindow title="Signal study" actions={<button type="button" className="studioButton" aria-pressed={playing} onClick={()=>setPlaying(!playing)}>{playing ? "Pause artwork" : "Resume artwork"}</button>}>
    <div style={{height:400}}><SignalArtwork active={playing} pace={pace}/></div>
    <p className="studioMeta">Independent generative artwork. No audio analysis or autoplay.</p>
  </StudioWindow>;
}
function MotionLab(props:{active?:boolean;pace?:"calm" | "energetic"}) { return <PerformanceProvider><ArtworkControl {...props}/></PerformanceProvider>; }
const meta={title:"Effects/Motion Lab",component:MotionLab,parameters:{layout:"padded"}} satisfies Meta<typeof MotionLab>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Interactive:Story={args:{active:true}};
export const Energetic:Story={args:{active:true,pace:"energetic"}};
export const Dormant:Story={args:{active:false}};
export const Narrow:Story={args:{active:true},globals:{viewport:{value:"mobile",isRotated:false}}};
