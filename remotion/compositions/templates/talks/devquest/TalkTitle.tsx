import React from "react";
import { loadFont } from "@remotion/google-fonts/Teko";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { Title } from "../../../../design/atoms/Title";

const { fontFamily } = loadFont();

export const TalkTitle: React.FC<{
  title: string;
  style?: React.CSSProperties;
  delay?: number;
}> = ({ title, style, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 60,
  });

  const titleDeblur = interpolate(frame - delay, [0, 20], [5, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <Title
      style={{
        fontFamily,
        fontSize: "3.8rem",
        position: "absolute",
        bottom: "180px",
        opacity: titleOpacity,
        textWrap: "balance",
        filter: `blur(${titleDeblur}px)`,
        textShadow: `0px 0px 3px black`,
        ...style,
      }}
    >
      {title}
    </Title>
  );
};
