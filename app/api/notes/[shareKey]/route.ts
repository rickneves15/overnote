import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { shareKey: string } },
) {
  try {
    const session = await auth();
    const { shareKey } = params;

    if (!shareKey) {
      return new Response('Invalid shared key', { status: 400 });
    }

    const note = await prisma.note.findFirst({
      where: {
        OR: [{ authorId: session?.user?.id }, { isPublic: true }],
        shareKey,
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
