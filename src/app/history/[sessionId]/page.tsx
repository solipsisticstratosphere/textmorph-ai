import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, Globe, FileText, RotateCcw } from "lucide-react";
import SessionActions from "./components/SessionActions";
import RevisionItem from "./components/RevisionItem";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

interface SessionDetailPageProps {
  params: {
    sessionId: string;
  };
}

export default async function SessionDetailPage({
  params,
}: SessionDetailPageProps) {
  const { sessionId } = await Promise.resolve(params);

  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  const session = await prisma.textSession.findUnique({
    where: { id: sessionId },
    include: { revisions: { orderBy: { revisionNumber: "asc" } } },
  });

  if (!session || session.userId !== user.id) {
    redirect("/history");
  }

  const formattedDate = new Date(session.createdAt).toLocaleString();

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

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/history">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 hover:bg-white/50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to History</span>
            </Button>
          </Link>
        </div>

        {/* Session Details */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  {session.title || "Untitled Session"}
                </h1>
                <div className="flex items-center space-x-4 text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span className="uppercase font-medium">
                      {session.language}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RotateCcw className="w-4 h-4" />
                    <span>{session.revisions?.length || 0} revisions</span>
                  </div>
                </div>
              </div>
            </div>
            <SessionActions session={session} />
          </div>

          {/* Prompt Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">💭</span>
              </div>
              <span>Transformation Prompt</span>
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-xl">
              <p className="text-slate-700 leading-relaxed">{session.prompt}</p>
            </div>
          </div>

          {/* Text Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">📝</span>
                </div>
                <span>Original Text</span>
              </h2>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 p-4 rounded-xl">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {session.originalText}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">✨</span>
                </div>
                <span>Final Text</span>
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {session.finalText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revisions Section */}
        {session.revisions && session.revisions.length > 0 ? (
          <div>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Revisions ({session.revisions.length})
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </div>
            <div className="space-y-6">
              {session.revisions.map((revision) => (
                <RevisionItem
                  key={revision.id}
                  revision={revision}
                  sessionId={sessionId}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No revisions yet
            </h3>
            <p className="text-slate-600">
              This session doesn&apos;t have any revisions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
