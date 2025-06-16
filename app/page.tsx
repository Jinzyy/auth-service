'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Users, Calendar, Award } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        // Redirect to appropriate dashboard
        router.push(data.user.role === 'teacher' ? '/teacher' : '/student');
      }
    } catch (error) {
      // User not authenticated, stay on landing page
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">EduSystem</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <GraduationCap className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Modern Academic
              <span className="text-primary block">Information System</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Streamline your educational workflow with our comprehensive platform for 
              teachers and students. Manage classes, assignments, and track academic progress all in one place.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Join as Student
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Join as Teacher
              </Button>
            </Link>
          </div>

          <div className="mt-12 text-sm text-muted-foreground">
            <p><strong>Quick Demo:</strong> Login with teacher@edu.com / teacher or student@edu.com / student</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Academic Success
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful tools designed for modern education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Class Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create and organize classes with ease. Teachers can set up courses, 
                  generate class codes, and manage enrollments.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Student Enrollment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Simple enrollment process using class codes. Students can easily 
                  join classes and access course materials.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Assignment Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create, assign, and track assignments with due dates. 
                  Keep students engaged and organized.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Progress Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor student progress and performance. View submissions 
                  and provide timely feedback.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Educational Experience?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of educators and students who are already using EduSystem 
            to enhance their academic journey.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-foreground font-medium">EduSystem</span>
            <span className="text-muted-foreground">- Modern Academic Management</span>
          </div>
        </div>
      </footer>
    </div>
  );
}