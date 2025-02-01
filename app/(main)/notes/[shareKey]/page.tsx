'use client';

import { NoteCard } from '@/components/note-card';
import { useQuery } from '@tanstack/react-query';

export default function Page({ params }: { params: { shareKey: string } }) {
  const { shareKey } = params;
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notes', shareKey],
    queryFn: async () => {
      const res = await fetch(`/api/notes/${shareKey}`);
      if (!res.ok) {
        throw new Error('Failed to fetch notes');
      }

      return res.json();
    },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Show Note</h1>
      </div>

      <div className="flex justify-center items-center mb-8">
        {isLoading && <p>Loading...</p>}
        {error && <p>Note retrieval error</p>}
      </div>
      {note && <NoteCard key={note.id} note={note} />}
    </main>
  );
}
