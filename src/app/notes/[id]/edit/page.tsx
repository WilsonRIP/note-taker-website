"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { NoteEditor } from "../../../../components/note-editor";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "../../../../components/ui/use-toast";

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

export default function EditNotePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isMarkdownMode, setIsMarkdownMode] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const fetchedNote = mockNotes[id];
      if (fetchedNote) {
        setNote(fetchedNote);
        setTitle(fetchedNote.title);
        setContent(fetchedNote.content);
        setTags([...fetchedNote.tags]);
      }
      setIsLoading(false);
    }, 200);
  }, [id]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would save to a database here
    console.log({
      id,
      title,
      content,
      tags,
      createdAt: note?.createdAt || new Date(),
      updatedAt: new Date(),
    });

    toast({
      title: "Note updated",
      description: "Your note has been updated successfully",
    });

    // Redirect to note view
    window.location.href = `/notes/${id}`;
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
            <Link href={`/notes/${id}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Note</h1>
        </div>

        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Note Title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Tags</Label>
          <div className="mt-1 flex items-center gap-2">
            <Input
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && addTag()}
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full hover:bg-muted p-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <Card>
          <CardHeader className="px-4 py-3">
            <Tabs defaultValue="editor" className="w-full" onValueChange={(value: string) => setIsMarkdownMode(value === "markdown")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor">Rich Editor</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <NoteEditor 
              content={content} 
              onContentChangeAction={setContent} 
              isMarkdownMode={isMarkdownMode} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
