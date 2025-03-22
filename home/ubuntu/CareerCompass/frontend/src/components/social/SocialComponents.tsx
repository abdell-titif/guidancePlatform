import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';

interface SocialShareProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    type: 'education' | 'career' | 'skill';
    date: string;
    image?: string;
  };
  platforms: {
    id: string;
    name: string;
    icon: string;
    connected: boolean;
  }[];
  onShare: (achievementId: string, platforms: string[], visibility: string, customMessage: string) => void;
  onConnectPlatform: (platformId: string) => void;
}

const SocialShareComponent: React.FC<SocialShareProps> = ({
  achievement,
  platforms,
  onShare,
  onConnectPlatform
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>([]);
  const [visibility, setVisibility] = React.useState('connections');
  const [customMessage, setCustomMessage] = React.useState('');
  
  const handlePlatformToggle = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };
  
  const handleShare = () => {
    onShare(achievement.id, selectedPlatforms, visibility, customMessage);
  };
  
  const visibilityOptions = [
    { value: 'public', label: 'Public - Anyone can see' },
    { value: 'connections', label: 'Connections - Only your connections can see' },
    { value: 'private', label: 'Private - Only you can see' }
  ];
  
  const getTypeLabel = (type: 'education' | 'career' | 'skill') => {
    switch (type) {
      case 'education':
        return 'Educational Achievement';
      case 'career':
        return 'Career Milestone';
      case 'skill':
        return 'Skill Achievement';
      default:
        return 'Achievement';
    }
  };
  
  const getTypeColor = (type: 'education' | 'career' | 'skill') => {
    switch (type) {
      case 'education':
        return 'bg-purple-100 text-purple-800';
      case 'career':
        return 'bg-blue-100 text-blue-800';
      case 'skill':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Share Your Achievement</CardTitle>
        <CardDescription>
          Share your achievement with your network and on social media
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {achievement.image ? (
                  <img 
                    src={achievement.image} 
                    alt={achievement.title} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className={getTypeColor(achievement.type)}>
                        {getTypeLabel(achievement.type)}
                      </Badge>
                      <h3 className="font-medium text-lg mt-2">{achievement.title}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.date}
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{achievement.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Share on</h3>
            <div className="grid grid-cols-3 gap-4">
              {platforms.map(platform => (
                <div 
                  key={platform.id} 
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
                    selectedPlatforms.includes(platform.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    if (platform.connected) {
                      handlePlatformToggle(platform.id);
                    } else {
                      onConnectPlatform(platform.id);
                    }
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 flex items-center justify-center mb-2">
                      <img 
                        src={platform.icon} 
                        alt={platform.name} 
                        className="w-8 h-8"
                      />
                    </div>
                    <div className="font-medium">{platform.name}</div>
                    {!platform.connected && (
                      <span className="text-xs text-muted-foreground mt-1">Not connected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Visibility</h3>
            <Select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              options={visibilityOptions}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Add a custom message (optional)</h3>
            <Textarea
              placeholder="Write something about this achievement..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleShare}
              disabled={selectedPlatforms.length === 0}
            >
              Share Achievement
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface SocialActivityFeedProps {
  activities: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profilePicture?: string;
    };
    type: 'achievement' | 'milestone' | 'question' | 'recommendation';
    content: {
      title: string;
      description: string;
      referenceType?: string;
      referenceId?: string;
    };
    timestamp: string;
    likes: number;
    comments: number;
    userInteraction: {
      liked: boolean;
      commented: boolean;
      saved: boolean;
    };
  }[];
  onLike: (activityId: string) => void;
  onComment: (activityId: string, comment: string) => void;
  onSave: (activityId: string) => void;
  onViewDetails: (activityId: string) => void;
  onViewProfile: (userId: string) => void;
}

const SocialActivityFeed: React.FC<SocialActivityFeedProps> = ({
  activities,
  onLike,
  onComment,
  onSave,
  onViewDetails,
  onViewProfile
}) => {
  const [commentText, setCommentText] = React.useState<Record<string, string>>({});
  
  const handleCommentSubmit = (activityId: string) => {
    if (commentText[activityId]?.trim()) {
      onComment(activityId, commentText[activityId]);
      setCommentText(prev => ({ ...prev, [activityId]: '' }));
    }
  };
  
  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        );
      case 'milestone':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"/>
            <path d="M12 13v8"/>
            <path d="M12 3v3"/>
          </svg>
        );
      case 'question':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
        );
      case 'recommendation':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="m9 11-6 6v3h9l3-3"/>
            <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>
          See what your connections are sharing and achieving
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length > 0 ? (
            activities.map(activity => (
              <Card key={activity.id} className="w-full">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar 
                        src={activity.user.profilePicture} 
                        alt={`${activity.user.firstName} ${activity.user.lastName}`}
                        fallback={`${activity.user.firstName[0]}${activity.user.lastName[0]}`}
                        className="cursor-pointer"
                        onClick={() => onViewProfile(activity.user.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span 
                            className="font-medium cursor-pointer hover:underline"
                            onClick={() => onViewProfile(activity.user.id)}
                          >
                            {activity.user.firstName} {activity.user.lastName}
                          </span>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <span>•</span>
                            {getActivityTypeIcon(activity.type)}
                            <span className="text-xs">{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className="cursor-pointer"
                      onClick={() => onViewDetails(activity.id)}
                    >
                      <h3 className="font-medium text-lg">{activity.content.title}</h3>
                      <p className="mt-1 text-sm">{activity.content.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-4">
                        <button 
                          className={`flex items-center space-x-1 text-sm ${activity.userInteraction.liked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                          onClick={() => onLike(activity.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={activity.userInteraction.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 10v12"/>
                            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
                          </svg>
                          <span>{activity.likes}</span>
                        </button>
                        <button 
                          className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            const commentInput = document.getElementById(`comment-${activity.id}`);
                            if (commentInput) {
                              commentInput.focus();
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          <span>{activity.comments}</span>
                        </button>
                      </div>
                      <button 
                        className={`flex items-center space-x-1 text-sm ${activity.userInteraction.saved ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => onSave(activity.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={activity.userInteraction.saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                        </svg>
                        <span>Save</span>
                      </button>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex space-x-2">
                        <Avatar 
                          size="sm"
                          fallback="Me"
                        />
                        <div className="flex-1 flex space-x-2">
                          <Textarea
                            id={`comment-${activity.id}`}
                            placeholder="Write a comment..."
                            className="min-h-[40px] py-2"
                            value={commentText[activity.id] || ''}
                            onChange={(e) => setCommentText(prev => ({ ...prev, [activity.id]: e.target.value <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>