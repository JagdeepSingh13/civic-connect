# Civic Connect Backend API

A comprehensive backend API for the Civic Connect application - a civic complaint management system that allows citizens to report and track civic issues.

## Features

- **User Authentication & Authorization**: JWT-based auth with role-based access control
- **Complaint Management**: Full CRUD operations for civic complaints
- **Image Upload**: Cloudinary integration for complaint evidence images
- **Real-time Status Updates**: Track complaint status (Pending, In Progress, Resolved)
- **Public Transparency**: Public log of all complaints for transparency
- **Advanced Filtering**: Search, filter, and pagination for complaints
- **Data Validation**: Comprehensive input validation and error handling
- **Security**: Rate limiting, CORS, helmet, and other security measures

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Image Processing**: Sharp
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Complaints

- `GET /api/complaints` - Get all complaints (with filtering & pagination)
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/:id` - Get complaint by ID
- `PUT /api/complaints/:id/status` - Update complaint status (Admin/Staff)
- `POST /api/complaints/:id/comments` - Add comment to complaint
- `DELETE /api/complaints/:id` - Delete complaint (Admin only)
- `GET /api/complaints/stats` - Get complaint statistics

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd civic-connect/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/civic-connect
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**

   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## Database Models

### User Model

```typescript
{
  name: string;
  email: string;
  password: string;
  role: 'citizen' | 'admin' | 'staff';
  phone?: string;
  address?: string;
  isActive: boolean;
  lastLogin?: Date;
}
```

### Complaint Model

```typescript
{
  title: string;
  category: string;
  description: string;
  location: string;
  image?: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdBy?: string;
  assignedTo?: string;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  comments: Array<{
    text: string;
    author: string;
    createdAt: Date;
  }>;
}
```

## API Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Create a complaint

```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Pothole on Main Street",
    "category": "Pothole",
    "description": "Large pothole causing traffic issues",
    "location": "Main Street, Downtown",
    "priority": "High"
  }'
```

### Get complaints with filtering

```bash
curl "http://localhost:5000/api/complaints?status=Pending&category=Pothole&page=1&limit=10"
```

## Environment Variables

| Variable                | Description               | Default                                 |
| ----------------------- | ------------------------- | --------------------------------------- |
| `PORT`                  | Server port               | 5000                                    |
| `NODE_ENV`              | Environment               | development                             |
| `MONGODB_URI`           | MongoDB connection string | mongodb://localhost:27017/civic-connect |
| `JWT_SECRET`            | JWT secret key            | -                                       |
| `JWT_EXPIRES_IN`        | JWT expiration time       | 7d                                      |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name     | -                                       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key        | -                                       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret     | -                                       |
| `FRONTEND_URL`          | Frontend URL for CORS     | http://localhost:3000                   |

## Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation for all inputs
- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different user roles

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm test` - Run tests

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── complaintController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── upload.ts
│   │   └── validation.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── Complaint.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   └── complaints.ts
│   └── server.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
