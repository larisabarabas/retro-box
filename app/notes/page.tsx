"use client";

import { useState } from "react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetcher } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Note {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
  sprint_number: number;
}

export default function NotesPage() {
  const {
    data: notes,
    isLoading,
    mutate,
  } = useSWR<Note[]>("/api/notes?sprint_number=1", fetcher);
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          author_name: authorName,
          sprint_number: 1,
        }),
      });

      if (res.ok) {
        setContent("");
        mutate();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <BackButton />

      <h1 className="text-3xl font-bold mb-8">Sprint 1 Notes</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add a Note</CardTitle>
          <CardDescription>
            Share what went well or what could be improved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="author">Your Name</Label>
              <Input
                id="author"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Alice"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Retro Note</Label>
              <Input
                id="note"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Deploy took too long because..."
                required
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Note"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          All Notes {notes ? `(${notes.length})` : ""}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          notes?.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">
                    {note.author_name}
                  </CardTitle>
                  <CardDescription>
                    {new Date(note.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>{note.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
