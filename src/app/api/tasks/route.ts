import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");

    const query: any = {};
    if (projectId) query.project = projectId;

    await connectToDatabase();
    const tasks = await Task.find(query).populate("project", "name").populate("assignee", "name email");
    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (userPayload.role !== "Admin") return NextResponse.json({ error: "Only admins can create tasks" }, { status: 403 });

    const { title, description, status, dueDate, project, assignee } = await req.json();
    if (!title || !project) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    await connectToDatabase();
    const task = await Task.create({ title, description, status, dueDate, project, assignee });
    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
