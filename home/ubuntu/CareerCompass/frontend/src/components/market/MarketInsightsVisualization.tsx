import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';

// Mock chart component - in a real app, you would use a charting library like Recharts
const BarChart = ({ data, xAxis, yAxis }) => {
  return (
    <div className="w-full h-64 bg-gray-50 rounded-md p-4 border">
      <div className="text-center text-sm text-muted-foreground">
        Bar Chart Visualization: {xAxis} vs {yAxis}
      </div>
      <div className="flex flex-col h-48 justify-end space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-24 text-xs truncate">{item[xAxis]}</div>
            <div 
              className="h-8 bg-primary rounded-sm" 
              style={{ width: `${(item[yAxis] / Math.max(...data.map(d => d[yAxis]))) * 70}%` }}
            />
            <div className="text-xs">{item[yAxis]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mock line chart component
const LineChart = ({ data, xAxis, yAxis }) => {
  return (
    <div className="w-full h-64 bg-gray-50 rounded-md p-4 border">
      <div className="text-center text-sm text-muted-foreground">
        Line Chart Visualization: {xAxis} vs {yAxis} over time
      </div>
      <div className="h-48 flex items-center justify-center">
        <svg width="90%" height="80%" viewBox="0 0 100 50">
          <polyline
            points={data.map((item, index) => `${index * (100 / (data.length - 1))},${50 - (item[yAxis] / Math.max(...data.map(d => d[yAxis]))) * 45}`).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />
          {data.map((item, index) => (
            <circle
              key={index}
              cx={index * (100 / (data.length - 1))}
              cy={50 - (item[yAxis] / Math.max(...data.map(d => d[yAxis]))) * 45}
              r="2"
              className="fill-primary"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

interface MarketInsightsVisualizationProps {
  jobMarketData: {
    industry: string;
    jobGrowth: number;
    averageSalary: number;
    jobPostings: number;
    region: string;
    date: string;
  }[];
  skillDemandData: {
    skill: string;
    demandScore: number;
    growthRate: number;
    salaryImpact: number;
    industry: string;
  }[];
  salaryTrendsData: {
    role: string;
    year: number;
    salary: number;
    industry: string;
  }[];
  topEmployersData: {
    company: string;
    industry: string;
    jobCount: number;
    averageSalary: number;
  }[];
}

const MarketInsightsVisualization: React.FC<MarketInsightsVisualizationProps> = ({
  jobMarketData,
  skillDemandData,
  salaryTrendsData,
  topEmployersData
}) => {
  const [industryFilter, setIndustryFilter] = React.useState('all');
  const [regionFilter, setRegionFilter] = React.useState('all');
  
  // Extract unique industries and regions for filters
  const industries = ['all', ...new Set(jobMarketData.map(item => item.industry))];
  const regions = ['all', ...new Set(jobMarketData.map(item => item.region))];
  
  const industryOptions = industries.map(industry => ({
    value: industry,
    label: industry === 'all' ? 'All Industries' : industry
  }));
  
  const regionOptions = regions.map(region => ({
    value: region,
    label: region === 'all' ? 'All Regions' : region
  }));
  
  // Filter data based on selected filters
  const filteredJobMarketData = jobMarketData.filter(item => 
    (industryFilter === 'all' || item.industry === industryFilter) &&
    (regionFilter === 'all' || item.region === regionFilter)
  );
  
  const filteredSkillDemandData = skillDemandData.filter(item => 
    (industryFilter === 'all' || item.industry === industryFilter)
  );
  
  const filteredSalaryTrendsData = salaryTrendsData.filter(item => 
    (industryFilter === 'all' || item.industry === industryFilter)
  );
  
  const filteredTopEmployersData = topEmployersData.filter(item => 
    (industryFilter === 'all' || item.industry === industryFilter)
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Insights</CardTitle>
        <CardDescription>
          Explore current job market trends, in-demand skills, and salary information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="text-sm text-muted-foreground">
              Filter market data by industry and region
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                options={industryOptions}
              />
              <Select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                options={regionOptions}
              />
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills Demand</TabsTrigger>
              <TabsTrigger value="salaries">Salary Trends</TabsTrigger>
              <TabsTrigger value="employers">Top Employers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Job Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredJobMarketData.length > 0 ? (
                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          {(filteredJobMarketData.reduce((sum, item) => sum + item.jobGrowth, 0) / filteredJobMarketData.length).toFixed(1)}%
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Average Growth Rate</p>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">No data available</div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Salary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredJobMarketData.length > 0 ? (
                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          ${Math.round(filteredJobMarketData.reduce((sum, item) => sum + item.averageSalary, 0) / filteredJobMarketData.length).toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Annual Salary</p>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">No data available</div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Job Postings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredJobMarketData.length > 0 ? (
                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          {filteredJobMarketData.reduce((sum, item) => sum + item.jobPostings, 0).toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Active Listings</p>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">No data available</div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Job Growth by Industry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredJobMarketData.length > 0 ? (
                      <BarChart 
                        data={filteredJobMarketData}
                        xAxis="industry"
                        yAxis="jobGrowth"
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Salary by Region</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredJobMarketData.length > 0 ? (
                      <BarChart 
                        data={filteredJobMarketData}
                        xAxis="region"
                        yAxis="averageSalary"
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="skills" className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Top In-Demand Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredSkillDemandData.length > 0 ? (
                      <div className="space-y-4">
                        {filteredSkillDemandData
                          .sort((a, b) => b.demandScore - a.demandScore)
                          .slice(0, 5)
                          .map((skill, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{skill.skill}</span>
                                <Badge variant={skill.growthRate > 10 ? 'success' : 'secondary'}>
                                  {skill.growthRate > 0 ? '+' : ''}{skill.growthRate}%
                                </Badge>
                              </div>
                              <Progress 
                                value={skill.demandScore} 
                                max={100} 
                                size="sm"
                              />
                              <div className="text-xs text-muted-foreground">
                                Salary Impact: +${skill.salaryImpact.toLocaleString()}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Skill Demand by Industry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredSkillDemandData.length > 0 ? (
                      <BarChart 
                        data={filteredSkillDemandData}
                        xAxis="skill"
                        yAxis="demandScore"
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Skill Growth Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredSkillDemandData
                      .sort((a, b) => b.growthRate - a.growthRate)
                      .slice(0, 3)
                      .map((skill, index) => (
                        <div key={index} className="p-4 border rounded-md">
                          <div className="font-medium">{skill.skill}</div>
                          <div className="text-2xl font-bold mt-2">
                            {skill.growthRate > 0 ? '+' : ''}{skill.growthRate}%
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Growth Rate
                          </div>
                          <div className="mt-4">
                            <div className="text-sm font-medium">Demand Score</div>
                            <Progress 
                              value={skill.demandScore} 
                              max={100} 
                              size="sm"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="salaries" className="mt-4 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Salary Trends Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredSalaryTrendsData.length > 0 ? (
                    <LineChart 
                      data={filteredSalaryTrendsData}
                      xAxis="year"
                      yAxis="salary"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Salary by Role</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredSalaryTrendsData.length > 0 ? (
                      <BarChart 
                        data={filteredSalaryTrendsData.filter(item => item.ye<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>