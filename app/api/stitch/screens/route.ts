import { NextRequest, NextResponse } from "next/server";
import { getStitch } from "@/lib/stitch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Missing projectId query parameter" },
        { status: 400 }
      );
    }

    const stitch = getStitch();
    const project = stitch.project(projectId);
    const screens = await project.screens();

    const data = await Promise.all(
      screens.map(async (screen) => {
        let imageUrl: string | null = null;
        let htmlUrl: string | null = null;
        try {
          imageUrl = await screen.getImage();
        } catch {
          imageUrl = null;
        }
        try {
          htmlUrl = await screen.getHtml();
        } catch {
          htmlUrl = null;
        }
        return {
          id: screen.id,
          screenId: screen.screenId,
          projectId: screen.projectId,
          imageUrl,
          htmlUrl,
        };
      })
    );

    return NextResponse.json({ success: true, screens: data });
  } catch (error) {
    console.error("[STITCH SCREENS] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
