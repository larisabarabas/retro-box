"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const res = await fetch("/api/notes?sprint_number=1");
    const data = await res.json();
    setNotes(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

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
        fetchNotes();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            &larr; Back
          </Button>
        </Link>
      </div>

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

            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Note"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Notes ({notes.length})</h2>

        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{note.author_name}</CardTitle>
                <CardDescription>
                  {new Date(note.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>{note.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
