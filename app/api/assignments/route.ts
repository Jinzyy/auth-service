import { NextRequest, NextResponse } from 'next/server';
import { getAssignments, saveAssignments, getUserById, getClassById } from '@/lib/db';
import { generateId } from '@/lib/auth';
import { Assignment } from '@/lib/types';

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

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { classId, title, description, dueDate, maxPoints } = await request.json();

    if (!classId || !title || !description || !dueDate || !maxPoints) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const classInfo = getClassById(classId);
    if (!classInfo || classInfo.teacherId !== user.id) {
      return NextResponse.json({ error: 'Class not found or unauthorized' }, { status: 404 });
    }

    const assignments = getAssignments();
    const newAssignment: Assignment = {
      id: generateId(),
      classId,
      className: classInfo.name,
      title,
      description,
      dueDate,
      maxPoints: parseInt(maxPoints),
      createdAt: new Date().toISOString()
    };

    assignments.push(newAssignment);
    saveAssignments(assignments);

    return NextResponse.json({ success: true, assignment: newAssignment });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}