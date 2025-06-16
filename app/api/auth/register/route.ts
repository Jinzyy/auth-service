import { NextRequest, NextResponse } from 'next/server';
import { getUsers, saveUsers, getUserByEmail } from '@/lib/db';
import { generateId } from '@/lib/auth';
import { User } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!['student', 'teacher'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const users = getUsers();
    const newUser: User = {
      id: generateId(),
      email,
      name,
      role: role as 'student' | 'teacher',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return NextResponse.json({ 
      success: true, 
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}