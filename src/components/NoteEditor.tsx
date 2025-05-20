
import React, { useState, useEffect } from "react";
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface NoteEditorProps {
  noteId: string | null;
  initialContent?: string;
  onClose: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ 
  noteId, 
  initialContent = "", 
  onClose 
}) => {
  const { addNote, updateNote, getNote } = useNotes();
  const [content, setContent] = useState(initialContent);
  
  useEffect(() => {
    if (noteId) {
      const note = getNote(noteId);
      if (note) {
        setContent(note.content);
      }
    } else if (initialContent) {
      setContent(initialContent);
    }
  }, [noteId, getNote, initialContent]);

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "Cannot save empty note",
        description: "Please enter some content for your note.",
        variant: "destructive",
      });
      return;
    }

    if (noteId) {
      updateNote(noteId, content);
      toast({
        title: "Note updated",
        description: "Your changes have been saved."
      });
    } else {
      addNote(content);
      toast({
        title: "Note created",
        description: "Your new note has been saved."
      });
    }
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here..."
        className="flex-1 min-h-[200px] text-note-text resize-none border-none shadow-none focus-visible:ring-0"
        autoFocus
      />
      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default NoteEditor;
