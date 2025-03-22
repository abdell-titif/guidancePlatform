import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import RecommendationCard from './RecommendationCard';

interface RecommendationDashboardProps {
  recommendations: {
    id: string;
    type: 'career' | 'education' | 'skill';
    title: string;
    description: string;
    relevanceScore: number;
    tags?: string[];
    details?: any;
  }[];
  onViewDetails: (id: string) => void;
  onSave: (id: string) => void;
  onDismiss: (id: string) => void;
}

const RecommendationDashboard: React.FC<RecommendationDashboardProps> = ({
  recommendations,
  onViewDetails,
  onSave,
  onDismiss
}) => {
  const careerRecommendations = recommendations.filter(rec => rec.type === 'career');
  const educationRecommendations = recommendations.filter(rec => rec.type === 'education');
  const skillRecommendations = recommendations.filter(rec => rec.type === 'skill');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Personalized Recommendations</CardTitle>
        <CardDescription>
          Based on your profile, interests, and goals, we've curated these recommendations to help you succeed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="careers">Careers</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map(recommendation => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onViewDetails={onViewDetails}
                    onSave={onSave}
                    onDismiss={onDismiss}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Complete your profile to get personalized recommendations
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="careers" className="mt-4">
            {careerRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careerRecommendations.map(recommendation => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onViewDetails={onViewDetails}
                    onSave={onSave}
                    onDismiss={onDismiss}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No career recommendations available yet
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="education" className="mt-4">
            {educationRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {educationRecommendations.map(recommendation => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onViewDetails={onViewDetails}
                    onSave={onSave}
                    onDismiss={onDismiss}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No education recommendations available yet
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="skills" className="mt-4">
            {skillRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillRecommendations.map(recommendation => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onViewDetails={onViewDetails}
                    onSave={onSave}
                    onDismiss={onDismiss}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No skill recommendations available yet
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecommendationDashboard;
