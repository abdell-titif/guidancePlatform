# CareerCompass - Deployment Guide

## Overview

This guide provides instructions for deploying the CareerCompass platform in various environments. It covers both development and production deployments, with specific instructions for each component of the system.

## Prerequisites

Before deploying CareerCompass, ensure you have the following:

- Node.js (v16.x or later)
- MongoDB (v5.0 or later)
- npm or yarn package manager
- Git for version control
- Access to cloud hosting (for production)

## Local Development Environment

### Frontend Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/careercompass/frontend.git
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api/v1
   REACT_APP_NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   The frontend will be available at http://localhost:3000

### Backend Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/careercompass/backend.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/careercompass
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The API will be available at http://localhost:5000

## Production Deployment

### Frontend Production Build

1. **Create optimized build**
   ```bash
   npm run build
   ```
   This creates a `build` directory with production-ready files.

2. **Serve the build**
   You can serve the static files using any web server:
   ```bash
   npx serve -s build
   ```
   
   Or deploy to a static hosting service like Netlify, Vercel, or AWS S3.

### Backend Production Deployment

#### Option 1: Traditional Server Deployment

1. **Prepare the server**
   - Set up a Linux server (Ubuntu recommended)
   - Install Node.js, npm, and MongoDB
   - Configure firewall to allow necessary ports

2. **Deploy the code**
   ```bash
   git clone https://github.com/careercompass/backend.git
   cd backend
   npm install --production
   ```

3. **Configure environment variables**
   Create a `.env` file with production settings:
   ```
   PORT=5000
   MONGODB_URI=mongodb://your_production_mongodb_uri
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRE=30d
   NODE_ENV=production
   ```

4. **Set up process manager**
   Install PM2 to manage the Node.js process:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name careercompass-api
   pm2 startup
   pm2 save
   ```

5. **Set up reverse proxy**
   Configure Nginx as a reverse proxy:
   ```
   server {
       listen 80;
       server_name api.careercompass.app;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Set up SSL**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.careercompass.app
   ```

#### Option 2: Containerized Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 5000
   CMD ["node", "src/server.js"]
   ```

2. **Build and run Docker container**
   ```bash
   docker build -t careercompass-api .
   docker run -p 5000:5000 --env-file .env -d careercompass-api
   ```

3. **Deploy with Docker Compose**
   Create `docker-compose.yml`:
   ```yaml
   version: '3'
   services:
     api:
       build: .
       ports:
         - "5000:5000"
       env_file: .env
       restart: always
       depends_on:
         - mongo
     mongo:
       image: mongo:5
       volumes:
         - mongo-data:/data/db
       restart: always
   volumes:
     mongo-data:
   ```

   Run with:
   ```bash
   docker-compose up -d
   ```

#### Option 3: Cloud Platform Deployment

1. **Deploy to Heroku**
   ```bash
   heroku create careercompass-api
   heroku config:set JWT_SECRET=your_secure_jwt_secret JWT_EXPIRE=30d
   git push heroku main
   ```

2. **Deploy to AWS Elastic Beanstalk**
   - Create `Procfile` with `web: node src/server.js`
   - Use the Elastic Beanstalk CLI:
   ```bash
   eb init
   eb create careercompass-production
   eb deploy
   ```

## Database Setup

### MongoDB Atlas Setup

1. **Create MongoDB Atlas account**
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a new project

2. **Create a cluster**
   - Choose cloud provider and region
   - Select cluster tier (M0 is free)
   - Name your cluster

3. **Configure database access**
   - Create a database user with password
   - Add IP access list entries (0.0.0.0/0 for all IPs)

4. **Get connection string**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update environment variables**
   - Set `MONGODB_URI` to your connection string

### Initial Data Setup

1. **Run database seeder**
   ```bash
   node src/utils/seeder.js
   ```
   This will populate the database with initial data for:
   - Sample educational programs
   - Career information
   - Skill definitions
   - Market insights

## Monitoring and Maintenance

### Setting Up Monitoring

1. **Install monitoring tools**
   ```bash
   npm install --save winston morgan
   ```

2. **Configure application logging**
   - Set up Winston for structured logging
   - Use Morgan for HTTP request logging

3. **Set up external monitoring**
   - Create account on New Relic, Datadog, or similar
   - Install their Node.js agent
   - Configure alerts for critical issues

### Backup Procedures

1. **MongoDB Atlas backups**
   - Enable automated backups in Atlas
   - Configure backup schedule and retention

2. **Manual database dumps**
   ```bash
   mongodump --uri="your_mongodb_uri" --out=backup_directory
   ```

3. **Restore from backup**
   ```bash
   mongorestore --uri="your_mongodb_uri" backup_directory
   ```

## Scaling Considerations

### Horizontal Scaling

1. **Load balancing**
   - Set up multiple API instances
   - Configure load balancer (e.g., Nginx, AWS ELB)
   - Ensure session persistence if needed

2. **Database scaling**
   - Increase MongoDB Atlas tier
   - Consider sharding for very large datasets
   - Implement read replicas for read-heavy workloads

### Performance Optimization

1. **Implement caching**
   - Add Redis for caching frequent queries
   - Configure CDN for static assets
   - Use browser caching for frontend resources

2. **Code optimization**
   - Enable compression middleware
   - Optimize database queries
   - Implement pagination for large result sets

## Troubleshooting

### Common Issues

1. **Connection issues**
   - Check network connectivity
   - Verify MongoDB connection string
   - Ensure correct port configuration

2. **Performance problems**
   - Check server resource utilization
   - Look for slow database queries
   - Monitor API response times

3. **Authentication failures**
   - Verify JWT secret configuration
   - Check token expiration settings
   - Ensure correct CORS configuration

### Logging and Debugging

1. **Access logs**
   - Check application logs for errors
   - Review HTTP request logs
   - Monitor database operation logs

2. **Debugging in production**
   - Enable detailed logging temporarily
   - Use application performance monitoring
   - Implement feature flags for testing

## Security Considerations

1. **Regular updates**
   - Keep Node.js and npm packages updated
   - Apply security patches promptly
   - Review dependencies for vulnerabilities

2. **Security best practices**
   - Implement rate limiting
   - Use HTTPS for all connections
   - Configure secure HTTP headers
   - Implement proper authentication and authorization

3. **Data protection**
   - Encrypt sensitive data
   - Implement proper access controls
   - Regular security audits

## Conclusion

This deployment guide provides the foundation for successfully deploying and maintaining the CareerCompass platform. Adapt these instructions to your specific infrastructure and requirements as needed.

For additional support or questions about deployment, contact the development team or refer to the technical documentation.
