"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Search as SearchIcon } from "lucide-react";

// Type for Note data
type Note = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Mock data for searching (in a real app, this would come from a database or API)
const mockNotes: Note[] = [
  {
    id: "1",
    title: "Meeting Notes",
    content: "<h1>Project Kickoff Meeting</h1><p>Discuss timeline and resources</p>",
    excerpt: "Discussion about the new project timeline and resource allocation.",
    createdAt: new Date("2025-04-25"),
    updatedAt: new Date("2025-04-28"),
    tags: ["work", "meeting"]
  },
  {
    id: "2",
    title: "Ideas for Website Redesign",
    content: "<h1>Website Redesign Concepts</h1><p>Color schemes and layout options</p>",
    excerpt: "Color schemes, layout options, and potential new features to consider.",
    createdAt: new Date("2025-04-20"),
    updatedAt: new Date("2025-04-27"),
    tags: ["design", "web"]
  },
  {
    id: "3",
    title: "Shopping List",
    content: "<h1>Weekend Dinner Party Shopping</h1><ul><li>Groceries</li></ul>",
    excerpt: "Items to buy for the weekend dinner party.",
    createdAt: new Date("2025-04-26"),
    updatedAt: new Date("2025-04-26"),
    tags: ["personal"]
  },
  {
    id: "4",
    title: "Learning Resources for React",
    content: "<h1>React Learning Resources</h1><p>Useful links and courses</p>",
    excerpt: "A collection of tutorials, documentation, and courses for learning React.",
    createdAt: new Date("2025-04-15"),
    updatedAt: new Date("2025-04-22"),
    tags: ["development", "react", "learning"]
  },
  {
    id: "5",
    title: "Project Ideas",
    content: "<h1>Future Project Ideas</h1><p>List of potential projects to work on</p>",
    excerpt: "Brainstorming list of potential side projects and app ideas.",
    createdAt: new Date("2025-04-10"),
    updatedAt: new Date("2025-04-18"),
    tags: ["ideas", "development"]
  }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Perform search when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const results = mockNotes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Search Notes</h1>
      
      <div className="relative max-w-2xl mx-auto mb-8">
        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by title, content, or tags..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="pl-10 py-6 text-lg"
          autoFocus
        />
      </div>
      
      {isSearching ? (
        <div className="flex justify-center my-12">
          <div className="animate-pulse text-lg">Searching...</div>
        </div>
      ) : searchQuery && searchResults.length === 0 ? (
        <div className="text-center my-12">
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground mb-4">
            No notes matching "{searchQuery}" were found.
          </p>
          <Button asChild>
            <Link href="/notes/new">Create a new note</Link>
          </Button>
        </div>
      ) : searchQuery && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
          </h2>
          
          <div className="grid gap-4">
            {searchResults.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`} className="block group">
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {note.title}
                    </CardTitle>
                    <CardDescription>
                      Updated {note.updatedAt.toLocaleDateString()} • 
                      {note.tags.map((tag, i) => (
                        <span key={tag} className="ml-1">
                          {tag}{i < note.tags.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">{note.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {!searchQuery && (
        <div className="text-center my-12">
          <h2 className="text-xl font-semibold mb-2">Start typing to search</h2>
          <p className="text-muted-foreground">
            Search for notes by title, content, or tags.
          </p>
        </div>
      )}
    </div>
  );
}
