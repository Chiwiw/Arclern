import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Skill {
  _id: string;
  title: string;
  category: string;
  level: string;
  current_progress: number;
  goal_progress: number;
  notes?: string;
}

interface SkillCardProps {
  skill: Skill;
  onDelete: (id: string) => void;
}

const levelColors: Record<string, BadgeProps['variant']> = {
  beginner: 'info',
  intermediate: 'warning',
  advanced: 'success',
};

const SkillCard = ({ skill, onDelete }: SkillCardProps) => {
  const navigate = useNavigate();

  const getLevelVariant = (level: string): BadgeProps['variant'] => {
    return levelColors[level] ?? 'secondary';
  };

  const progressPercent = (skill.current_progress / skill.goal_progress) * 100;

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl">{skill.title}</CardTitle>
            <div className="flex gap-2 items-center">
              <Badge variant={getLevelVariant(skill.level)}>
                {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">{skill.category}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate(`/skills/edit/${skill._id}`)}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(skill._id)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{skill.current_progress}/{skill.goal_progress}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
        {skill.notes && (
          <CardDescription className="text-sm">{skill.notes}</CardDescription>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillCard;
