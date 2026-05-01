"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0, overdue: 0 });
  const [tasks, setTasks] = useState<any[]>([]);
  const [membersInfo, setMembersInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasksAndUsers = async () => {
      try {
        const res = await fetch("/api/tasks");
        const tasksData = await res.json();
        
        let userTasks = tasksData;
        if (user?.role === "Member") {
          userTasks = tasksData.filter((t: any) => t.assignee?._id === user.id);
        } else if (user?.role === "Admin") {
          const usersRes = await fetch("/api/users");
          const usersData = await usersRes.json();
          const membersList = usersData.filter((u: any) => u.role === "Member");
          const info = membersList.map((member: any) => {
            const memberTasks = tasksData.filter((t: any) => t.assignee?._id === member._id);
            return {
              ...member,
              tasks: memberTasks
            };
          });
          setMembersInfo(info);
        }

        setTasks(userTasks);
        setStats({
          total: userTasks.length,
          todo: userTasks.filter((t: any) => t.status === "TODO").length,
          inProgress: userTasks.filter((t: any) => t.status === "IN_PROGRESS").length,
          done: userTasks.filter((t: any) => t.status === "DONE").length,
          overdue: userTasks.filter((t: any) => t.status !== "DONE" && t.dueDate && new Date(t.dueDate) < new Date()).length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTasksAndUsers();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name.split(' ')[0]}</h1>
        <p className="text-slate-500 mt-1">Here is what&apos;s happening with your tasks today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><AlertCircle size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Tasks</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-600 rounded-xl"><AlertCircle size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">To Do</p>
            <p className="text-2xl font-bold text-slate-900">{stats.todo}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">In Progress</p>
            <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="text-2xl font-bold text-slate-900">{stats.done}</p>
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl"><AlertCircle size={24} /></div>
          <div>
            <p className="text-sm font-medium text-red-500">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          </div>
        </div>
      </div>

      {user?.role === "Admin" && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Team Members & Assignments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Member Name</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Email</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Assigned Tasks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {membersInfo.map((member, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 font-medium text-slate-900 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        {member.name}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-500 align-top pt-8">{member.email}</td>
                    <td className="px-6 py-5 align-top">
                      {member.tasks.length > 0 ? (
                        <div className="space-y-3">
                          {member.tasks.map((task: any) => (
                            <div key={task._id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-4 hover:border-indigo-200 transition-colors">
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{task.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                    {task.project?.name || "No Project"}
                                  </span>
                                </div>
                              </div>
                              <span className={`text-[10px] px-2.5 py-1 rounded-full font-black tracking-wide uppercase border ${
                                task.status === 'DONE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                'bg-amber-50 text-amber-600 border-amber-200'
                              }`}>
                                {task.status.replace("_", " ")}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-2 text-slate-400 italic text-sm">No tasks assigned yet.</div>
                      )}
                    </td>
                  </tr>
                ))}
                {membersInfo.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Recent Tasks</h2>
          <Link href="/dashboard/tasks" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {tasks.slice(0, 5).map(task => (
            <div key={task._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <h3 className="font-semibold text-slate-800">{task.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{task.project?.name || "No Project"}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' :
                task.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {task.status.replace("_", " ")}
              </span>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-8 text-center text-slate-500">No tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
