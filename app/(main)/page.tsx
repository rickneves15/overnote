'use client';

import { NoteCard, NoteData } from '@/components/note-card';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const {
    data: publicNotes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await fetch('/api/notes');
      if (!res.ok) {
        throw new Error('Failed to fetch notes');
      }

      return res.json();
    },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notes Feed</h1>
      </div>

      <div className="flex justify-center items-center mb-8">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
      </div>
      {publicNotes && (
        <div className="grid gap-6">
          {publicNotes.map((note: NoteData) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </main>
  );
}
