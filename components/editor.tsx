'use client';

import { useEditor, EditorContent, Content } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useState } from 'react';
import { EditorToolbar } from './editor-toolbar';
import { Loader2 } from 'lucide-react';
import { NoteData } from './note-card';
import { useQueryClient } from '@tanstack/react-query';

interface EditorProps {
  note?: NoteData;
  onChange?: (content: Content) => void;
  readOnly?: boolean;
}

export function Editor({ note, onChange, readOnly = false }: EditorProps) {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const noteId = note?.id || '';
  const content = note?.content || { type: 'doc', content: [] };

  const saveContent = useCallback(
    async (newContent: Content) => {
      if (!noteId) return;

      try {
        setIsSaving(true);
        const response = await fetch(`/api/note/${noteId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newContent,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save content');
        }
        queryClient.invalidateQueries({ queryKey: ['notes', noteId] });
      } catch (error) {
        console.error('Error saving content:', error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [noteId, queryClient],
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '', // Add fallback empty string
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[200px]',
      },
    },
    onUpdate: ({ editor }) => {
      if (editor) {
        const newContent = editor.getJSON();
        onChange?.(newContent);
        saveContent(newContent);
      }
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="prose max-w-none w-full relative">
      {!readOnly && editor && <EditorToolbar editor={editor} />}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="min-h-[200px] border rounded-lg p-4"
          onChange={() => {
            const newContent = editor?.getJSON();
            console.log(newContent);
          }}
        />
        {isSaving && (
          <div className="absolute top-2 right-2 flex items-center gap-2 text-sm text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </div>
        )}
      </div>
    </div>
  );
}
