import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { skillsAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Skill {
  _id: string;
  title: string;
  category: string;
  level: string;
  current_progress: number;
  goal_progress: number;
  notes?: string;
}

const EditSkill = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    level: 'beginner',
    current_progress: 0,
    goal_progress: 100,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await skillsAPI.getAll();
        // backend responds with { success, data: skill[] }
        const skills = response.data?.data ?? response.data;
        const skill = skills.find((s: Skill) => s._id === id);

        if (skill) {
          setFormData({
            title: skill.title,
            category: skill.category,
            level: skill.level,
            current_progress: skill.current_progress,
            goal_progress: skill.goal_progress,
            notes: skill.notes || '',
          });
        } else {
          toast.error('Skill not found');
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to load skill');
        navigate('/dashboard');
      } finally {
        setFetching(false);
      }
    };

    fetchSkill();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await skillsAPI.update(id!, formData);
      toast.success('Skill updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to update skill');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Skill</CardTitle>
            <CardDescription>Update your skill progress</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Skill Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., React, TypeScript, UI Design"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Frontend, Backend, Design"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Current Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current_progress">Current Progress</Label>
                  <Input
                    id="current_progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.current_progress}
                    onChange={(e) => setFormData({ ...formData, current_progress: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal_progress">Goal Progress</Label>
                  <Input
                    id="goal_progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.goal_progress}
                    onChange={(e) => setFormData({ ...formData, goal_progress: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="What are you learning? What's your goal?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Skill'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditSkill;
