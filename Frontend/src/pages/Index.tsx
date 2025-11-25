import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Target, TrendingUp, BookOpen } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Arclern</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign in
            </Button>
            <Button onClick={() => navigate('/register')}>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            Track Your Learning Journey
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Arclern helps you document and visualize your skill development progress. Stay motivated
            and never lose track of what you're learning.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/register')}>
              Start Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign in
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 text-center transition-all hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Set Clear Goals</h3>
            <p className="text-muted-foreground">
              Define your skill levels and track progress from Beginner to Expert
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 text-center transition-all hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Track Progress</h3>
            <p className="text-muted-foreground">
              Document your learning journey with notes and level updates
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 text-center transition-all hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <BookOpen className="h-6 w-6 text-success" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Stay Organized</h3>
            <p className="text-muted-foreground">
              Keep all your skills in one private, organized dashboard
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
