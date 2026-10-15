import type { HTMLAttributes } from "react";
import type { SpringOptions } from "framer-motion";

export interface ScrollProgressProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  springOptions?: SpringOptions;
}

export declare const ScrollProgress: React.ForwardRefExoticComponent<
  ScrollProgressProps & React.RefAttributes<HTMLDivElement>
>;

export declare function ScrollProgressDemo(): React.JSX.Element;

export default ScrollProgress;
