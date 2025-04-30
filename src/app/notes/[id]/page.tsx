"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { ChevronLeft, Edit, Trash } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { toast } from "../../../components/ui/use-toast";

// Type definitions for a note
type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Mock data for notes (in a real app, this would come from an API or database)
const mockNotes: Record<string, Note> = {
  "1": {
    id: "1",
    title: "Meeting Notes",
    content: `
      <h1>Project Kickoff Meeting</h1>
      <p>Date: April 28, 2025</p>
      <p>Attendees: John, Sarah, Michael, Emma</p>
      <h2>Agenda</h2>
      <ol>
        <li>Project overview</li>
        <li>Timeline discussion</li>
        <li>Resource allocation</li>
        <li>Next steps</li>
      </ol>
      <h2>Key Decisions</h2>
      <ul>
        <li>Project will launch on June 15th</li>
        <li>Weekly status meetings on Mondays</li>
        <li>Sarah will be the project lead</li>
      </ul>
      <p>Follow-up required with stakeholders by end of week.</p>
    `,
    tags: ["work", "meeting"],
    createdAt: new Date("2025-04-25"),
    updatedAt: new Date("2025-04-28")
  },
  "2": {
    id: "2",
    title: "Ideas for Website Redesign",
    content: `
      <h1>Website Redesign Concepts</h1>
      <h2>Color Schemes</h2>
      <p>Consider using a modern, minimal palette:</p>
      <ul>
        <li>Primary: #3B82F6 (bright blue)</li>
        <li>Secondary: #10B981 (emerald green)</li>
        <li>Neutral: #1F2937 (dark slate)</li>
        <li>Background: #F9FAFB (off-white)</li>
      </ul>
      <h2>Layout Ideas</h2>
      <p>Modular grid system with asymmetrical elements for visual interest.</p>
      <h2>New Features</h2>
      <ol>
        <li>Dark mode toggle</li>
        <li>Improved search functionality</li>
        <li>Interactive product showcase</li>
        <li>Integrated blog section</li>
      </ol>
      <p>Need to schedule user testing for initial concepts.</p>
    `,
    tags: ["design", "web"],
    createdAt: new Date("2025-04-20"),
    updatedAt: new Date("2025-04-27")
  },
  "3": {
    id: "3",
    title: "Shopping List",
    content: `
      <h1>Weekend Dinner Party Shopping</h1>
      <h2>Groceries</h2>
      <ul>
        <li>2 lbs chicken breast</li>
        <li>1 bunch asparagus</li>
        <li>3 sweet potatoes</li>
        <li>Fresh herbs (rosemary, thyme)</li>
        <li>2 lemons</li>
        <li>Olive oil</li>
      </ul>
      <h2>Beverages</h2>
      <ul>
        <li>Red wine (2 bottles)</li>
        <li>Sparkling water</li>
        <li>Coffee beans</li>
      </ul>
      <h2>Dessert</h2>
      <ul>
        <li>Vanilla ice cream</li>
        <li>Fresh berries</li>
        <li>Dark chocolate</li>
      </ul>
      <p>Don't forget to pick up napkins and candles!</p>
    `,
    tags: ["personal"],
    createdAt: new Date("2025-04-26"),
    updatedAt: new Date("2025-04-26")
  }
};

export default function NotePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const fetchedNote = mockNotes[id];
      setNote(fetchedNote || null);
      setIsLoading(false);
    }, 200);
  }, [id]);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      // In a real app, you would call an API to delete the note
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully"
      });
      // Redirect to notes list
      window.location.href = "/notes";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-xl">Loading note...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h1 className="text-2xl font-bold mb-2">Note not found</h1>
          <p className="text-muted-foreground mb-6">
            The note you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <Link href="/notes">Go back to notes</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/notes">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{note.title}</h1>
            <p className="text-sm text-muted-foreground">
              Last updated {note.updatedAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/notes/${id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {note.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <Card className="p-6 mb-6">
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: note.content }} />
      </Card>
    </div>
  );
}
