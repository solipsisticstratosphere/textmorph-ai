"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2, Save, X, Hash, Clock, Wand2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface RevisionItemProps {
  revision: {
    id: string;
    revisionNumber: number;
    transformPrompt: string;
    preset: string | null;
    selectedText: string;
    transformedText: string;
    createdAt: Date;
  };
  sessionId: string;
}

export default function RevisionItem({
  revision,
  sessionId,
}: RevisionItemProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [transformPrompt, setTransformPrompt] = useState(
    revision.transformPrompt
  );
  const [preset, setPreset] = useState(revision.preset || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelEdit = () => {
    setTransformPrompt(revision.transformPrompt);
    setPreset(revision.preset || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!transformPrompt.trim()) {
      toast.error("Transformation prompt cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/history/sessions/${sessionId}/revisions/${revision.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transformPrompt,
            preset: preset || null,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update revision");
      }

      toast.success("Revision updated");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/history/sessions/${sessionId}/revisions/${revision.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete revision");
      }

      toast.success("Revision deleted");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setIsDeleting(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <Hash className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Revision #{revision.revisionNumber}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-slate-500">
              <Clock className="w-3 h-3" />
              <span>{new Date(revision.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isDeleting ? (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-red-600 font-medium">Delete revision?</span>
              <Button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                variant="danger"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
              <Button
                onClick={handleCancelDelete}
                disabled={isLoading}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </motion.div>
          ) : (
            <div className="flex space-x-2">
              <motion.div>
                <Button onClick={handleDeleteClick} variant="danger" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Transformation Prompt */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Wand2 className="w-3 h-3 text-white" />
          </div>
          <span>Transformation Prompt</span>
        </h4>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={transformPrompt}
              onChange={(e) => setTransformPrompt(e.target.value)}
              placeholder="Enter transformation prompt"
              disabled={isLoading}
              rows={3}
            />
            <div className="flex items-center justify-between">
              <Input
                type="text"
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                placeholder="Preset (optional)"
                disabled={isLoading}
                className="w-48"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  variant="primary"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 p-4 rounded-xl">
            <p className="text-slate-700 leading-relaxed">
              {revision.transformPrompt}
            </p>
            {revision.preset && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                  Preset: {revision.preset}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Text Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📝</span>
            </div>
            <span>Selected Text</span>
          </h4>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 p-4 rounded-xl">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {revision.selectedText}
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">✨</span>
            </div>
            <span>Transformed Text</span>
          </h4>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {revision.transformedText}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
