export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
  code: string;
  schedule: string;
  semester: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classId: string;
  className: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  enrolledAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}