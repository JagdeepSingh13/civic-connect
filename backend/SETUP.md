# Civic Connect Backend Setup Guide

This guide will help you set up the Civic Connect backend API with MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your configuration
nano .env
```

**Required Environment Variables:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civic-connect
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Optional (for image uploads):**

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Using MongoDB locally:**

```bash
# Start MongoDB service
sudo systemctl start mongod

# Or using brew on macOS
brew services start mongodb-community
```

**Using Docker:**

```bash
# Start MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### 4. Seed the Database (Optional)

```bash
# Run the database seeding script
npm run seed
```

This will create:

- Admin user: `admin@civicconnect.com` / `AdminPass123`
- Staff user: `staff@civicconnect.com` / `StaffPass123`
- Citizen users: `john@example.com` / `CitizenPass123`
- Sample complaints for testing

### 5. Start the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Production Setup

### 1. Build the Application

```bash
npm run build
```

### 2. Start Production Server

```bash
npm start
```

## Docker Setup

### 1. Using Docker Compose (Recommended)

```bash
# Start all services (MongoDB + Backend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Manual Docker Build

```bash
# Build the image
npm run docker:build

# Run the container
docker run -p 5000:5000 civic-connect-backend
```

## API Testing

### Health Check

```bash
curl http://localhost:5000/health
```

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Create a Complaint

```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Complaint",
    "category": "Pothole",
    "description": "Test description",
    "location": "Test location"
  }'
```

## Database Management

### Connect to MongoDB

```bash
# Using MongoDB shell
mongosh civic-connect

# Or using MongoDB Compass
# Connect to: mongodb://localhost:27017/civic-connect
```

### Reset Database

```bash
# Drop all collections
mongosh civic-connect --eval "db.dropDatabase()"

# Re-seed the database
npm run seed
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check the MONGODB_URI in .env
   - Verify MongoDB is accessible on port 27017

2. **Port Already in Use**

   - Change the PORT in .env file
   - Kill the process using the port: `lsof -ti:5000 | xargs kill -9`

3. **JWT Token Issues**

   - Ensure JWT_SECRET is set in .env
   - Check token expiration time

4. **Image Upload Issues**
   - Configure Cloudinary credentials in .env
   - Check file size limits (5MB max)

### Logs and Debugging

```bash
# View application logs
npm run dev

# View Docker logs
docker-compose logs -f backend

# Check MongoDB logs
docker-compose logs -f mongodb
```

## Development Tips

1. **Hot Reload**: The development server automatically restarts on file changes
2. **TypeScript**: Use `npm run build` to check for TypeScript errors
3. **Linting**: Run `npm run lint` to check code quality
4. **Testing**: Use `npm test` to run the test suite

## API Documentation

Once the server is running, you can access:

- Health check: `GET /health`
- API root: `GET /`
- Authentication: `POST /api/auth/login`
- Complaints: `GET /api/complaints`

## Support

If you encounter any issues:

1. Check the logs for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check the API documentation for correct request formats
