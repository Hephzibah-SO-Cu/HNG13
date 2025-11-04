// types/global-jsx.d.ts
import * as React from "react";

declare global {
  namespace JSX {
    // Make JSX.Element resolve to React.ReactElement (no any)
    type Element = React.ReactElement | null;
    // Allow intrinsic elements for RN web fallback — keep permissive only for build-time resolution.
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
