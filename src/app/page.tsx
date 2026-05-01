import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight">
          Manage your team&apos;s tasks with <span className="text-indigo-600">elegance</span>.
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
          The all-in-one platform for role-based project management, real-time tracking, and seamless team collaboration.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
            Get Started Free <ArrowRight size={20} />
          </Link>
          <Link href="/login" className="flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg hover:bg-slate-50 transition shadow-sm border border-indigo-100">
            Log in to Dashboard
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 text-left pt-16">
          {[
            { title: "Role-Based Access", desc: "Admins create projects, members manage their tasks." },
            { title: "Beautiful Dashboard", desc: "Track progress with visual status indicators and overdue alerts." },
            { title: "Blazing Fast", desc: "Built on Next.js 15 for optimal performance and experience." }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm">
              <CheckCircle2 className="text-indigo-500 mb-4" size={28} />
              <h3 className="font-semibold text-slate-900 text-xl mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
