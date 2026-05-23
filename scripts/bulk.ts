import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import program from "./devquest-2026-schedule.json";

const { sessions } = program;

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const compositionId = "DevQuest"; // l'id de ta <Composition>

await mkdir("../public/avatars", { recursive: true });

await Promise.all(
  sessions.map(async (entry) => {
    await Promise.all(
      entry.proposal
        ? entry.proposal.speakers.map(async (speaker) => {
            const dest = `../public/avatars/${speaker.id}.jpg`;
            try {
              const res = await fetch(speaker.picture);
              if (!res.ok) throw new Error(`${res.status}`);
              await Bun.write(dest, res); // ✅ Bun natif
              return {
                ...speaker,
                picture: `avatars/${speaker.id}.jpg`,
              }; // relatif à public/
            } catch (e) {
              console.warn(`⚠️ ${speaker.name} : image non téléchargée (${e})`);
              return speaker;
            }
          })
        : [],
    );
  }),
);

console.log("✅ Images téléchargées");

// 1. Bundle une seule fois (coûteux, ne pas répéter)
const bundleLocation = await bundle({
  entryPoint: "../remotion/index.tsx",
});

function stripEmojis(s: string): string {
  return s
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "")
    .replace(/\u200D/gu, "")
    .replace(/[\uFE00-\uFE0F]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// 2. Itérer séquentiellement (recommandé)
for (const session of sessions) {
  if (session.proposal) {
    const cleanTitle = stripEmojis(session.title);
    const entry = {
      title: session.title,
      speakers: session.proposal!.speakers.map((s) => {
        return {
          picture: existsSync(`../public/avatars/${s.id}.jpg`)
            ? `avatars/${s.id}.jpg`
            : `images/common/defaultAvatar.svg`,
          name: s.name,
        };
      }),
      start: session.start,
      track: session.track,
      categories: session.proposal!.categories,
    };
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: entry,
    });

    const d = new Date(new Date(entry.start).getTime() - 2 * 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: `out/${slugify(cleanTitle)}.mp4`,
      inputProps: entry,
      chromiumOptions: {
        disableWebSecurity: true, // ✅ désactive CORS/ORB
      },
    });
  }
}
