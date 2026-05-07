import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";

import { BigSpeakers } from "./BigSpeakers";
import { Details } from "./Details";
import { TalkTitle } from "./TalkTitle";
import { BackgroundFiller } from "../../../../design/atoms/BackgroundFiller";
import { SHORTVID_ASSET_PATHS } from "../../../../theme";

const SpeakerSchema = z.object({
  name: z.string(),
  picture: z.string(),
});

export const DevQuestSchema = z.object({
  title: z.string(),
  start: z.string(),
  track: z.string(),
  categories: z.array(z.string()),
  speakers: z.array(SpeakerSchema),
});

export const DevQuest: React.FC<z.infer<typeof DevQuestSchema>> = ({
  title,
  speakers,
  start,
  track,
  categories,
}) => {
  const frame = useCurrentFrame();
  const blur = interpolate(frame, [40, 45], [0, 20], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "white", overflow: "hidden" }}>
      <Sequence style={{ filter: `blur(${blur}px)` }}>
        <BackgroundFiller
          imageUrl={staticFile(SHORTVID_ASSET_PATHS.backgroundImg)}
        />
      </Sequence>
      <BigSpeakers speakers={speakers} categories={categories} dropTop={150} />
      <Sequence from={165}>
        <TalkTitle
          title={title}
          style={{
            bottom: "200px",
            padding: "0 60px",
          }}
        />
      </Sequence>
      <Sequence from={140}>
        <Details
          date={`${new Date(
            new Date(start).getTime() - 2 * 60 * 60 * 1000,
          ).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })} | ${track}`}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
