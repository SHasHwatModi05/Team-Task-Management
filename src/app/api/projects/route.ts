import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const projects = await Project.find({}).populate("owner", "name email");
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (userPayload.role !== "Admin") return NextResponse.json({ error: "Only admins can create projects" }, { status: 403 });

    const { name, description } = await req.json();
    if (!name || !description) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    await connectToDatabase();
    const project = await Project.create({ name, description, owner: userPayload.userId });
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
