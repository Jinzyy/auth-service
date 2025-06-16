import { NextRequest, NextResponse } from 'next/server';
import { getUserById, getEnrollmentsByStudent, getClassById } from '@/lib/db';

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
    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enrollments = getEnrollmentsByStudent(user.id);
    const classes = enrollments.map(enrollment => {
      const classInfo = getClassById(enrollment.classId);
      return classInfo;
    }).filter(Boolean);

    return NextResponse.json({ classes });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}