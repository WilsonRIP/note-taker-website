"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3, 
  List, ListOrdered, Image as ImageIcon, Mic, Square, 
  Link as LinkIcon, Code, Quote, Undo, Redo
} from "lucide-react";

// MarkdownEditor component for the markdown mode
const MarkdownEditor = ({ 
  content, 
  onContentChangeAction 
}: { 
  content: string;
  onContentChangeAction: (value: string) => void;
}) => {
  return (
    <Textarea
      placeholder="Write your note in Markdown..."
      className="min-h-[300px] font-mono"
      value={content}
      onChange={(e) => onContentChangeAction(e.target.value)}
    />
  );
};

// Function to create rich text content based on commands
const applyFormat = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};

// Rich text editor component
const RichTextEditor = ({ 
  content, 
  onContentChangeAction 
}: { 
  content: string;
  onContentChangeAction: (value: string) => void;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isRTL, setIsRTL] = useState(false); // Track if we're in RTL mode
  
  // Custom editor to handle the reversed typing issue
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Override default editor behavior
    document.execCommand('defaultParagraphSeparator', false, 'p');
    document.execCommand('styleWithCSS', false, 'true');

    // Create a custom keypress handler to fix the reversed text issue
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle character keys
      if (e.key.length === 1) {
        e.preventDefault(); // Prevent default input behavior
        
        // Get current selection
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        
        // Insert the character programmatically
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(e.key);
        range.insertNode(textNode);
        
        // Move cursor after inserted character
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Update content
        onContentChangeAction(editor.innerHTML);
      }
    };

    // Handle all other editor events
    const handleInput = () => {
      onContentChangeAction(editor.innerHTML);
    };

    // Add event listeners
    editor.addEventListener('keypress', handleKeyPress);
    editor.addEventListener('input', handleInput);
    
    // Track changes from toolbar actions
    const toolbarObserver = new MutationObserver(() => {
      onContentChangeAction(editor.innerHTML);
    });
    
    toolbarObserver.observe(editor, { 
      childList: true, 
      subtree: true, 
      characterData: true,
      attributes: true 
    });

    return () => {
      editor.removeEventListener('keypress', handleKeyPress);
      editor.removeEventListener('input', handleInput);
      toolbarObserver.disconnect();
    };
  }, [onContentChangeAction]);
  
  
  // Set initial content
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    
    if (!editor.innerHTML && content) {
      editor.innerHTML = content;
    }
  }, [content]);
  
  // File input ref for image uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Drawing state and refs
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Initialize canvas for drawing
  useEffect(() => {
    if (isDrawing && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctxRef.current = ctx;
      }
    }
  }, [isDrawing]);
  
  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(position.x, position.y);
    ctxRef.current?.lineTo(position.x, position.y);
    ctxRef.current?.stroke();
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(position.x, position.y);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    
    setPosition({ x, y });
  };
  
  const endDrawing = () => {
    if (!isDrawing || !canvasRef.current || !ctxRef.current) return;
    
    ctxRef.current.closePath();
    
    // Convert canvas to image and add to editor
    const imageUrl = canvasRef.current.toDataURL("image/png");
    const img = document.createElement("img");
    img.src = imageUrl;
    img.className = "my-2 max-w-full h-auto border rounded";
    
    editorRef.current?.appendChild(img);
    
    // Clear canvas
    ctxRef.current.clearRect(
      0, 
      0, 
      canvasRef.current.width, 
      canvasRef.current.height
    );
    
    // Exit drawing mode
    setIsDrawing(false);
    
    // Update content
    if (editorRef.current) {
      onContentChangeAction(editorRef.current.innerHTML);
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target || !event.target.result) return;
      
      const img = document.createElement("img");
      img.src = event.target.result as string;
      img.className = "my-2 max-w-full h-auto border rounded";
      
      editorRef.current?.appendChild(img);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Update content
      if (editorRef.current) {
        onContentChangeAction(editorRef.current.innerHTML);
      }
    };
    
    reader.readAsDataURL(file);
  };
  
  // Handle audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = document.createElement("audio");
        audio.src = audioUrl;
        audio.controls = true;
        audio.className = "my-2 w-full";
        
        editorRef.current?.appendChild(audio);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Update content
        if (editorRef.current) {
          onContentChangeAction(editorRef.current.innerHTML);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Create link handler
  const createLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      applyFormat("createLink", url);
    }
  };
  
  return (
    <div className="flex flex-col border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("bold")}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("italic")}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("underline")}>
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("formatBlock", "<h1>")}>
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("formatBlock", "<h2>")}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("formatBlock", "<h3>")}>
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("insertOrderedList")}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="h-4 w-4" />
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsDrawing(prev => !prev)}
          className={isDrawing ? "bg-muted" : ""}
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={isRecording ? stopRecording : startRecording}
          className={isRecording ? "text-red-500" : ""}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button type="button" variant="ghost" size="icon" onClick={createLink}>
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("formatBlock", "<pre>")}>
          <Code className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("formatBlock", "<blockquote>")}>
          <Quote className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("undo")}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat("redo")}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      {isDrawing && (
        <div className="border-b p-1 bg-muted/20">
          <p className="text-xs text-muted-foreground mb-1">Drawing Mode: Click and drag to draw</p>
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={300} 
            className="border bg-white w-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
          />
        </div>
      )}
      
      <div 
        ref={editorRef}
        className="ProseMirror min-h-[300px] focus:outline-none p-4 text-left"
        contentEditable="true"
        dir="ltr"
        style={{ 
          direction: 'ltr', 
          textAlign: 'left',
          unicodeBidi: 'plaintext',
          writingMode: 'horizontal-tb'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
        spellCheck="true"
        suppressContentEditableWarning
      />
    </div>
  );
};

// Main NoteEditor component that combines both editors
export function NoteEditor({ 
  content, 
  onContentChangeAction,
  isMarkdownMode
}: { 
  content: string;
  onContentChangeAction: (value: string) => void;
  isMarkdownMode: boolean;
}) {
  return (
    <div>
      {isMarkdownMode ? (
        <MarkdownEditor content={content} onContentChangeAction={onContentChangeAction} />
      ) : (
        <RichTextEditor content={content} onContentChangeAction={onContentChangeAction} />
      )}
    </div>
  );
}
