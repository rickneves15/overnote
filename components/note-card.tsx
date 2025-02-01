import { Note, User } from '@prisma/client';
import { Content } from '@tiptap/react';

import { Editor } from './editor';
import { useSession } from 'next-auth/react';
import { NoteCopyLink } from './note-copy-link';
import { EditNoteDialog } from './edit-note-dialog';

export interface NoteData extends Note {
  content: Content;
  author: User;
}

interface NoteCardProps {
  note: NoteData;
  readonly?: boolean;
}

export function NoteCard({ note, readonly = true }: NoteCardProps) {
  const { data: session } = useSession();

  return (
    <div className="bg-white rounded shadow-md p-4">
      <Editor
        note={note}
        readOnly={session?.user?.id !== note.authorId || readonly}
      />
      <div className="flex flex-row justify-between items-center mt-2">
        <div className="text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span>
              <b>Last updated</b>: {new Date(note.updatedAt).toLocaleString()}
            </span>
            <span>
              <b>Created by</b>: {note.author.name}
            </span>
            <span>{note.author.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {session?.user?.id === note.authorId && (
            <EditNoteDialog noteId={note.id} />
          )}
          {note.isPublic && <NoteCopyLink note={note} />}
        </div>
      </div>
    </div>
  );
}
