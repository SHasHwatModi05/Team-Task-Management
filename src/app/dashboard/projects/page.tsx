"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { FolderKanban, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        setShowModal(false);
        setName("");
        setDescription("");
        fetchProjects();
      } else {
        alert("Failed to create project");
      }
    } catch (error) {
      alert("Error creating project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">Manage your team&apos;s workspaces.</p>
        </div>
        {user?.role === "Admin" && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700 transition"
          >
            <Plus size={20} />
            New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link href={`/dashboard/projects/${project._id}`} key={project._id} className="group block">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all h-full flex flex-col">
              <div className="p-3 bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <FolderKanban size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{project.name}</h3>
              <p className="text-slate-500 text-sm flex-1 line-clamp-2">{project.description}</p>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">Owner: {project.owner?.name}</span>
                <span className="text-indigo-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View Tasks &rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
          <FolderKanban className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-slate-900">No projects found</h3>
          <p className="text-slate-500 mt-1">Get started by creating a new project.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Create New Project</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Project Name</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea 
                  required value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32"
                  placeholder="What is this project about?"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={saving}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="animate-spin" size={18} />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
