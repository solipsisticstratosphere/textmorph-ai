import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SessionCard from "./components/SessionCard";
import { History, Clock, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

async function HistoryPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  const sessions = await prisma.textSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { revisions: { orderBy: { revisionNumber: "asc" } } },
    take: 50,
  });

  const groupedSessions: { [key: string]: typeof sessions } = {};
  sessions.forEach((session) => {
    const date = new Date(session.createdAt).toLocaleDateString();
    if (!groupedSessions[date]) {
      groupedSessions[date] = [];
    }
    groupedSessions[date].push(session);
  });

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #7dd3fc 75%, #38bdf8 100%)",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
              <History className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Your Text{" "}
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              History
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Browse through your previous text transformations and revisit your
            creative journey.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {sessions.length}
                </div>
                <div className="text-sm text-slate-600">Total Sessions</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {sessions.reduce(
                    (acc, session) => acc + (session.revisions?.length || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-slate-600">Total Revisions</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {Object.keys(groupedSessions).length}
                </div>
                <div className="text-sm text-slate-600">Active Days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {Object.keys(groupedSessions).length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/20">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              No history yet
            </h3>
            <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
              Your text transformation history will appear here once you start
              using the app. Create your first transformation to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedSessions).map(([date, dateSessions]) => (
              <div key={date}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{date}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
                  <span className="text-sm text-slate-500 bg-white/60 px-3 py-1 rounded-full">
                    {dateSessions.length} session
                    {dateSessions.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dateSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
