"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Edit, Save, X, FileText, Clock, Globe, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";

interface SessionCardProps {
  session: {
    id: string;
    title: string | null;
    createdAt: Date;
    language: string;
    originalText: string;
    revisions?: { id: string }[];
  };
}

export default function SessionCard({ session }: SessionCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(session.title || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTitle(session.title || "");
    setIsEditing(false);
  };

  const handleSaveTitle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/history/sessions/${session.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update session title");
      }

      toast.success("Session title updated");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <motion.div
        className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Edit className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              placeholder="Enter session title"
              disabled={isLoading}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(session.createdAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span className="uppercase font-medium">{session.language}</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {session.originalText.substring(0, 120)}
          {session.originalText.length > 120 ? "..." : ""}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs">
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 px-2 py-1 rounded-full font-medium">
              {session.revisions?.length || 0} revision
              {session.revisions?.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleSaveTitle}
              disabled={isLoading}
              variant="primary"
              size="sm"
              className="h-8 px-3"
            >
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button
              onClick={handleCancelEdit}
              disabled={isLoading}
              variant="ghost"
              size="sm"
              className="h-8 px-3"
            >
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Link href={`/history/${session.id}`}>
      <motion.div
        className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-slate-800 truncate mb-1">
                  {session.title || "Untitled Session"}
                </h3>
              </div>
            </div>
            <motion.button
              onClick={handleEditClick}
              className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Edit title"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(session.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span className="uppercase font-medium">
                  {session.language}
                </span>
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
            {session.originalText.substring(0, 150)}
            {session.originalText.length > 150 ? "..." : ""}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs">
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 px-2 py-1 rounded-full font-medium">
                {session.revisions?.length || 0} revision
                {session.revisions?.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors duration-200">
              Click to view details →
            </div>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 0.2, 0.6],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </Link>
  );
}
