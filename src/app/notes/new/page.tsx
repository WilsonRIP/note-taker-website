"use client";

import * as React from "react";
import { useState } from "react";
import { NoteEditor } from "../../../components/note-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "../../../components/ui/use-toast";

export default function NewNotePage() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isMarkdownMode, setIsMarkdownMode] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  
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
      title,
      content,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    toast({
      title: "Note saved",
      description: "Your note has been saved successfully",
    });
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

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/notes">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">New Note</h1>
        </div>
        
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Note
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
