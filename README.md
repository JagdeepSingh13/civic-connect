# 🏛️ Civic Connect - Full Stack Application

A comprehensive civic complaint management system built with Next.js, Express.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB (v5.0+)
- npm or yarn

### Option 1: Automated Setup (Windows)

```bash
# Double-click start.bat or run:
start.bat
```

### Option 2: Automated Setup (Mac/Linux)

```bash
# Make executable and run:
chmod +x start.sh
./start.sh
```

### Option 3: Manual Setup

**1. Install Dependencies**

```bash
# Frontend dependencies (already installed)
npm install

# Backend dependencies (already installed)
cd backend
npm install
cd ..
```

**2. Set Up Environment Variables**

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civic-connect
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Create `.env.local` (frontend):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**3. Start MongoDB**

```bash
# Option A: Local MongoDB
# Start MongoDB service on your system

# Option B: Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Option C: MongoDB Atlas (Cloud)
# Create account and get connection string
```

**4. Seed Database (Optional)**

```bash
cd backend
npm run seed
cd ..
```

**5. Start Application**

Terminal 1 (Backend):

```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):

```bash
npm run dev
```

## 🎯 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## 👥 Test Accounts (After Seeding)

- **Admin**: `admin@civicconnect.com` / `AdminPass123`
- **Staff**: `staff@civicconnect.com` / `StaffPass123`
- **Citizen**: `john@example.com` / `CitizenPass123`

## 🎨 Features

### For Citizens

- ✅ User registration and authentication
- ✅ File civic complaints with images
- ✅ Track complaint status
- ✅ View public transparency log

### For Staff/Admin

- ✅ All citizen features
- ✅ Update complaint status
- ✅ Assign complaints to staff
- ✅ View comprehensive dashboard
- ✅ Manage user roles

### Public Features

- ✅ View all complaints (no login required)
- ✅ See transparency statistics
- ✅ Real-time data updates

## 🏗️ Architecture

### Frontend (Next.js)

- **Framework**: Next.js 14 with TypeScript
- **UI**: Radix UI + Tailwind CSS
- **State**: React Context API
- **API**: Custom API service with fetch

### Backend (Express.js)

- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Security**: Helmet, CORS, Rate limiting
- **File Upload**: Cloudinary integration

### Database

- **Primary**: MongoDB
- **Models**: User, Complaint
- **Features**: Full-text search, pagination, aggregation

## 📁 Project Structure

```
civic-connect/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── auth/              # Authentication components
│   └── ui/                # Reusable UI components
├── contexts/              # React Context providers
├── lib/                   # Utilities and API service
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── scripts/      # Database seeding
│   └── package.json
├── start.bat             # Windows startup script
├── start.sh              # Unix startup script
└── README.md
```

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev          # Start with nodemon
npm run build        # Build TypeScript
npm run seed         # Seed database
npm run lint         # Run ESLint
```

### Frontend Development

```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🐳 Docker Support

```bash
# Start with Docker Compose
cd backend
docker-compose up -d

# Start frontend separately
npm run dev
```

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Use MongoDB Atlas for database
3. Deploy to Heroku, AWS, or similar
4. Update CORS settings for production domain

### Frontend Deployment

1. Update `NEXT_PUBLIC_API_URL` to production backend
2. Deploy to Vercel, Netlify, or similar
3. Update CORS settings in backend

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Complaints

- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id/status` - Update status
- `GET /api/complaints/stats` - Get statistics

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**

- Check MongoDB is running
- Verify environment variables
- Check port 5000 is available

**Frontend can't connect:**

- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Look for CORS errors

**Database issues:**

- Test MongoDB connection
- Check `MONGODB_URI` in backend `.env`
- Try restarting MongoDB

### Debug Steps

1. Check console logs for errors
2. Verify all environment variables
3. Test API endpoints with curl/Postman
4. Check browser network tab

## 📝 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civic-connect
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Check environment variables
4. Review console logs
5. Test API endpoints directly

---

**Happy coding!** 🎉
