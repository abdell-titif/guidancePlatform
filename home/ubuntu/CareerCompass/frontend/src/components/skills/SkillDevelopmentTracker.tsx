import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';

interface SkillProgressProps {
  skill: {
    id: string;
    name: string;
    category: string;
    proficiencyLevel: number;
    targetLevel: number;
    progress: number;
    learningResources: {
      id: string;
      title: string;
      provider: string;
      type: string;
      duration: {
        value: number;
        unit: string;
      };
      completed: boolean;
    }[];
  };
  onViewResources: (skillId: string) => void;
  onMarkResourceComplete: (skillId: string, resourceId: string) => void;
}

const SkillProgress: React.FC<SkillProgressProps> = ({
  skill,
  onViewResources,
  onMarkResourceComplete
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className="mb-2" variant={skill.category === 'technical' ? 'default' : 'secondary'}>
              {skill.category}
            </Badge>
            <CardTitle className="text-lg">{skill.name}</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Current Level</div>
            <div className="text-xl font-bold">{skill.proficiencyLevel}/5</div>
            <div className="text-xs text-muted-foreground">Target: {skill.targetLevel}/5</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{skill.progress}%</span>
            </div>
            <Progress value={skill.progress} max={100} />
          </div>
          
          {skill.learningResources.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Learning Resources</h4>
              {skill.learningResources.slice(0, 2).map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div>
                    <div className="font-medium">{resource.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {resource.provider} • {resource.type} • {resource.duration.value} {resource.duration.unit}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant={resource.completed ? "secondary" : "outline"}
                    onClick={() => onMarkResourceComplete(skill.id, resource.id)}
                  >
                    {resource.completed ? "Completed" : "Mark Complete"}
                  </Button>
                </div>
              ))}
              
              {skill.learningResources.length > 2 && (
                <Button 
                  variant="link" 
                  className="px-0"
                  onClick={() => onViewResources(skill.id)}
                >
                  View all {skill.learningResources.length} resources
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface SkillDevelopmentTrackerProps {
  skills: {
    id: string;
    name: string;
    category: string;
    proficiencyLevel: number;
    targetLevel: number;
    progress: number;
    learningResources: {
      id: string;
      title: string;
      provider: string;
      type: string;
      duration: {
        value: number;
        unit: string;
      };
      completed: boolean;
    }[];
  }[];
  onViewResources: (skillId: string) => void;
  onMarkResourceComplete: (skillId: string, resourceId: string) => void;
  onAddSkill: () => void;
}

const SkillDevelopmentTracker: React.FC<SkillDevelopmentTrackerProps> = ({
  skills,
  onViewResources,
  onMarkResourceComplete,
  onAddSkill
}) => {
  const technicalSkills = skills.filter(skill => skill.category === 'technical');
  const softSkills = skills.filter(skill => skill.category === 'soft');
  const domainSkills = skills.filter(skill => skill.category === 'domain-specific');
  
  const overallProgress = skills.length > 0
    ? Math.round(skills.reduce((sum, skill) => sum + skill.progress, 0) / skills.length)
    : 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Skill Development Tracker</CardTitle>
            <CardDescription>
              Track your progress and access learning resources to develop your skills
            </CardDescription>
          </div>
          <Button onClick={onAddSkill} className="mt-4 md:mt-0">
            Add New Skill
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} max={100} size="lg" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">{skills.length}</div>
                  <p className="text-sm text-muted-foreground">Total Skills</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {skills.reduce((sum, skill) => sum + skill.learningResources.filter(r => r.completed).length, 0)}
                    /
                    {skills.reduce((sum, skill) => sum + skill.learningResources.length, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All Skills</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="soft">Soft Skills</TabsTrigger>
              <TabsTrigger value="domain">Domain Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              {skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map(skill => (
                    <SkillProgress
                      key={skill.id}
                      skill={skill}
                      onViewResources={onViewResources}
                      onMarkResourceComplete={onMarkResourceComplete}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No skills added yet. Click "Add New Skill" to get started.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="technical" className="mt-4">
              {technicalSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {technicalSkills.map(skill => (
                    <SkillProgress
                      key={skill.id}
                      skill={skill}
                      onViewResources={onViewResources}
                      onMarkResourceComplete={onMarkResourceComplete}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No technical skills added yet.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="soft" className="mt-4">
              {softSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {softSkills.map(skill => (
                    <SkillProgress
                      key={skill.id}
                      skill={skill}
                      onViewResources={onViewResources}
                      onMarkResourceComplete={onMarkResourceComplete}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No soft skills added yet.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="domain" className="mt-4">
              {domainSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domainSkills.map(skill => (
                    <SkillProgress
                      key={skill.id}
                      skill={skill}
                      onViewResources={onViewResources}
                      onMarkResourceComplete={onMarkResourceComplete}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No domain-specific skills added yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillDevelopmentTracker;
