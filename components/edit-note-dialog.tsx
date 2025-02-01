'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NoteForm } from './note-form';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';

export function EditNoteDialog({ noteId }: { noteId?: string }) {
  const [open, setOpen] = useState(false);

  const { data: note } = useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (noteId) {
        const res = await fetch(`/api/note/${noteId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch note');
        }

        return res.json();
      }
    },
    enabled: open === true,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Note</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        {open && <NoteForm note={note} onClose={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
