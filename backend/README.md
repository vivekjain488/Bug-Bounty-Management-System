# Bug Bounty Management System - Backend

This is the backend API for the Bug Bounty Management System.

## Features

- **Authentication**: JWT-based authentication for multiple user roles (Researchers, Companies, Triage Team)
- **User Management**: Support for different user types with role-specific fields
- **Report Management**: Submit, review, and track bug bounty reports
- **Program Management**: Create and manage bug bounty programs
- **Security**: Password hashing with bcrypt, JWT tokens for authentication

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Installation

1. **Install backend dependencies**:
```bash
cd backend
npm install
```

2. **Set up environment variables**:
Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bug-bounty-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

For MongoDB Atlas (cloud), update `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bug-bounty-management
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/me` - Update user profile (requires auth)
- `DELETE /api/auth/me` - Delete account (requires auth)

### Reports (`/api/reports`)
- `GET /api/reports` - Get all reports (role-based filtering)
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Submit new report (requires auth)
- `PUT /api/reports/:id` - Update report (requires auth)
- `PUT /api/reports/:id/status` - Update report status (triage/company only)
- `DELETE /api/reports/:id` - Delete report (requires auth)
- `GET /api/reports/stats/my` - Get report statistics (requires auth)

### Programs (`/api/programs`)
- `GET /api/programs` - Get all programs
- `GET /api/programs/:id` - Get single program
- `POST /api/programs` - Create program (company only)
- `PUT /api/programs/:id` - Update program (owner only)
- `DELETE /api/programs/:id` - Delete program (owner only)
- `GET /api/programs/company/my` - Get company's programs (company only)

## Database Models

### User
- Supports three roles: `user`, `company`, `triage`
- Role-specific fields based on user type
- Password is automatically hashed before saving

### Report
- Links to user (submitter) and company/program
- Status tracking (Pending, In Review, Accepted, Rejected, etc.)
- Reward and feedback fields

### Program
- Bug bounty programs created by companies
- Reward structure, scope, and rules
- Statistics tracking

## User Roles

### User (Researcher)
- Submit bug reports
- Track own reports and earnings
- View available programs

### Company
- Create bug bounty programs
- View reports submitted to their programs
- Review and accept/reject reports
- Track bounty payments

### Triage Team
- Review all reports
- Update report status
- Provide feedback to researchers

## Authentication Flow

1. User signs up or logs in
2. Server returns JWT token
3. Frontend stores token in localStorage
4. All authenticated requests include: `Authorization: Bearer <token>`
5. Backend validates token on protected routes

## Frontend Configuration

Update your frontend's `.env` or Vite config to point to the backend:

```env
VITE_API_URL=http://localhost:3000/api
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/bug-bounty-management |
| `JWT_SECRET` | Secret key for JWT tokens | (required) |
| `NODE_ENV` | Environment (development/production) | development |

## Testing the API

You can test the API using tools like Postman or curl:

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","fullName":"Test User","username":"testuser","role":"user"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

## Production Deployment

1. Set a strong `JWT_SECRET` in production
2. Use MongoDB Atlas or a managed MongoDB service
3. Enable CORS for your frontend domain only
4. Use environment variables for sensitive data
5. Enable HTTPS
6. Set up proper logging and monitoring

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `MONGODB_URI` is correct

### CORS Errors
- The backend already includes CORS middleware
- For production, configure CORS for specific domains

### Port Already in Use
- Change `PORT` in `.env` file
- Kill process using the port: `lsof -ti:3000 | xargs kill -9`

## License

ISC

