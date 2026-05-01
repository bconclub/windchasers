import { NextRequest, NextResponse } from "next/server";
import { getStitch } from "@/lib/stitch";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, prompt, deviceType = "DESKTOP" } = body;

    if (!projectId || !prompt) {
      return NextResponse.json(
        { success: false, error: "Missing projectId or prompt" },
        { status: 400 }
      );
    }

    const validDeviceTypes = ["MOBILE", "DESKTOP", "TABLET", "AGNOSTIC"] as const;
    const resolvedDeviceType = validDeviceTypes.includes(deviceType)
      ? deviceType
      : "DESKTOP";

    const stitch = getStitch();
    const project = stitch.project(projectId);
    const screen = await project.generate(prompt, resolvedDeviceType);

    const [htmlUrl, imageUrl] = await Promise.all([
      screen.getHtml().catch(() => null),
      screen.getImage().catch(() => null),
    ]);

    return NextResponse.json({
      success: true,
      screen: {
        id: screen.id,
        screenId: screen.screenId,
        projectId: screen.projectId,
        htmlUrl,
        imageUrl,
      },
    });
  } catch (error) {
    console.error("[STITCH GENERATE] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
