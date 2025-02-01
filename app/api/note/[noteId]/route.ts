import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { noteId: string } },
) {
  try {
    const session = await auth();
    const { noteId } = params;

    if (!noteId) {
      return new Response('Invalid node id', { status: 400 });
    }

    const note = await prisma.note.findFirst({
      where: {
        OR: [{ authorId: session?.user?.id }, { isPublic: true }],
        id: noteId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
    });

    if (!note) {
      return new Response('Note not found', { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Note retrieval error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { noteId: string } },
) {
  try {
    const session = await auth();
    const { noteId } = params;

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (!noteId) {
      return new Response('Invalid node id', { status: 400 });
    }
    const { content, isPublic } = await req.json();

    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      return new Response('Note not found', { status: 404 });
    }

    if (note.authorId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const updatedNote = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        content,
        isPublic,
        shareKey: isPublic ? crypto.randomUUID() : null,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Note create error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
