import Link from "next/link";

import { StudioWindow } from "@/components/studio/StudioWindow";

import styles from "./NotFound.module.css";

const NotFound = () => (
  <div className={`studioPage ${styles.page}`}>
    <StudioWindow title="random-gorsey / error" tone="paper" className={styles.window}>
      <div className={styles.content}>
        <p className={styles.code}>404</p>
        <h1>Signal Not Found</h1>
        <p>The requested address does not exist in this archive.</p>
        <nav aria-label="Error recovery" className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/listen/">Listen</Link>
          <Link href="/contact/">Contact</Link>
        </nav>
      </div>
    </StudioWindow>
  </div>
);

export default NotFound;
