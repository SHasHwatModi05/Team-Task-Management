import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userPayload = getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const updates = await req.json();

    await connectToDatabase();
    const task = await Task.findById(id);
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    // Admins can update anything. Members can only update status if assigned to them.
    if (userPayload.role !== "Admin") {
      if (task.assignee?.toString() !== userPayload.userId) {
        return NextResponse.json({ error: "Not authorized to update this task" }, { status: 403 });
      }
      // members can only update status
      task.status = updates.status || task.status;
      await task.save();
      return NextResponse.json(task);
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userPayload = getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (userPayload.role !== "Admin") return NextResponse.json({ error: "Only admins can delete tasks" }, { status: 403 });

    await connectToDatabase();
    await Task.findByIdAndDelete(id);
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
