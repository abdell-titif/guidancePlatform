import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: {
    type: 'resource' | 'action' | 'question';
    text: string;
    payload?: any;
  }[];
  entities?: {
    type: string;
    id: string;
    name: string;
  }[];
}

interface ChatbotInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onSuggestionClick: (suggestion: any) => void;
  onEntityClick: (entity: any) => void;
  isLoading: boolean;
}

const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({
  messages,
  onSendMessage,
  onSuggestionClick,
  onEntityClick,
  isLoading
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };
  
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Avatar 
            fallback="AI"
            className="bg-primary text-primary-foreground"
          />
          <div>
            <CardTitle>Career Assistant</CardTitle>
            <CardDescription>
              Ask me anything about careers, education, or skills
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium">How can I help you today?</h3>
            <p className="text-muted-foreground mt-2">
              Ask me about career paths, educational programs, skill development, or job market insights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6 w-full max-w-md">
              <Button 
                variant="outline" 
                className="justify-start text-left"
                onClick={() => onSendMessage("What career paths match my skills?")}
              >
                What career paths match my skills?
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-left"
                onClick={() => onSendMessage("Recommend educational programs for me")}
              >
                Recommend educational programs
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-left"
                onClick={() => onSendMessage("What skills should I develop?")}
              >
                What skills should I develop?
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-left"
                onClick={() => onSendMessage("Show me job market trends")}
              >
                Show me job market trends
              </Button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar 
                      fallback="AI"
                      size="sm"
                      className="bg-primary text-primary-foreground"
                    />
                    <span className="font-medium">Career Assistant</span>
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp}
                </div>
                
                {message.role === 'assistant' && message.entities && message.entities.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.entities.map((entity, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => onEntityClick(entity)}
                      >
                        {entity.name}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium">Suggested next steps:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button 
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => onSuggestionClick(suggestion)}
                        >
                          {suggestion.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-muted">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={!inputValue.trim() || isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatbotInterface;
