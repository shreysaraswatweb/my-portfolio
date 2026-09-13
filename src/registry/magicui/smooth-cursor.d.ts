import * as React from "react";

export interface SmoothCursorProps {
  cursor?: React.ReactNode;
  pointerCursor?: React.ReactNode;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
  showTrail?: boolean;
}

export declare function SmoothCursor(props: SmoothCursorProps): React.JSX.Element | null;

export default SmoothCursor;
