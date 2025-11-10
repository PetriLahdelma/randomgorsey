import React from "react";
import styles from "./Heading.module.css";
import { BaseComponentProps } from "../../types/common";

type HeadingTone = "light" | "dark" | "accent";
type HeadingAlign = "left" | "center" | "right";
type HeadingWeight = "regular" | "medium" | "bold";

const DEFAULT_HEADING_TAG = "h2";

type HeadingOwnProps = BaseComponentProps & {
  /** HTML tag to render */
  as?: React.ElementType;
  /** Visual level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Tone determines text color */
  tone?: HeadingTone;
  /** Text alignment */
  align?: HeadingAlign;
  /** Weight overrides */
  weight?: HeadingWeight;
  /** Force uppercase (default true) */
  uppercase?: boolean;
  /** Heading content */
  children?: React.ReactNode;
};

type PolymorphicProps<T extends React.ElementType, P> = P &
  Omit<React.ComponentPropsWithoutRef<T>, keyof P>;

export type HeadingProps<
  T extends React.ElementType = typeof DEFAULT_HEADING_TAG,
> = PolymorphicProps<T, HeadingOwnProps>;

const Heading = <T extends React.ElementType = typeof DEFAULT_HEADING_TAG>({
  as,
  level = 2,
  tone = "dark",
  align = "left",
  weight = "bold",
  uppercase = true,
  className,
  style,
  children,
  testId,
  ...rest
}: HeadingProps<T>) => {
  const Component =
    (as as React.ElementType) || (`h${level}` as React.ElementType);
  const classes = [
    styles.heading,
    styles[`level-${level}`],
    styles[`tone-${tone}`],
    styles[`align-${align}`],
    styles[`weight-${weight}`],
    uppercase ? styles.uppercase : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} style={style} data-testid={testId} {...rest}>
      {children}
    </Component>
  );
};

export default Heading;
