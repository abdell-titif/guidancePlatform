import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface ProfileFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, initialData = {} }) => {
  const [activeTab, setActiveTab] = React.useState('personal');
  
  const [formData, setFormData] = React.useState({
    // Personal Information
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    bio: initialData.bio || '',
    location: {
      country: initialData.location?.country || '',
      state: initialData.location?.state || '',
      city: initialData.location?.city || '',
    },
    
    // Academic Information
    educationLevel: initialData.educationLevel || '',
    currentInstitution: initialData.currentInstitution || '',
    graduationYear: initialData.graduationYear || '',
    gpa: initialData.gpa?.value || '',
    gpaScale: initialData.gpa?.scale || '4.0',
    majors: initialData.majors?.join(', ') || '',
    minors: initialData.minors?.join(', ') || '',
    
    // Career Goals
    careerGoals: initialData.careerGoals || [],
    
    // Skills & Interests
    skills: initialData.skills || [],
    interests: initialData.interests || [],
    
    // Preferences
    locationPreferences: initialData.preferences?.locationPreferences?.join(', ') || '',
    workEnvironmentPreferences: initialData.preferences?.workEnvironmentPreferences || [],
    salaryExpectations: {
      minimum: initialData.preferences?.salaryExpectations?.minimum || '',
      preferred: initialData.preferences?.salaryExpectations?.preferred || '',
      currency: initialData.preferences?.salaryExpectations?.currency || 'USD',
    },
    workLifeBalanceImportance: initialData.preferences?.workLifeBalanceImportance || 5,
    companySize: initialData.preferences?.companySize || [],
    industryPreferences: initialData.preferences?.industryPreferences?.join(', ') || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const educationLevelOptions = [
    { value: 'high_school', label: 'High School' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'graduate', label: 'Graduate' },
    { value: 'professional', label: 'Professional' },
  ];
  
  const gpaScaleOptions = [
    { value: '4.0', label: '4.0 Scale' },
    { value: '5.0', label: '5.0 Scale' },
    { value: '10.0', label: '10.0 Scale' },
    { value: '100', label: '100 Point Scale' },
  ];
  
  const workEnvironmentOptions = [
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'in-person', label: 'In-Person' },
  ];
  
  const companySizeOptions = [
    { value: 'startup', label: 'Startup' },
    { value: 'small', label: 'Small Business' },
    { value: 'medium', label: 'Medium Business' },
    { value: 'large', label: 'Large Corporation' },
    { value: 'enterprise', label: 'Enterprise' },
  ];
  
  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' },
    { value: 'AUD', label: 'AUD (A$)' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile information to get personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="career">Career Goals</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              
              <Textarea
                label="Bio"
                name="bio"
                placeholder="Tell us a bit about yourself..."
                value={formData.bio}
                onChange={handleChange}
              />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Location</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Country"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleChange}
                  />
                  <Input
                    label="State/Province"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleChange}
                  />
                  <Input
                    label="City"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="academic" className="space-y-4 mt-4">
              <Select
                label="Education Level"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                options={educationLevelOptions}
              />
              
              <Input
                label="Current Institution"
                name="currentInstitution"
                value={formData.currentInstitution}
                onChange={handleChange}
              />
              
              <Input
                label="Expected Graduation Year"
                name="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={handleChange}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="GPA"
                  name="gpa"
                  type="number"
                  step="0.01"
                  value={formData.gpa}
                  onChange={handleChange}
                />
                <Select
                  label="GPA Scale"
                  name="gpaScale"
                  value={formData.gpaScale}
                  onChange={handleChange}
                  options={gpaScaleOptions}
                />
              </div>
              
              <Input
                label="Majors"
                name="majors"
                placeholder="Separate multiple majors with commas"
                value={formData.majors}
                onChange={handleChange}
              />
              
              <Input
                label="Minors"
                name="minors"
                placeholder="Separate multiple minors with commas"
                value={formData.minors}
                onChange={handleChange}
              />
            </TabsContent>
            
            <TabsContent value="career" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Career Goals</h3>
                <p className="text-sm text-muted-foreground">
                  Add your career goals to get personalized recommendations
                </p>
                
                {formData.careerGoals.map((goal, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-md">
                    <Input
                      label="Title"
                      name={`careerGoals[${index}].title`}
                      value={goal.title}
                      onChange={(e) => {
                        const newGoals = [...formData.careerGoals];
                        newGoals[index].title = e.target.value;
                        setFormData(prev => ({ ...prev, careerGoals: newGoals }));
                      }}
                    />
                    <Input
                      label="Industry"
                      name={`careerGoals[${index}].industry`}
                      value={goal.industry}
                      onChange={(e) => {
                        const newGoals = [...formData.careerGoals];
                        newGoals[index].industry = e.target.value;
                        setFormData(prev => ({ ...prev, careerGoals: newGoals }));
                      }}
                    />
                    <Select
                      label="Timeframe"
                      name={`careerGoals[${index}].timeframe`}
                      value={goal.timeframe}
                      onChange={(e) => {
                        const newGoals = [...formData.careerGoals];
                        newGoals[index].timeframe = e.target.value;
                        setFormData(prev => ({ ...prev, careerGoals: newGoals }));
                      }}
                      options={[
                        { value: 'short_term', label: 'Short Term' },
                        { value: 'mid_term', label: 'Mid Term' },
                        { value: 'long_term', label: 'Long Term' },
                      ]}
                    />
                    <Button
                      variant="destructive"
                      className="col-span-3"
                      onClick={() => {
                        const newGoals = formData.careerGoals.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, careerGoals: newGoals }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      careerGoals: [
                        ...prev.careerGoals,
                        { title: '', industry: '', priority: 3, timeframe: 'mid_term' }
                      ]
                    }));
                  }}
                >
                  Add Career Goal
                </Button>
              </div>
              
              <div className="space-y-4 mt-8">
                <h3 className="text-sm font-medium">Skills & Interests</h3>
                <p className="text-sm text-muted-foreground">
                  Add your skills and interests to get better recommendations
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Skills</h4>
                    
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                        <Input
                          label="Skill Name"
                          name={`skills[${index}].name`}
                          value={skill.name}
                          onChange={(e) => {
                            const newSkills = [...formData.skills];
                            newSkills[index].name = e.target.value;
                            setFormData(prev => ({ ...prev, skills: newSkills }));
                          }}
                        />
                        <Select
                          label="Proficiency"
                          name={`skills[${index}].proficiencyLevel`}
                          value={skill.proficiencyLevel.toString()}
                          onChange={(e) => {
                            const newSkills = [...formData.skills];
                            newSkills[index].proficiencyLevel = parseInt(e.target.value);
                            setFormData(prev => ({ ...prev, skills: newSkills }));
                          }}
                          options={[
                            { value: '1', label: 'Beginner' },
                            { value: '2', label: 'Elementary' },
                            { value: '3', label: 'Intermediate' },
                            { value: '4', label: 'Advanced' },
                            { value: '5', label: 'Expert' },
                          ]}
                        />
                        <Button
                          variant="destructive"
                          className="col-span-2"
                          onClick={() => {
                            const newSkills = formData.skills.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, skills: newSkills }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          skills: [
                            ...prev.skills,
                            { name: '', category: 'technical', proficiencyLevel: 3, yearsOfExperience: 0 }
                          ]
                        }));
                      }}
                    >
                      Add Skill
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Interests</h4>
                    
                    {formData.interests.map((interest, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                        <Input
                          label="Interest Category"
                          name={`interests[${index}].category`}
                          value={interest.category}
                          onChange={(e) => {
                            const newInterests = [...formData.interests];
                            newInterests[index].category = e.target.value;
                            setFormData(prev => ({ ...prev, interests: newInterests }));
                          }<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>