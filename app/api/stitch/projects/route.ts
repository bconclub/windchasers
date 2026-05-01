import { NextResponse } from "next/server";
import { getStitch } from "@/lib/stitch";

export const runtime = "nodejs";

export async function GET() {
  try {
    const stitch = getStitch();
    const projects = await stitch.projects();

    const data = projects.map((p) => ({
      id: p.id,
      projectId: p.projectId,
    }));

    return NextResponse.json({ success: true, projects: data });
  } catch (error) {
    console.error("[STITCH PROJECTS] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
