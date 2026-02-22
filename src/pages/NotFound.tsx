import React from "react";
import { motion, pageVariants } from "@/lib/motion";
import styles from "./NotFound.module.css";
import Spinner from "../components/Spinner";
import PageMeta from "../components/PageMeta";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { VideoBackground } from "@/components/effects";
import glitchBgVideo from "../videos/rg-glitch-bg.webm";

const NotFound: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = window.requestAnimationFrame(() => setLoading(false));
    return () => window.cancelAnimationFrame(timer);
  }, []);

  return (
    <>
      <PageMeta
        title="404 - Page Not Found"
        description="The page you requested could not be found."
        path="/"
      />
      {/* Performance-tiered video background */}
      <VideoBackground
        src={glitchBgVideo}
        poster="/images/listen-poster.jpg"
        overlayOpacity={0.3}
      />
      <motion.div
        className={styles["notfound-container"]}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {loading && <Spinner />}
        {!loading && (
          <h1 data-testid="not-found-title">404 - Page Not Found</h1>
        )}
        {!loading && (
          <p className={styles["notfound-description"]}>
            Sorry, the page you're looking for does not exist.😢
          </p>
        )}
        <div className={styles["notfound-footer"]}>
          <Link to="/">
            <Button
              className={styles["notfound-button"]}
              aria-label="Go to home page"
            >
              Go Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default NotFound;
