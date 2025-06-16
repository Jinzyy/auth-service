import { NextRequest, NextResponse } from 'next/server';
import { getClasses, saveClasses, getUserById, getClassesByTeacher } from '@/lib/db';
import { generateId, generateClassCode } from '@/lib/auth';
import { Class } from '@/lib/types';

// Get current user from session
const getCurrentUser = async (request: NextRequest) => {
  const sessionCookie = request.cookies.get('session');
  if (!sessionCookie) return null;
  
  try {
    const session = JSON.parse(sessionCookie.value);
    return getUserById(session.userId);
  } catch {
    return null;
  }
};

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role === 'teacher') {
      const classes = getClassesByTeacher(user.id);
      return NextResponse.json({ classes });
    } else {
      const classes = getClasses();
      return NextResponse.json({ classes });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, schedule, semester } = await request.json();

    if (!name || !description || !schedule || !semester) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const classes = getClasses();
    const newClass: Class = {
      id: generateId(),
      name,
      description,
      teacherId: user.id,
      teacherName: user.name,
      code: generateClassCode(),
      schedule,
      semester,
      createdAt: new Date().toISOString()
    };

    classes.push(newClass);
    saveClasses(classes);

    return NextResponse.json({ success: true, class: newClass });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}