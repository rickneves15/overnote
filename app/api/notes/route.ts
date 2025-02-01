import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();

    const notes = await prisma.note.findMany({
      where: session?.user?.id
        ? {
            OR: [{ authorId: session.user.id }, { isPublic: true }],
          }
        : { isPublic: true },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Note retrieval error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { content, isPublic } = await req.json();

    if (!content) {
      return new Response('Content is required', { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        content,
        isPublic,
        authorId: session.user.id,
        shareKey: isPublic ? crypto.randomUUID() : null,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Note create error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
