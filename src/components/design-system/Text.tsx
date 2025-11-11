import React from "react";
import styles from "./Text.module.css";
import { BaseComponentProps } from "../../types/common";

type TextVariant = "body" | "bodySmall" | "caption" | "eyebrow";
type TextTone = "default" | "muted" | "contrast" | "accent";
type TextAlign = "left" | "center" | "right";
type TextWeight = "regular" | "medium" | "bold";

const DEFAULT_TEXT_TAG = "p";

type TextOwnProps = BaseComponentProps & {
  as?: React.ElementType;
  variant?: TextVariant;
  tone?: TextTone;
  align?: TextAlign;
  weight?: TextWeight;
  uppercase?: boolean;
  children?: React.ReactNode;
};

type PolymorphicProps<T extends React.ElementType, P> = P &
  Omit<React.ComponentPropsWithoutRef<T>, keyof P> & {
    // Allow time-specific attributes when T is 'time'
    dateTime?: T extends 'time' ? string : never;
  };

export type TextProps<
  T extends React.ElementType = typeof DEFAULT_TEXT_TAG,
> = PolymorphicProps<T, TextOwnProps>;

const Text = <T extends React.ElementType = typeof DEFAULT_TEXT_TAG>({
  as,
  variant = "body",
  tone = "default",
  align = "left",
  weight = "regular",
  uppercase = false,
  className,
  style,
  children,
  testId,
  ...rest
}: TextProps<T>) => {
  const Component = (as || DEFAULT_TEXT_TAG) as React.ElementType;
  
  // Convert camelCase variant to kebab-case for CSS class
  const getVariantClass = (variant: string) => {
    return variant === 'bodySmall' ? 'variant-body-small' : `variant-${variant}`;
  };
  
  const classes = [
    styles.text,
    styles[getVariantClass(variant)],
    styles[`tone-${tone}`],
    styles[`align-${align}`],
    styles[`weight-${weight}`],
    uppercase ? styles.uppercase : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      className={classes}
      style={style}
      data-testid={testId}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Text;
