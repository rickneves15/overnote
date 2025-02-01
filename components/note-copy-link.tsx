'use client';

import { useState } from 'react';
import { NoteData } from './note-card';
import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';

export function NoteCopyLink({ note }: { note: NoteData }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const baseUrl = window.location.href.split('/').slice(0, 3).join('/');
    const link = `${baseUrl}/notes/${note.shareKey}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast({
      title: 'Copied to clipboard!',
      description: 'You can now share this link with others.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button asChild>
      <a href="#" onClick={copyLink}>
        {copied ? 'Link copied!' : 'Copy link'}
        <span className="sr-only"> (copy link)</span>
      </a>
    </Button>
  );
}
