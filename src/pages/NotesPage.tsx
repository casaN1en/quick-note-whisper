
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, X } from "lucide-react";
import { useNotes } from "@/context/NotesContext";
import NoteItem from "@/components/NoteItem";
import NoteEditor from "@/components/NoteEditor";

const NotesPage = () => {
  const { notes, exportNotes } = useNotes();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b p-4 flex justify-between items-center bg-white shadow-sm">
        <h1 className="text-xl font-semibold text-note-text">Simple Notes</h1>
        <div className="flex gap-2">
          <Button
            variant="outline" 
            size="icon"
            className="rounded-full"
            onClick={exportNotes}
            title="Export notes via email"
          >
            <FileText className="h-5 w-5" />
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
    </div>
  );
};

export default NotesPage;
