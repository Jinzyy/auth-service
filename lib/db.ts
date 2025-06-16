import fs from 'fs';
import path from 'path';
import { User, Class, Assignment, Enrollment, Submission } from './types';

const DB_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const CLASSES_FILE = path.join(DB_DIR, 'classes.json');
const ASSIGNMENTS_FILE = path.join(DB_DIR, 'assignments.json');
const ENROLLMENTS_FILE = path.join(DB_DIR, 'enrollments.json');
const SUBMISSIONS_FILE = path.join(DB_DIR, 'submissions.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize files if they don't exist
const initializeFile = (filePath: string, defaultData: any[]) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

initializeFile(USERS_FILE, []);
initializeFile(CLASSES_FILE, []);
initializeFile(ASSIGNMENTS_FILE, []);
initializeFile(ENROLLMENTS_FILE, []);
initializeFile(SUBMISSIONS_FILE, []);

// Generic database operations
const readFile = <T>(filePath: string): T[] => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeFile = <T>(filePath: string, data: T[]) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// User operations
export const getUsers = (): User[] => readFile<User>(USERS_FILE);
export const saveUsers = (users: User[]) => writeFile(USERS_FILE, users);
export const getUserByEmail = (email: string): User | undefined => 
  getUsers().find(user => user.email === email);
export const getUserById = (id: string): User | undefined => 
  getUsers().find(user => user.id === id);

// Class operations
export const getClasses = (): Class[] => readFile<Class>(CLASSES_FILE);
export const saveClasses = (classes: Class[]) => writeFile(CLASSES_FILE, classes);
export const getClassById = (id: string): Class | undefined => 
  getClasses().find(cls => cls.id === id);
export const getClassesByTeacher = (teacherId: string): Class[] => 
  getClasses().filter(cls => cls.teacherId === teacherId);

// Assignment operations
export const getAssignments = (): Assignment[] => readFile<Assignment>(ASSIGNMENTS_FILE);
export const saveAssignments = (assignments: Assignment[]) => writeFile(ASSIGNMENTS_FILE, assignments);
export const getAssignmentsByClass = (classId: string): Assignment[] => 
  getAssignments().filter(assignment => assignment.classId === classId);

// Enrollment operations
export const getEnrollments = (): Enrollment[] => readFile<Enrollment>(ENROLLMENTS_FILE);
export const saveEnrollments = (enrollments: Enrollment[]) => writeFile(ENROLLMENTS_FILE, enrollments);
export const getEnrollmentsByStudent = (studentId: string): Enrollment[] => 
  getEnrollments().filter(enrollment => enrollment.studentId === studentId);
export const getEnrollmentsByClass = (classId: string): Enrollment[] => 
  getEnrollments().filter(enrollment => enrollment.classId === classId);

// Submission operations
export const getSubmissions = (): Submission[] => readFile<Submission>(SUBMISSIONS_FILE);
export const saveSubmissions = (submissions: Submission[]) => writeFile(SUBMISSIONS_FILE, submissions);
export const getSubmissionsByAssignment = (assignmentId: string): Submission[] => 
  getSubmissions().filter(submission => submission.assignmentId === assignmentId);
export const getSubmissionsByStudent = (studentId: string): Submission[] => 
  getSubmissions().filter(submission => submission.studentId === studentId);