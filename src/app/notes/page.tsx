"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { cn } from "../../lib/utils";

// Types for our notes
type Note = {
  id: string;
  title: string;
  excerpt: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
};

// Mock data for notes (in a real app, this would come from an API or database)
const mockNotes: Note[] = [
  {
    id: "1",
    title: "Meeting Notes",
    excerpt: "Discussion about the new project timeline and resource allocation.",
    createdAt: new Date("2025-04-25"),
    updatedAt: new Date("2025-04-28"),
    tags: ["work", "meeting"]
  },
  {
    id: "2",
    title: "Ideas for Website Redesign",
    excerpt: "Color schemes, layout options, and potential new features to consider.",
    createdAt: new Date("2025-04-20"),
    updatedAt: new Date("2025-04-27"),
    tags: ["design", "web"]
  },
  {
    id: "3",
    title: "Shopping List",
    excerpt: "Items to buy for the weekend dinner party.",
    createdAt: new Date("2025-04-26"),
    updatedAt: new Date("2025-04-26"),
    tags: ["personal"]
  }
];

export default function NotesPage() {
  const [notes] = useState<Note[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">All Notes</h1>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/notes/new" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Note
            </Link>
          </Button>
        </div>
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`} className="block group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="group-hover:text-primary transition-colors">{note.title}</CardTitle>
                  <CardDescription>
                    Updated {note.updatedAt.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{note.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-2xl font-semibold mb-2">No notes found</p>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "Try a different search term" : "Create your first note to get started"}
          </p>
          <Button asChild>
            <Link href="/notes/new" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Note
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
