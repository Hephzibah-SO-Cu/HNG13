// assets/icons/CrossIcon.tsx
import * as React from "react";
// --- FIX: Import SvgProps from react-native-svg ---
import Svg, { Path, SvgProps } from "react-native-svg";
import { useTheme } from "@/context/ThemeContext";

// --- FIX: Use SvgProps, not React.SVGProps ---
function CrossIcon(props: SvgProps) {
  const { colors } = useTheme();
  return (
    <Svg width={18} height={18} fill="none" {...props}>
      <Path
        fill={colors.textSecondary}
        d="M17.678 0L18 0.322 10.322 8 18 15.678 17.678 16 10 8.322 2.322 16 2 15.678 9.678 8 2 0.322 2.322 0 10 7.678 17.678 0z"
      />
    </Svg>
  );
}

export default CrossIcon;