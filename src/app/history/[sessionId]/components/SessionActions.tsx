"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SessionActionsProps {
  session: {
    id: string;
    title: string | null;
  };
}

export default function SessionActions({ session }: SessionActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(session.title || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTitle(session.title || "");
    setIsEditing(false);
  };

  const handleSaveTitle = async () => {
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

  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/history/sessions/${session.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete session");
      }

      toast.success("Session deleted");
      router.push("/history");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setIsDeleting(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <motion.div
        className="flex items-center space-x-3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter session title"
          disabled={isLoading}
          className="w-64"
        />
        <Button
          onClick={handleSaveTitle}
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
      </motion.div>
    );
  }

  if (isDeleting) {
    return (
      <motion.div
        className="flex items-center space-x-3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-red-600 font-medium">Delete this session?</span>
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
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <motion.div>
        <Button
          onClick={handleEditClick}
          variant="ghost"
          size="sm"
          className="hover:bg-cyan-50"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </motion.div>
      <motion.div>
        <Button onClick={handleDeleteClick} variant="danger" size="sm">
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </motion.div>
    </div>
  );
}
