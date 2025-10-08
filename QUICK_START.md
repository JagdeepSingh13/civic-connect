# 🚀 Civic Connect - Quick Start Guide

This guide will help you get the Civic Connect application running in just a few steps!

## 📋 Prerequisites

Before you start, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **Git** (optional, for cloning)

## 🎯 Quick Setup (5 minutes)

### Step 1: Install Frontend Dependencies

```bash
# In the project root directory
npm install
```

### Step 2: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend
npm install
```

### Step 3: Set Up Environment Variables

**Backend Environment:**

```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your settings
# At minimum, set these values:
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civic-connect
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend Environment:**
Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 4: Start MongoDB

**Option A: Local MongoDB**

```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or on macOS/Linux
sudo systemctl start mongod
```

**Option B: Docker MongoDB**

```bash
# Start MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

**Option C: MongoDB Atlas (Cloud)**

- Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a cluster
- Get connection string and update `MONGODB_URI` in backend `.env`

### Step 5: Seed the Database (Optional but Recommended)

```bash
# In the backend directory
cd backend
npm run seed
```

This creates test users:

- **Admin**: `admin@civicconnect.com` / `AdminPass123`
- **Staff**: `staff@civicconnect.com` / `StaffPass123`
- **Citizen**: `john@example.com` / `CitizenPass123`

### Step 6: Start the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
# In project root
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🎉 You're Ready!

1. Open `http://localhost:3000` in your browser
2. Click "Login" to test with seeded accounts
3. File a complaint and see it in the dashboard!

## 🔧 Troubleshooting

### Backend Won't Start?

- Check if MongoDB is running: `mongosh` or `mongo`
- Verify `MONGODB_URI` in `backend/.env`
- Check port 5000 is available

### Frontend Can't Connect?

- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Look for CORS errors in browser console

### Database Issues?

- Test MongoDB connection: `mongosh mongodb://localhost:27017/civic-connect`
- Check MongoDB service is running
- Try restarting MongoDB

## 🐳 Alternative: Docker Setup

If you prefer Docker:

```bash
# Start everything with Docker
cd backend
docker-compose up -d

# Start frontend separately
cd ..
npm run dev
```

## 📱 Features to Test

1. **Register/Login**: Create account or use test accounts
2. **File Complaint**: Submit a new civic issue
3. **View Dashboard**: See all complaints with status updates
4. **Public Log**: View transparency report
5. **Admin Functions**: Login as admin to update statuses

## 🆘 Need Help?

- Check the console for error messages
- Verify all environment variables are set
- Ensure both frontend and backend are running
- Test API directly: `curl http://localhost:5000/health`

## 🚀 Production Deployment

For production:

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Set up MongoDB Atlas
4. Deploy to cloud platforms (Heroku, Vercel, etc.)

---

**That's it!** Your Civic Connect application should now be running. 🎉
