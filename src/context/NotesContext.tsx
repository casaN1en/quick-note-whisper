
import React, { createContext, useState, useContext, useEffect } from "react";
import { Note, createNewNote } from "@/models/Note";
import { toast } from "@/components/ui/use-toast";

interface NotesContextType {
  notes: Note[];
  addNote: (content: string, isVoiceNote?: boolean) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error("Failed to parse notes from localStorage:", error);
        toast({
          title: "Error loading notes",
          description: "There was a problem loading your saved notes.",
          variant: "destructive",
        });
      }
    }
  }, []);

  useEffect(() => {
    // Save notes to localStorage whenever notes change
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (content: string, isVoiceNote = false) => {
    const newNote = createNewNote(content, isVoiceNote);
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    return newNote;
  };

  const updateNote = (id: string, content: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, content, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    toast({
      title: "Note deleted",
      description: "Your note has been deleted."
    });
  };

  const getNote = (id: string) => {
    return notes.find((note) => note.id === id);
  };

  const value = {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNote,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};
