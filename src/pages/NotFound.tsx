import React from "react";
import { motion, pageVariants } from "@/lib/motion";
import styles from "./NotFound.module.css";
import Spinner from "../components/Spinner";
import PageMeta from "../components/PageMeta";
import { isWebMSupported } from "../utils/isWebMSupported";
import { Link } from "react-router-dom";
import Button from "../components/Button";
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
      {/* Background looping video (disabled if WebM unsupported) */}
      {isWebMSupported() && (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source
            src={glitchBgVideo}
            type="video/webm"
          />
        </video>
      )}
      <motion.div
        className={styles["notfound-container"]}
        variants={pageVariants}
        initial="initial"
        animate="enter"
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
