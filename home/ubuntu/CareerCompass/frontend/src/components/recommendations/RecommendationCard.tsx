import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';

interface RecommendationCardProps {
  recommendation: {
    id: string;
    type: 'career' | 'education' | 'skill';
    title: string;
    description: string;
    relevanceScore: number;
    tags?: string[];
    details?: any;
  };
  onViewDetails: (id: string) => void;
  onSave: (id: string) => void;
  onDismiss: (id: string) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onViewDetails,
  onSave,
  onDismiss
}) => {
  const { id, type, title, description, relevanceScore, tags = [], details } = recommendation;
  
  const getTypeColor = () => {
    switch (type) {
      case 'career':
        return 'bg-blue-100 text-blue-800';
      case 'education':
        return 'bg-purple-100 text-purple-800';
      case 'skill':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeLabel = () => {
    switch (type) {
      case 'career':
        return 'Career Path';
      case 'education':
        return 'Education';
      case 'skill':
        return 'Skill Development';
      default:
        return 'Recommendation';
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={getTypeColor()}>
              {getTypeLabel()}
            </Badge>
            <CardTitle className="mt-2 text-xl">{title}</CardTitle>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Relevance</span>
            <span className="text-lg font-bold">{relevanceScore}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{description}</p>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {type === 'career' && details?.salaryInfo && (
            <div className="mt-2">
              <span className="text-sm font-medium">Avg. Salary: </span>
              <span className="text-sm">{details.salaryInfo.currency} {details.salaryInfo.median.toLocaleString()}/year</span>
            </div>
          )}
          
          {type === 'education' && details?.duration && (
            <div className="mt-2">
              <span className="text-sm font-medium">Duration: </span>
              <span className="text-sm">{details.duration.value} {details.duration.unit}</span>
            </div>
          )}
          
          {type === 'skill' && details?.marketValue && (
            <div className="mt-2">
              <span className="text-sm font-medium">Market Demand: </span>
              <Progress 
                value={details.marketValue.demandScore} 
                max={100} 
                size="sm" 
                className="mt-1"
              />
            </div>
          )}
          
          <div className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDismiss(id)}
            >
              Dismiss
            </Button>
            <div className="space-x-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => onSave(id)}
              >
                Save
              </Button>
              <Button 
                size="sm"
                onClick={() => onViewDetails(id)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
