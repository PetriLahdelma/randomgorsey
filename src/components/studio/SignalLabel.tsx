import styles from "./SignalLabel.module.css";

/** A decorative, self-contained label for the signal artwork. */
export function SignalLabel() {
  return (
    <span className={styles.label}>
      <span>Stable azimuth</span>
      <span className={styles.equalizer} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
    </span>
  );
}
