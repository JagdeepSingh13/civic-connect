# Civic Connect - Full Stack Integration Guide

This guide will help you set up and run both the frontend and backend together.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env

# Edit .env file with your configuration
# At minimum, set:
# MONGODB_URI=mongodb://localhost:27017/civic-connect
# JWT_SECRET=your-super-secret-jwt-key-here

# Start MongoDB (if not already running)
# Using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or start your local MongoDB service

# Seed the database (optional but recommended)
npm run seed

# Start the backend server
npm run dev
```

The backend will be available at `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to project root (where package.json is)
cd ..

# Install dependencies
npm install

# Set up environment variables
cp env.local .env.local

# Start the frontend development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civic-connect
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000

# Optional: For image uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Update `MONGODB_URI` in backend `.env` file

### Option 2: Docker MongoDB

```bash
# Start MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or use docker-compose
cd backend
docker-compose up -d mongodb
```

### Option 3: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env` file

## 🧪 Testing the Integration

### 1. Test Backend API

```bash
# Health check
curl http://localhost:5000/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### 2. Test Frontend

1. Open `http://localhost:3000`
2. Click "Login" button
3. Register a new account or use seeded accounts:
   - Admin: `admin@civicconnect.com` / `AdminPass123`
   - Staff: `staff@civicconnect.com` / `StaffPass123`
   - Citizen: `john@example.com` / `CitizenPass123`

### 3. Test Full Flow

1. **File a Complaint**: Login and submit a complaint
2. **View Dashboard**: See all complaints with status updates
3. **Public Log**: View public transparency log
4. **Admin Functions**: Login as admin/staff to update complaint status

## 🐳 Docker Setup (Alternative)

### Run Everything with Docker

```bash
# Start backend with MongoDB
cd backend
docker-compose up -d

# Start frontend (in another terminal)
cd ..
npm run dev
```

## 🔍 Troubleshooting

### Common Issues

1. **Backend not starting**

   - Check if MongoDB is running
   - Verify environment variables
   - Check port 5000 is available

2. **Frontend can't connect to backend**

   - Verify `NEXT_PUBLIC_API_URL` in `.env.local`
   - Check backend is running on port 5000
   - Check CORS settings in backend

3. **Database connection issues**

   - Verify MongoDB is running
   - Check `MONGODB_URI` in backend `.env`
   - Try restarting MongoDB

4. **Authentication issues**
   - Check JWT_SECRET is set
   - Verify token is being sent in requests
   - Check browser localStorage for token

### Debug Steps

1. **Check Backend Logs**

   ```bash
   cd backend
   npm run dev
   # Look for connection messages
   ```

2. **Check Frontend Network Tab**

   - Open browser dev tools
   - Check Network tab for API calls
   - Look for CORS errors

3. **Test API Directly**

   ```bash
   # Test backend health
   curl http://localhost:5000/health

   # Test API endpoint
   curl http://localhost:5000/api/complaints
   ```

## 📱 Features Available

### For Citizens

- ✅ Register/Login
- ✅ File complaints
- ✅ View public log
- ✅ Track complaint status

### For Staff/Admin

- ✅ All citizen features
- ✅ Update complaint status
- ✅ Assign complaints
- ✅ View dashboard with all complaints
- ✅ Delete complaints (admin only)

### Public Features

- ✅ View public complaint log
- ✅ See transparency statistics
- ✅ No authentication required for public log

## 🚀 Production Deployment

### Backend Deployment

1. Set production environment variables
2. Use production MongoDB (Atlas recommended)
3. Deploy to cloud platform (Heroku, AWS, etc.)
4. Update CORS settings for production domain

### Frontend Deployment

1. Update `NEXT_PUBLIC_API_URL` to production backend URL
2. Deploy to Vercel, Netlify, or similar
3. Update CORS settings in backend

## 📊 Database Seeding

The backend includes a seeding script with test data:

```bash
cd backend
npm run seed
```

This creates:

- Admin user: `admin@civicconnect.com` / `AdminPass123`
- Staff user: `staff@civicconnect.com` / `StaffPass123`
- Citizen users: `john@example.com` / `CitizenPass123`
- Sample complaints for testing

## 🔐 Security Notes

- Change default JWT_SECRET in production
- Use HTTPS in production
- Set up proper CORS policies
- Use environment variables for sensitive data
- Consider rate limiting for production

## 📝 API Documentation

The backend API includes:

- Authentication endpoints (`/api/auth/*`)
- Complaint endpoints (`/api/complaints/*`)
- Health check (`/health`)

Full API documentation is available in the backend README.

## 🎯 Next Steps

1. **Customize**: Modify the UI/UX to your needs
2. **Add Features**: Implement additional functionality
3. **Deploy**: Set up production deployment
4. **Monitor**: Add logging and monitoring
5. **Scale**: Optimize for larger user base

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Check that both frontend and backend are running
4. Review the console logs for errors
5. Test API endpoints directly with curl/Postman
