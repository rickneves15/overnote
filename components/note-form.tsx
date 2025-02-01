'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import { Editor } from './editor';
import { NoteData } from './note-card';

interface NoteFormProps {
  note?: NoteData;
  onClose?: () => void;
}

export function NoteForm({ note, onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState(note?.content || null);
  const [isPublic, setIsPublic] = useState(note?.isPublic || false);
  const noteId = note?.id;

  const { toast } = useToast();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        noteId ? `/api/note/${noteId}` : '/api/notes',
        {
          method: noteId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            isPublic,
          }),
        },
      );

      if (!response.ok) throw new Error('Failed to save note');
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: 'Success!',
        description: 'Your note has been saved.',
      });
      onClose?.();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save note. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Content</Label>
        <Editor note={note} onChange={setContent} />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
        <Label htmlFor="public">Make this note public</Label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Note'}
      </Button>
    </form>
  );
}
