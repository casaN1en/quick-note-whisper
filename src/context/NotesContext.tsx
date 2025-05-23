
import React, { createContext, useState, useContext, useEffect } from "react";
import { Note, createNewNote } from "@/models/Note";
import { toast } from "@/components/ui/use-toast";

interface NotesContextType {
  notes: Note[];
  addNote: (content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
  exportNotes: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

// Local storage key
const STORAGE_KEY = "simple-notes";

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const storedNotes = localStorage.getItem(STORAGE_KEY);
      return storedNotes ? JSON.parse(storedNotes) : [];
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);
      return [];
    }
  });

  // Save to localStorage whenever notes change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving notes to localStorage:", error);
    }
  }, [notes]);

  const addNote = (content: string) => {
    const newNote = createNewNote(content);
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

  const exportNotes = () => {
    if (notes.length === 0) {
      toast({
        title: "No notes to export",
        description: "Create some notes first before exporting.",
        variant: "destructive",
      });
      return;
    }

    // Format notes to plain text
    const notesText = notes.map(note => {
      const date = new Date(note.createdAt).toLocaleString();
      return `--- Note from ${date} ---\n${note.content}\n\n`;
    }).join('');
    
    // Create mailto URL with notes as body
    const subject = encodeURIComponent('My Notes Export');
    const body = encodeURIComponent(notesText);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    toast({
      title: "Exporting notes",
      description: "Opening your email client to send notes."
    });
  };

  const value = {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNote,
    exportNotes
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};
