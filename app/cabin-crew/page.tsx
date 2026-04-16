import type { Metadata } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";
import CabinCrewPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Cabin Crew Training Bangalore | WindChasers Aviation Academy",
  description:
    "Launch your cabin crew career with WindChasers. Affordable training, mock flights, placement assistance, and direct airline connections.",
};

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const CABIN_CREW_VIMEO_EMBED =
  "https://player.vimeo.com/video/1183684229?autoplay=1&muted=1&controls=0&badge=0&byline=0&portrait=0&title=0&loop=1&background=1";

async function getCabinCrewAssets() {
  const publicDir = path.join(process.cwd(), "public");
  const directories = ["cabin-crew", "cabin crew"];

  for (const directory of directories) {
    const absoluteDirectory = path.join(publicDir, directory);

    try {
      const files = await readdir(absoluteDirectory);
      const normalized = files.sort((a, b) => a.localeCompare(b));

      const videoFile = normalized.find((file) => file.toLowerCase().endsWith(".mp4"));
      const imageFiles = normalized.filter((file) =>
        IMAGE_EXTENSIONS.some((ext) => file.toLowerCase().endsWith(ext))
      );

      const encodedDirectory = directory.split("/").map(encodeURIComponent).join("/");
      const makeAssetUrl = (file: string) => `/${encodedDirectory}/${encodeURIComponent(file)}`;

      return {
        heroVideoSrc: videoFile ? makeAssetUrl(videoFile) : null,
        galleryImages: imageFiles.map((file) => makeAssetUrl(file)),
      };
    } catch {
      // Continue to next candidate directory.
    }
  }

  return {
    heroVideoSrc: null,
    galleryImages: [] as string[],
  };
}

export default async function CabinCrewPage() {
  const { heroVideoSrc, galleryImages } = await getCabinCrewAssets();

  return (
    <CabinCrewPageClient
      heroVideoSrc={heroVideoSrc}
      heroVideoEmbedSrc={CABIN_CREW_VIMEO_EMBED}
      galleryImages={galleryImages}
    />
  );
}
