import type { Meta, StoryObj } from "@storybook/react";
import { PlayerProvider, usePersistentPlayer } from "@/components/player/PersistentPlayer";

function PlayerControls() {
  const player = usePersistentPlayer();
  return (
    <main style={{ minHeight: "70vh", maxWidth: 720, margin: "0 auto" }}>
      <p className="studioKicker">Sitewide external playback</p>
      <h1 className="studioTitle">Player states</h1>
      <p className="studioLead">
        A provider loads only after an explicit action. Minimize, expand and
        close operate on the same persistent frame.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <button className="studioButton" type="button" onClick={(event) => player.loadProvider("spotify", event.currentTarget)}>
          Load Spotify player
        </button>
        <button className="studioButton" type="button" onClick={(event) => player.loadProvider("soundcloud", event.currentTarget)}>
          Load SoundCloud player
        </button>
      </div>
      <p className="studioMeta" style={{ marginTop: 24 }}>
        Provider: {player.activeProvider ?? "none"} · status: {player.status} · presentation: {player.presentation}
      </p>
    </main>
  );
}

function PlayerStory() {
  return <PlayerProvider><PlayerControls /></PlayerProvider>;
}

const meta = {
  title: "Production/Player/SitewidePlayer",
  component: PlayerStory,
  parameters: {
    layout: "padded",
    nextjs: { navigation: { pathname: "/about/" } },
    docs: {
      description: {
        component: "The actual route-persistent player provider and controls. No third-party iframe is created until a source button is pressed.",
      },
    },
  },
} satisfies Meta<typeof PlayerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractiveLifecycle: Story = {};

export const MobileLifecycle: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
};
