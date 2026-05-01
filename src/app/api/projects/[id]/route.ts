import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userPayload = getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const project = await Project.findById(id).populate("owner", "name email");
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userPayload = getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (userPayload.role !== "Admin") return NextResponse.json({ error: "Only admins can delete projects" }, { status: 403 });

    await connectToDatabase();
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
