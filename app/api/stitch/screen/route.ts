import { NextRequest, NextResponse } from "next/server";
import { getStitch } from "@/lib/stitch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const screenId = searchParams.get("screenId");

    if (!projectId || !screenId) {
      return NextResponse.json(
        { success: false, error: "Missing projectId or screenId" },
        { status: 400 }
      );
    }

    const stitch = getStitch();
    const project = stitch.project(projectId);
    const screen = await project.getScreen(screenId);

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
    console.error("[STITCH SCREEN] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
