"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [recentNotes, setRecentNotes] = useState<Array<{ id: string; title: string; updatedAt: Date }>>([]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Welcome to Note Taker</h1>
        <Button asChild>
          <Link href="/notes/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Get started with Note Taker</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create a new note with rich formatting</li>
              <li>Add images, attachments, and screenshots</li>
              <li>Record audio or use voice dictation</li>
              <li>Draw diagrams and sketches</li>
              <li>Use markdown for code-friendly notes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Notes</CardTitle>
            <CardDescription>Your recently edited notes</CardDescription>
          </CardHeader>
          <CardContent>
            {recentNotes.length > 0 ? (
              <ul className="space-y-2">
                {recentNotes.map((note) => (
                  <li key={note.id}>
                    <Link href={`/notes/${note.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                      {note.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {note.updatedAt.toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No recent notes found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tips & Tricks</CardTitle>
            <CardDescription>Get the most out of Note Taker</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use <kbd className="px-1 py-0.5 text-xs rounded border bg-muted">Ctrl+B</kbd> for bold text</li>
              <li>Use <kbd className="px-1 py-0.5 text-xs rounded border bg-muted">Ctrl+I</kbd> for italic text</li>
              <li>Use <kbd className="px-1 py-0.5 text-xs rounded border bg-muted">Ctrl+K</kbd> to add a link</li>
              <li>Use markdown for code blocks and formatting</li>
              <li>Organize notes with tags and folders</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
