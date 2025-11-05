// assets/icons/CheckIcon.tsx
import * as React from "react";
// --- FIX: Import SvgProps from react-native-svg ---
import Svg, { Path, SvgProps } from "react-native-svg";

// --- FIX: Use SvgProps, not React.SVGProps ---
function CheckIcon(props: SvgProps) {
  return (
    <Svg width={11} height={9} fill="none" {...props}>
      <Path
        fill="#fff"
        stroke="#fff"
        strokeWidth={2}
        d="M1 4.304L3.696 7 10 1"
      />
    </Svg>
  );
}

export default CheckIcon;