
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Plus, X } from "lucide-react";
import { useNotes } from "@/context/NotesContext";
import NoteItem from "@/components/NoteItem";
import NoteEditor from "@/components/NoteEditor";
import VoiceRecorder from "@/components/VoiceRecorder";
import { toast } from "@/components/ui/use-toast";
import { isMobile } from "@/lib/utils";

const NotesPage = () => {
  const { notes } = useNotes();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const handleNewNote = () => {
    setEditingNoteId(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (id: string) => {
    setEditingNoteId(id);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingNoteId(null);
  };

  const startRecording = () => {
    if (isRecording) return;
    
    if (isMobile()) {
      // On mobile, we'll use the device's native speech recognition
      toast({
        title: "Voice Recording",
        description: "Your device's native speech input will open."
      });
    }
    
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b p-4 flex justify-between items-center bg-white shadow-sm">
        <h1 className="text-xl font-semibold text-note-text">My Notes</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full ${isRecording ? "bg-red-100 text-red-500 animate-pulse-recording" : ""}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            <Mic className={`h-5 w-5 ${isRecording ? "text-red-500" : ""}`} />
          </Button>
          <Button
            variant="outline" 
            size="icon"
            className="rounded-full"
            onClick={handleNewNote}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-auto">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <p className="mb-4">No notes yet</p>
            <Button onClick={handleNewNote} variant="outline">Create your first note</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <NoteItem 
                key={note.id} 
                note={note} 
                onEdit={() => handleEditNote(note.id)}
              />
            ))}
          </div>
        )}
      </main>

      {isEditorOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">
              {editingNoteId ? "Edit Note" : "New Note"}
            </h2>
            <Button variant="ghost" size="icon" onClick={closeEditor}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <NoteEditor 
              noteId={editingNoteId} 
              onClose={closeEditor} 
            />
          </div>
        </div>
      )}

      {isRecording && (
        <VoiceRecorder 
          onStop={(transcript) => {
            setIsRecording(false);
            if (transcript) {
              setEditingNoteId(null);
              setIsEditorOpen(true);
              console.log("Got transcript:", transcript);
            }
          }} 
        />
      )}
    </div>
  );
};

export default NotesPage;
