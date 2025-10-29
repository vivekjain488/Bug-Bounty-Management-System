# Backend Setup Guide

## Quick Start

Follow these steps to set up and run the Bug Bounty Management System with backend:

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bug-bounty-management
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bug-bounty-management
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 4. Run the Backend

```bash
cd backend
npm run dev  # Development mode with auto-reload
# or
npm start    # Production mode
```

The backend API will run on `http://localhost:3000`

### 5. Run the Frontend

```bash
# In a new terminal
cd ..  # Go back to project root
npm run dev
```

The frontend will run on `http://localhost:5173`

## What Changed

### New Files Created:
- **Backend Server** (`backend/`)
  - `server.js` - Express server setup
  - `models/` - User, Report, Program schemas
  - `routes/` - API endpoints
  - `middleware/` - Authentication middleware
  
- **API Utilities** (`src/utils/api.js`)
  - Centralized API client with axios
  - Automatic token management
  - Error handling

### Modified Files:
- `src/utils/auth.js` - Now uses API instead of localStorage
- `src/utils/reports.js` - Now uses API instead of localStorage  
- `src/utils/programs.js` - Now uses API instead of localStorage
- `src/pages/MyReports.jsx` - Updated to handle async calls
- `src/pages/CompanyDashboard.jsx` - Updated to handle async calls

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `DELETE /api/auth/me` - Delete account

### Reports
- `GET /api/reports` - Get all reports (role-based)
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Submit report
- `PUT /api/reports/:id` - Update report
- `PUT /api/reports/:id/status` - Update status (triage/company)
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/stats/my` - Get stats

### Programs
- `GET /api/programs` - Get all programs
- `GET /api/programs/:id` - Get single program
- `POST /api/programs` - Create program (company only)
- `PUT /api/programs/:id` - Update program
- `DELETE /api/programs/:id` - Delete program
- `GET /api/programs/company/my` - Get my programs

## Testing

### 1. Test with Demo Accounts

The system no longer stores data in localStorage. You need to:
1. Sign up new accounts through the UI
2. Or seed the database with demo accounts

### 2. Test API with curl

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"demo@researcher.com",
    "password":"demo123",
    "username":"demo_researcher",
    "fullName":"Demo Researcher",
    "role":"user"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"demo@researcher.com",
    "password":"demo123"
  }'

# Get token from response and use it:
TOKEN="your_token_here"

# Get current user
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Migration from localStorage

The frontend has been updated to use API calls instead of localStorage. Key changes:

1. **Authentication**: Now uses JWT tokens stored in localStorage
2. **Reports**: All CRUD operations hit the API
3. **Programs**: Fetching from database via API
4. **User Data**: Stored in MongoDB, not browser localStorage

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running (check with `mongod` or MongoDB Atlas)
- Verify `MONGODB_URI` in `.env`
- Check firewall settings

### "Network Error" in frontend
- Ensure backend is running on port 3000
- Check CORS settings
- Verify API URL in frontend config

### "Invalid token"
- Logout and login again
- Check JWT_SECRET is set
- Token expires after 12 hours

### Backend won't start
- Check if port 3000 is already in use
- Verify all dependencies installed: `npm install`
- Check `.env` file exists and has correct values

## Development Tips

### Using MongoDB Compass
Download [MongoDB Compass](https://www.mongodb.com/products/compass) to visually browse your database.

Connect with: `mongodb://localhost:27017/bug-bounty-management`

### Viewing Logs
```bash
# Backend logs
cd backend
npm run dev  # Shows detailed logs

# Clear terminal if needed
clear
```

### Database Queries in MongoDB Compass
- Open MongoDB Compass
- Connect to your database
- Browse collections: users, reports, programs
- View and edit documents directly

## Next Steps

1. **Production Deployment**
   - Set strong JWT_SECRET
   - Use MongoDB Atlas or managed database
   - Configure CORS for your domain
   - Enable HTTPS

2. **Add Features**
   - Email notifications
   - File attachments for reports
   - Real-time updates with WebSockets
   - Payment processing integration

3. **Security Enhancements**
   - Rate limiting
   - Input validation and sanitization
   - SQL injection prevention (if using SQL)
   - XSS protection

## Support

For issues or questions:
- Check `backend/README.md` for detailed API docs
- Check browser console for frontend errors
- Check backend terminal for server errors
- Review MongoDB logs for database issues

