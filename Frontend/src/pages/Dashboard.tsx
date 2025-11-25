import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { skillsAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import SkillCard from '@/components/SkillCard';
import { Plus, LogOut, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface Skill {
  _id: string;
  title: string;
  category: string;
  level: string;
  current_progress: number;
  goal_progress: number;
  notes?: string;
  last_activity: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      // backend responds with { success, data: skills }
      const skills = response.data?.data ?? response.data;
      setSkills(skills);
    } catch (error: unknown) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await skillsAPI.delete(id);
      setSkills(skills.filter(skill => skill._id !== id));
      toast.success('Skill deleted successfully');
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Arclern</h1>
              <p className="text-sm text-muted-foreground">Hello, {user?.username}!</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">My Skills</h2>
            <p className="text-muted-foreground">Track your learning progress</p>
          </div>
          <Button onClick={() => navigate('/skills/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </div>

        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16">
            <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No skills yet</h3>
            <p className="mb-4 text-muted-foreground">Start tracking your learning journey</p>
            <Button onClick={() => navigate('/skills/add')}>
              <Plus className="mr-2 h-4 w-4" />
              Add your first skill
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <SkillCard key={skill._id} skill={skill} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
