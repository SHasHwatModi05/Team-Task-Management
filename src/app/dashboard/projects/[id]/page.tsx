"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, ArrowLeft, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuthStore();
  
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Task modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [projRes, tasksRes, usersRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/tasks?projectId=${projectId}`),
        fetch(`/api/users`)
      ]);
      const projData = await projRes.json();
      const tasksData = await tasksRes.json();
      const usersData = await usersRes.json();
      
      setProject(projData);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          status, 
          assignee: assignee || null, 
          dueDate: dueDate || null, 
          project: projectId 
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setTitle(""); setDescription(""); setStatus("TODO"); setAssignee(""); setDueDate("");
        fetchData();
      } else {
        alert("Failed to create task");
      }
    } catch (error) {
      alert("Error creating task");
    } finally {
      setSaving(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading project details...</div>;
  if (!project) return <div className="p-8 text-center text-red-500">Project not found</div>;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/projects" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-500 mt-2 text-lg">{project.description}</p>
        </div>
        {user?.role === "Admin" && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition whitespace-nowrap shadow-md shadow-indigo-200"
          >
            <Plus size={20} /> Add Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kanban Board style columns */}
        {['TODO', 'IN_PROGRESS', 'DONE'].map(columnStatus => (
          <div key={columnStatus} className="bg-slate-50/80 backdrop-blur-md rounded-3xl p-5 flex flex-col h-full border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-5 flex items-center justify-between tracking-wide text-sm">
              <span className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${columnStatus === 'TODO' ? 'bg-amber-400' : columnStatus === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                {columnStatus.replace("_", " ")}
              </span>
              <span className="bg-white border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                {tasks.filter(t => t.status === columnStatus).length}
              </span>
            </h3>
            
            <div className="space-y-4 flex-1">
              {tasks.filter(t => t.status === columnStatus).map(task => (
                <div key={task._id} className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 hover:-translate-y-0.5 transition-all duration-300">
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{task.description}</p>
                  
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {task.assignee ? (
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs text-indigo-700 font-bold shadow-sm" title={task.assignee.name}>
                          {task.assignee.name.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 border-dashed flex items-center justify-center text-slate-400" title="Unassigned">
                          <span className="text-[10px] font-medium">?</span>
                        </div>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          <Calendar size={12} className="text-slate-400" />
                          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    
                    {(user?.role === "Admin" || task.assignee?._id === user?.id) && (
                      <select 
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg bg-slate-50 px-2 py-1.5 font-medium text-slate-700 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer transition-colors"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === columnStatus).length === 0 && (
                <div className="text-center text-slate-400 text-sm py-8 border-2 border-dashed border-slate-200/60 bg-white/50 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-300">📝</span>
                  </div>
                  No tasks yet
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Create Task</h2>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Assignee</label>
                  <select value={assignee} onChange={e => setAssignee(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Due Date</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 px-4 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                  {saving && <Loader2 className="animate-spin" size={18} />} Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
