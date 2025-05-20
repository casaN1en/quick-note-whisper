
export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isVoiceNote: boolean;
}

export const createNewNote = (content: string, isVoiceNote: boolean = false): Note => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    content,
    createdAt: now,
    updatedAt: now,
    isVoiceNote
  };
};
