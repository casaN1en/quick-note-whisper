
export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const createNewNote = (content: string): Note => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    content,
    createdAt: now,
    updatedAt: now
  };
};
