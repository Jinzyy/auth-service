'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, BookOpen, Users, Calendar, Hash, User } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
}

interface Class {
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

interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  enrolledAt: string;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [enrolledClasses, setEnrolledClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classCode, setClassCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchEnrolledClasses();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      if (data.user.role !== 'student') {
        router.push('/teacher');
        return;
      }
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrolledClasses = async () => {
    try {
      const response = await fetch('/api/student/classes');
      if (response.ok) {
        const data = await response.json();
        setEnrolledClasses(data.classes);
      }
    } catch (error) {
      console.error('Failed to fetch enrolled classes:', error);
    }
  };

  const handleEnrollInClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classCode })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Successfully enrolled in ${data.class.name}!`);
        setClassCode('');
        setIsEnrollOpen(false);
        fetchEnrolledClasses();
      } else {
        setError(data.error || 'Failed to enroll in class');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-muted-foreground">Your enrolled classes and assignments</p>
          </div>
          
          <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Enroll in Class</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enroll in Class</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEnrollInClass} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="classCode">Class Code</Label>
                  <Input
                    id="classCode"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="Enter 6-digit class code"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Ask your teacher for the class code
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEnrollOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Enroll</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledClasses.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{classItem.name}</span>
                </CardTitle>
                <CardDescription>{classItem.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{classItem.teacherName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{classItem.semester}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    className="w-full"
                    onClick={() => router.push(`/student/class/${classItem.id}`)}
                  >
                    View Class
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {enrolledClasses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No classes enrolled</h3>
            <p className="text-muted-foreground">Use a class code to enroll in your first class</p>
          </div>
        )}
      </div>
    </div>
  );
}