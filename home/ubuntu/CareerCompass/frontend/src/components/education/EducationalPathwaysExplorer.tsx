import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface EducationalPathwayCardProps {
  institution: {
    id: string;
    name: string;
    type: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
    ranking?: {
      rank: number;
      source: string;
    };
    accreditation: string[];
    logo?: string;
  };
  program: {
    id: string;
    name: string;
    degree: string;
    duration: {
      value: number;
      unit: string;
    };
    format: string[];
    tuition: {
      amount: number;
      currency: string;
      period: string;
    };
    employmentStats?: {
      employmentRate: number;
      averageStartingSalary: number;
    };
  };
  matchScore: number;
  onViewDetails: (institutionId: string, programId: string) => void;
}

const EducationalPathwayCard: React.FC<EducationalPathwayCardProps> = ({
  institution,
  program,
  matchScore,
  onViewDetails
}) => {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            {institution.logo ? (
              <img 
                src={institution.logo} 
                alt={institution.name} 
                className="w-12 h-12 object-contain"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                {institution.name.charAt(0)}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{program.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{institution.name}</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Match</span>
            <span className="text-lg font-bold">{matchScore}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Degree</p>
              <p className="font-medium">{program.degree}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{program.duration.value} {program.duration.unit}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Format</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {program.format.map((format, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {format}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{institution.location.city}, {institution.location.state}</p>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tuition</p>
                <p className="font-medium">
                  {program.tuition.currency} {program.tuition.amount.toLocaleString()} / {program.tuition.period}
                </p>
              </div>
              {program.employmentStats && (
                <div>
                  <p className="text-sm text-muted-foreground">Employment Rate</p>
                  <p className="font-medium">{program.employmentStats.employmentRate}%</p>
                </div>
              )}
            </div>
          </div>
          
          {institution.ranking && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                Ranked #{institution.ranking.rank}
              </Badge>
              <span className="text-xs text-muted-foreground">
                by {institution.ranking.source}
              </span>
            </div>
          )}
          
          <div className="flex justify-end pt-2">
            <Button 
              onClick={() => onViewDetails(institution.id, program.id)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface EducationalPathwaysExplorerProps {
  pathways: {
    institution: {
      id: string;
      name: string;
      type: string;
      location: {
        city: string;
        state: string;
        country: string;
      };
      ranking?: {
        rank: number;
        source: string;
      };
      accreditation: string[];
      logo?: string;
    };
    program: {
      id: string;
      name: string;
      degree: string;
      duration: {
        value: number;
        unit: string;
      };
      format: string[];
      tuition: {
        amount: number;
        currency: string;
        period: string;
      };
      employmentStats?: {
        employmentRate: number;
        averageStartingSalary: number;
      };
    };
    matchScore: number;
  }[];
  onViewDetails: (institutionId: string, programId: string) => void;
}

const EducationalPathwaysExplorer: React.FC<EducationalPathwaysExplorerProps> = ({
  pathways,
  onViewDetails
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    degree: '',
    format: '',
    location: '',
  });
  
  const degreeOptions = [
    { value: '', label: 'All Degrees' },
    { value: 'bachelor', label: 'Bachelor\'s' },
    { value: 'master', label: 'Master\'s' },
    { value: 'phd', label: 'PhD' },
    { value: 'certificate', label: 'Certificate' },
  ];
  
  const formatOptions = [
    { value: '', label: 'All Formats' },
    { value: 'in-person', label: 'In-Person' },
    { value: 'online', label: 'Online' },
    { value: 'hybrid', label: 'Hybrid' },
  ];
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const filteredPathways = pathways.filter(pathway => {
    // Search term filter
    if (searchTerm && !pathway.program.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !pathway.institution.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Degree filter
    if (filters.degree && !pathway.program.degree.toLowerCase().includes(filters.degree.toLowerCase())) {
      return false;
    }
    
    // Format filter
    if (filters.format && !pathway.program.format.some(f => f.toLowerCase().includes(filters.format.toLowerCase()))) {
      return false;
    }
    
    // Location filter
    if (filters.location && 
        !pathway.institution.location.city.toLowerCase().includes(filters.location.toLowerCase()) &&
        !pathway.institution.location.state.toLowerCase().includes(filters.location.toLowerCase()) &&
        !pathway.institution.location.country.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Educational Pathways Explorer</CardTitle>
        <CardDescription>
          Discover educational programs that align with your career goals and interests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search programs or institutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                name="degree"
                value={filters.degree}
                onChange={handleFilterChange}
                options={degreeOptions}
              />
              <Select
                name="format"
                value={filters.format}
                onChange={handleFilterChange}
                options={formatOptions}
              />
            </div>
          </div>
          
          {filteredPathways.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPathways.map((pathway, index) => (
                <EducationalPathwayCard
                  key={index}
                  institution={pathway.institution}
                  program={pathway.program}
                  matchScore={pathway.matchScore}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No educational pathways found matching your criteria
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationalPathwaysExplorer;
