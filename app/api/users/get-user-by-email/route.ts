import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Ambil body dari request
    const body = await request.json();
    const { email } = body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Failed to fetch user', error: error.message }, { status: 500 });
  }
}
