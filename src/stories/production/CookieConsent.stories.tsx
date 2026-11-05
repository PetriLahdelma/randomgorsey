import type { Meta, StoryObj } from "@storybook/react";
import CookieConsent, { COOKIE_PREFERENCES_EVENT } from "@/components/CookieConsent";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

function CookiePreferencesStory() {
  return (
    <div style={{ minHeight: "70vh" }}>
      <p className="studioKicker">Consent state</p>
      <h1 className="studioTitle">Cookie preferences</h1>
      <button
        type="button"
        className="studioButton"
        onClick={() => window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT))}
      >
        Open cookie preferences
      </button>
      <CookiePreferencesButton className="studioCookieButton" />
      <CookieConsent />
    </div>
  );
}

const meta = {
  title: "Production/Privacy/CookiePreferences",
  component: CookiePreferencesStory,
  beforeEach: () => {
    document.cookie = "cookieConsent=; path=/; max-age=0; SameSite=Lax";
  },
} satisfies Meta<typeof CookiePreferencesStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstVisit: Story = {};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
};
