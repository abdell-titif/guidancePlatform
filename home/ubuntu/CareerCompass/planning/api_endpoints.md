# API Endpoints Documentation

## Base URL
```
/api/v1
```

## Authentication Endpoints

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string",
    "dateOfBirth": "date",
    "role": "string" // "student", "counselor", "admin"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "userId": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string",
      "token": "string"
    }
  }
  ```

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "userId": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string",
      "token": "string"
    }
  }
  ```

### Logout
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Description**: Logout a user
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

### Refresh Token
- **URL**: `/auth/refresh-token`
- **Method**: `POST`
- **Description**: Get a new access token using refresh token
- **Headers**: `Authorization: Bearer {refresh_token}`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Token refreshed",
    "data": {
      "token": "string"
    }
  }
  ```

### Reset Password Request
- **URL**: `/auth/reset-password-request`
- **Method**: `POST`
- **Description**: Request a password reset
- **Request Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset email sent"
  }
  ```

### Reset Password
- **URL**: `/auth/reset-password`
- **Method**: `POST`
- **Description**: Reset password with token
- **Request Body**:
  ```json
  {
    "token": "string",
    "newPassword": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset successful"
  }
  ```

## User Profile Endpoints

### Get User Profile
- **URL**: `/users/profile`
- **Method**: `GET`
- **Description**: Get current user's profile
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "userId": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "profile": {
        "educationLevel": "string",
        "currentInstitution": "string",
        "graduationYear": "number",
        "location": {
          "country": "string",
          "state": "string",
          "city": "string"
        },
        "bio": "string",
        "profilePicture": "string"
      },
      "academicProfile": {
        "grades": [],
        "standardizedTests": [],
        "gpa": {},
        "majors": [],
        "minors": [],
        "certificates": []
      },
      "interests": [],
      "skills": [],
      "careerGoals": [],
      "preferences": {}
    }
  }
  ```

### Update User Profile
- **URL**: `/users/profile`
- **Method**: `PUT`
- **Description**: Update current user's profile
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "profile": {
      "educationLevel": "string",
      "currentInstitution": "string",
      "graduationYear": "number",
      "location": {
        "country": "string",
        "state": "string",
        "city": "string"
      },
      "bio": "string",
      "profilePicture": "string"
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "profile": {}
    }
  }
  ```

### Update Academic Profile
- **URL**: `/users/academic-profile`
- **Method**: `PUT`
- **Description**: Update user's academic profile
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "academicProfile": {
      "grades": [
        {
          "subject": "string",
          "grade": "string",
          "level": "string",
          "year": "number"
        }
      ],
      "standardizedTests": [
        {
          "name": "string",
          "score": "number",
          "date": "date"
        }
      ],
      "gpa": {
        "value": "number",
        "scale": "number"
      },
      "majors": ["string"],
      "minors": ["string"],
      "certificates": [
        {
          "name": "string",
          "issuer": "string",
          "date": "date",
          "url": "string"
        }
      ]
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Academic profile updated successfully",
    "data": {
      "academicProfile": {}
    }
  }
  ```

### Update Interests
- **URL**: `/users/interests`
- **Method**: `PUT`
- **Description**: Update user's interests
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "interests": [
      {
        "category": "string",
        "subcategories": ["string"],
        "strengthOfInterest": "number"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Interests updated successfully",
    "data": {
      "interests": []
    }
  }
  ```

### Update Skills
- **URL**: `/users/skills`
- **Method**: `PUT`
- **Description**: Update user's skills
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "skills": [
      {
        "name": "string",
        "category": "string",
        "proficiencyLevel": "number",
        "yearsOfExperience": "number"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Skills updated successfully",
    "data": {
      "skills": []
    }
  }
  ```

### Update Career Goals
- **URL**: `/users/career-goals`
- **Method**: `PUT`
- **Description**: Update user's career goals
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "careerGoals": [
      {
        "title": "string",
        "industry": "string",
        "priority": "number",
        "timeframe": "string"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Career goals updated successfully",
    "data": {
      "careerGoals": []
    }
  }
  ```

### Update Preferences
- **URL**: `/users/preferences`
- **Method**: `PUT`
- **Description**: Update user's preferences
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "preferences": {
      "locationPreferences": ["string"],
      "workEnvironmentPreferences": ["string"],
      "salaryExpectations": {
        "minimum": "number",
        "preferred": "number",
        "currency": "string"
      },
      "workLifeBalanceImportance": "number",
      "companySize": ["string"],
      "industryPreferences": ["string"]
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Preferences updated successfully",
    "data": {
      "preferences": {}
    }
  }
  ```

### Update User Settings
- **URL**: `/users/settings`
- **Method**: `PUT`
- **Description**: Update user's settings
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "settings": {
      "notifications": {
        "email": "boolean",
        "push": "boolean",
        "frequency": "string"
      },
      "privacy": {
        "profileVisibility": "string",
        "dataSharing": "boolean"
      },
      "theme": "string",
      "language": "string"
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Settings updated successfully",
    "data": {
      "settings": {}
    }
  }
  ```

## Recommendation Endpoints

### Get Personalized Recommendations
- **URL**: `/recommendations`
- **Method**: `GET`
- **Description**: Get personalized recommendations for the user
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `type`: `string` (optional) - Filter by recommendation type ("career", "education", "skill")
  - `limit`: `number` (optional) - Limit the number of results
  - `offset`: `number` (optional) - Offset for pagination
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "recommendations": [
        {
          "id": "string",
          "type": "string",
          "title": "string",
          "description": "string",
          "relevanceScore": "number",
          "dateGenerated": "date",
          "details": {}
        }
      ],
      "pagination": {
        "total": "number",
        "limit": "number",
        "offset": "number"
      }
    }
  }
  ```

### Get Recommendation Details
- **URL**: `/recommendations/:id`
- **Method**: `GET`
- **Description**: Get detailed information about a specific recommendation
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "type": "string",
      "title": "string",
      "description": "string",
      "relevanceScore": "number",
      "dateGenerated": "date",
      "status": "string",
      "feedback": {},
      "details": {}
    }
  }
  ```

### Update Recommendation Status
- **URL**: `/recommendations/:id/status`
- **Method**: `PUT`
- **Description**: Update the status of a recommendation
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "status": "string" // "active", "dismissed", "saved", "completed"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Recommendation status updated",
    "data": {
      "id": "string",
      "status": "string"
    }
  }
  ```

### Provide Recommendation Feedback
- **URL**: `/recommendations/:id/feedback`
- **Method**: `POST`
- **Description**: Provide feedback on a recommendation
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "rating": "number",
    "comments": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Feedback submitted",
    "data": {
      "id": "string",
      "feedback": {
        "rating": "number",
        "comments": "string"
      }
    }
  }
  ```

## Education Data Endpoints

### Search Educational Institutions
- **URL**: `/education/institutions`
- **Method**: `GET`
- **Description**: Search for educational institutions
- **Query Parameters**:
  - `query`: `string` (optional) - Search term
  - `type`: `string` (optional) - Institution type
  - `location`: `string` (optional) - Location
  - `limit`: `number` (optional) - Limit the number of results
  - `offset`: `number` (optional) - Offset for pagination
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "institutions": [
        {
          "id": "string",
          "name": "string",
          "type": "string",
          "location": {
            "country": "string",
            "state": "string",
            "city": "string"
          },
          "ranking": {},
          "admissions": {
            "acceptanceRate": "number"
          },
          "website": "string"
        }
      ],
      "pagination": {
        "total": "number",
        "limit": "number",
        "offset": "number"
      }
    }
  }
  ```

### Get Institution Details
- **URL**: `/education/institutions/:id`
- **Method**: `GET`
- **Description**: Get detailed information about an educational institution
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "type": "string",
      "location": {},
      "accreditation": [],
      "ranking": {},
      "admissions": {},
      "programs": [],
      "facilities": [],
      "studentLife": {},
      "reviews": [],
      "images": [],
      "website": "string",
      "contactInfo": {}
    }
  }
  ```

### Search Programs
- **URL**: `/education/programs`
- **Method**: `GET`
- **Description**: Search for educational programs
- **Query Parameters**:
  - `query`: `string` (optional) - Search term
  - `degree`: `string` (optional) - Degree type
  - `field`: `string` (optional) - Field of study
  - `institution`: `string` (optional) - Institution ID
  - `format`: `string` (optional) - Program format
  - `limit`: `number` (optional) - Limit the number of results
  - `offset`: `number` (optional) - Offset for pagination
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "programs": [
        {
          "id": "string",
          "name": "string",
          "degree": "string",
          "institution": {
            "id": "string",
            "name": "string"
          },
          "duration": {},
          "format": [],
          "tuition": {}
        }
      ],
      "pagination": {
        "total": "number",
        "limit": "number",
        "offset": "number"
      }
    }
  }
  ```

### Get Program Details
- **URL**: `/education/programs/:id`
- **Method**: `GET`
- **Description**: Get detailed information about an educational program
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "degree": "string",
      "department": "string",
      "description": "string",
      "institution": {
        "id": "string",
        "name": "string"
      },
      "duration": {},
      "format": [],
      "credits": "number",
      "curriculum": [],
      "outcomes": {},
      "employmentStats": {},
      "tuition": {},
      "financialAid": {}
    }
  }
  ```

## Career Data Endpoints

### Search Careers
- **URL**: `/careers`
- **Method**: `GET`
- **Description**: Search for careers
- **Query Parameters**:
  - `query`: `string` (optional) - Search term
  - `category`: `string` (optional) - Career category
  - `industry`: `string` (optional) - Industry
  - `educationLevel`: `string` (optional) - Required education level
  - `skills`: `string` (optional) - Required skills (comma-separated)
  - `limit`: `number` (optional) - Limit the number of results
  - `offset`: `number` (optional) - Offset for pagination
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "careers": [
        {
          "id": "string",
          "title": "string",
          "category": "string",
          "industries": [],
          "educationRequirements": [],
          "salaryInfo": [
            {
              "median": "number",
              "currency": "string"
            }
          ],
          "jobGrowth": {
            "rate": "number"
          }
        }
      ],
      "pagination": {
        "total": "number",
        "limit": "number",
        "offset": "number"
      }
    }
  }
  ```

### Get Career Details
- **URL**: `/careers/:id`
- **Method**: `GET`
- **Description**: Get detailed information about a career
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "title": "string",
      "alternativeTitles": [],
      "description": "string",
      "category": "string",
      "subcategories": [],
      "industries": [],
      "functions": [],
      "educationRequirements": [],
      "skillRequirements": [],
      "experienceRequirements": {},
      "certifications": [],
      "careerPath": {},
      "salaryInfo": [],
      "jobGrowth": {},
      "workEnvironment": {},
      "dayInTheLife": "string",
      "prosAndCons": {},
      "relatedCareers": [],
      "notableProfessionals": [],
      "resources": [],
      "marketData": {}
    }
  }
  ```

### Search Skills
- **URL**: `/skills`
- **Method**: `GET`
- **Description**: Search for skills
- **Query Parameters**:
  - `query`: `string` (optional) - Search t<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>