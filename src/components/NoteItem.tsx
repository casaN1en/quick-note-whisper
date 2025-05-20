
import React from "react";
import { Note } from "@/models/Note";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";

interface NoteItemProps {
  note: Note;
  onEdit: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit }) => {
  const { deleteNote } = useNotes();
  
  const previewText = note.content.length > 120
    ? note.content.substring(0, 120) + "..."
    : note.content;

  return (
    <Card 
      className="bg-note-background border hover:border-note-blue transition-colors cursor-pointer"
      onClick={onEdit}
    >
      <CardContent className="p-4">
        <div className="flex justify-between mb-1">
          <p className="text-note-date text-sm">
            {formatDate(note.updatedAt)}
          </p>
        </div>
        
        <p className="text-note-text whitespace-pre-wrap">{previewText}</p>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50" 
            onClick={(e) => {
              e.stopPropagation();
              deleteNote(note.id);
            }}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteItem;
