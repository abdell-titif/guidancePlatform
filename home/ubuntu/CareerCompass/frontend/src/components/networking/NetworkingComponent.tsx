import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';

interface ConnectionCardProps {
  connection: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    headline: string;
    currentPosition?: string;
    currentInstitution?: string;
    connectionType: 'professional' | 'peer' | 'mentor' | 'alumni';
    mutualConnections: number;
    isConnected: boolean;
  };
  onConnect: (id: string) => void;
  onMessage: (id: string) => void;
  onViewProfile: (id: string) => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  onConnect,
  onMessage,
  onViewProfile
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar 
            src={connection.profilePicture} 
            alt={`${connection.firstName} ${connection.lastName}`}
            size="lg"
            fallback={`${connection.firstName[0]}${connection.lastName[0]}`}
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">
                  {connection.firstName} {connection.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{connection.headline}</p>
              </div>
              <Badge variant={
                connection.connectionType === 'professional' ? 'default' :
                connection.connectionType === 'mentor' ? 'success' :
                connection.connectionType === 'alumni' ? 'secondary' : 'outline'
              }>
                {connection.connectionType.charAt(0).toUpperCase() + connection.connectionType.slice(1)}
              </Badge>
            </div>
            
            {(connection.currentPosition || connection.currentInstitution) && (
              <div className="mt-2">
                {connection.currentPosition && (
                  <p className="text-sm">{connection.currentPosition}</p>
                )}
                {connection.currentInstitution && (
                  <p className="text-sm text-muted-foreground">{connection.currentInstitution}</p>
                )}
              </div>
            )}
            
            <div className="mt-2 text-xs text-muted-foreground">
              {connection.mutualConnections > 0 ? (
                <span>{connection.mutualConnections} mutual connection{connection.mutualConnections !== 1 ? 's' : ''}</span>
              ) : (
                <span>No mutual connections</span>
              )}
            </div>
            
            <div className="mt-4 flex space-x-2">
              <Button 
                variant={connection.isConnected ? "secondary" : "default"}
                size="sm"
                onClick={() => onConnect(connection.id)}
              >
                {connection.isConnected ? "Connected" : "Connect"}
              </Button>
              {connection.isConnected && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onMessage(connection.id)}
                >
                  Message
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewProfile(connection.id)}
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface NetworkingComponentProps {
  connections: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    headline: string;
    currentPosition?: string;
    currentInstitution?: string;
    connectionType: 'professional' | 'peer' | 'mentor' | 'alumni';
    mutualConnections: number;
    isConnected: boolean;
  }[];
  suggestions: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    headline: string;
    currentPosition?: string;
    currentInstitution?: string;
    connectionType: 'professional' | 'peer' | 'mentor' | 'alumni';
    mutualConnections: number;
    relevanceReason: string;
    isConnected: boolean;
  }[];
  pendingRequests: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    headline: string;
    message?: string;
    sentAt: string;
  }[];
  onConnect: (id: string) => void;
  onMessage: (id: string) => void;
  onViewProfile: (id: string) => void;
  onAcceptRequest: (id: string) => void;
  onDeclineRequest: (id: string) => void;
  onSearch: (query: string) => void;
}

const NetworkingComponent: React.FC<NetworkingComponentProps> = ({
  connections,
  suggestions,
  pendingRequests,
  onConnect,
  onMessage,
  onViewProfile,
  onAcceptRequest,
  onDeclineRequest,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Networking</CardTitle>
        <CardDescription>
          Connect with professionals, peers, mentors, and alumni in your field of interest
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              placeholder="Search for people by name, institution, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
          
          <Tabs defaultValue="connections" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="connections">My Connections</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="requests">
                Requests
                {pendingRequests.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="connections" className="mt-4">
              {connections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connections.map(connection => (
                    <ConnectionCard
                      key={connection.id}
                      connection={connection}
                      onConnect={onConnect}
                      onMessage={onMessage}
                      onViewProfile={onViewProfile}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    You don't have any connections yet. Check out the suggestions tab to find people to connect with.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="suggestions" className="mt-4">
              {suggestions.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestions.map(suggestion => (
                      <Card key={suggestion.id} className="w-full">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar 
                              src={suggestion.profilePicture} 
                              alt={`${suggestion.firstName} ${suggestion.lastName}`}
                              size="lg"
                              fallback={`${suggestion.firstName[0]}${suggestion.lastName[0]}`}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-lg">
                                    {suggestion.firstName} {suggestion.lastName}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{suggestion.headline}</p>
                                </div>
                                <Badge variant={
                                  suggestion.connectionType === 'professional' ? 'default' :
                                  suggestion.connectionType === 'mentor' ? 'success' :
                                  suggestion.connectionType === 'alumni' ? 'secondary' : 'outline'
                                }>
                                  {suggestion.connectionType.charAt(0).toUpperCase() + suggestion.connectionType.slice(1)}
                                </Badge>
                              </div>
                              
                              {(suggestion.currentPosition || suggestion.currentInstitution) && (
                                <div className="mt-2">
                                  {suggestion.currentPosition && (
                                    <p className="text-sm">{suggestion.currentPosition}</p>
                                  )}
                                  {suggestion.currentInstitution && (
                                    <p className="text-sm text-muted-foreground">{suggestion.currentInstitution}</p>
                                  )}
                                </div>
                              )}
                              
                              <div className="mt-2 text-xs">
                                <span className="text-muted-foreground">
                                  {suggestion.mutualConnections > 0 ? (
                                    <span>{suggestion.mutualConnections} mutual connection{suggestion.mutualConnections !== 1 ? 's' : ''}</span>
                                  ) : (
                                    <span>No mutual connections</span>
                                  )}
                                </span>
                                <p className="mt-1 text-sm italic">
                                  {suggestion.relevanceReason}
                                </p>
                              </div>
                              
                              <div className="mt-4 flex space-x-2">
                                <Button 
                                  size="sm"
                                  onClick={() => onConnect(suggestion.id)}
                                >
                                  Connect
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => onViewProfile(suggestion.id)}
                                >
                                  View Profile
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No suggestions available at the moment. Complete your profile to get personalized connection suggestions.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="requests" className="mt-4">
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map(request => (
                    <Card key={request.id} className="w-full">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar 
                            src={request.profilePicture} 
                            alt={`${request.firstName} ${request.lastName}`}
                            size="lg"
                            fallback={`${request.firstName[0]}${request.lastName[0]}`}
                          />
                          <div className="flex-1">
                            <div>
                              <h3 className="font-medium text-lg">
                                {request.firstName} {request.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground">{request.headline}</p>
                            </div>
                            
                            {request.message && (
                              <div className="mt-2 p-3 bg-muted rounded-md">
                                <p className="text-sm italic">"{request.message}"</p>
                              </div>
                            )}
                            
                            <div className="mt-2 text-xs text-muted-foreground">
                              Received {request.sentAt}
                            </div>
                            
                            <div className="mt-4 flex space-x-2">
                              <Button 
                                onClick={() => onAcceptRequest(request.id)}
                              >
                                Accept
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => onDeclineRequest(request.id)}
                              >
                                Decline
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => onViewProfile(request.id)}
                              >
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    You don't have any pending connection requests.
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

export default NetworkingComponent;
