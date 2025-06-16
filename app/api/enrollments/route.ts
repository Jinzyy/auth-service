import { NextRequest, NextResponse } from 'next/server';
import { getEnrollments, saveEnrollments, getUserById, getClasses, getClassById } from '@/lib/db';
import { generateId } from '@/lib/auth';
import { Enrollment } from '@/lib/types';

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
    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { classCode } = await request.json();

    if (!classCode) {
      return NextResponse.json({ error: 'Class code is required' }, { status: 400 });
    }

    const classes = getClasses();
    const targetClass = classes.find(cls => cls.code === classCode.toUpperCase());
    
    if (!targetClass) {
      return NextResponse.json({ error: 'Invalid class code' }, { status: 404 });
    }

    const enrollments = getEnrollments();
    const existingEnrollment = enrollments.find(
      enrollment => enrollment.studentId === user.id && enrollment.classId === targetClass.id
    );

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this class' }, { status: 409 });
    }

    const newEnrollment: Enrollment = {
      id: generateId(),
      studentId: user.id,
      classId: targetClass.id,
      enrolledAt: new Date().toISOString()
    };

    enrollments.push(newEnrollment);
    saveEnrollments(enrollments);

    return NextResponse.json({ success: true, enrollment: newEnrollment, class: targetClass });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}