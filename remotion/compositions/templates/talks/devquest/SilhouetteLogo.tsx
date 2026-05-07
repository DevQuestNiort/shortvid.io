import React from "react";
import {
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SHORTVID_COLORS } from "../../../../theme";

export const SilhouetteLogo: React.FC<{
  logoUrl: string;
}> = ({ logoUrl }) => {
  const frame = useCurrentFrame();

  const conv: Record<string, string> = {
    "Méthodo & Architecture": "/branding/architecture.png",
    "Cloud & DevSecOps": "/branding/cloud.png",
    "Quêtes Secondaires": "/branding/secondaires.png",
    Frontend: "/branding/front-end.png",
    Backend: "/branding/back-end.png",
    "Design & UX": "/branding/design.png",
  };

  const opacity = interpolate(frame, [40, 100], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  return (
    <Img
      src={staticFile(conv[logoUrl])}
      style={{
        position: "absolute",
        zIndex: 10,
        top: "450px",
        right: "-50px",
        background: SHORTVID_COLORS.light,
        width: "100px",
        height: "100px",
        borderRadius: "100%",
        opacity,
      }}
    />
  );
};
