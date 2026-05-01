"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckSquare, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TasksPage() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      let userTasks = data;
      if (user?.role === "Member") {
        userTasks = data.filter((t: any) => t.assignee?._id === user.id);
      }
      setTasks(userTasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading tasks...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Tasks</h1>
        <p className="text-slate-500 mt-1">Manage and track your assigned work.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-inner">
              <CheckSquare className="text-slate-300" size={32} />
            </div>
            <p className="text-xl font-bold text-slate-800 mb-2">All caught up!</p>
            <p className="text-slate-500">You have no tasks assigned at the moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <div key={task._id} className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-50/80 transition-all duration-300">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase border ${
                      task.status === 'DONE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {task.status.replace("_", " ")}
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{task.title}</h3>
                  <p className="text-slate-500 mt-2 leading-relaxed">{task.description}</p>
                  <div className="mt-4">
                    <Link href={`/dashboard/projects/${task.project?._id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 px-3 py-1.5 rounded-lg transition-colors">
                      <span className="text-indigo-400">Project:</span> {task.project?.name}
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-bold text-slate-700 hover:border-indigo-300 focus:ring-4 focus:ring-indigo-100 outline-none cursor-pointer transition-all"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
