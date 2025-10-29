# Bug Bounty Management System

A full-stack bug bounty platform connecting security researchers with companies that need security testing.

## 🚀 Features

- **Multi-role System**: Support for Researchers, Companies, and Triage Teams
- **Bug Report Management**: Submit, track, and review security vulnerabilities
- **Program Management**: Companies can create and manage bug bounty programs
- **Reward System**: Automatic tracking of bounties and earnings
- **Real-time Dashboard**: Track submissions, payments, and statistics
- **Secure Authentication**: JWT-based authentication with password hashing

## 📁 Project Structure

```
Bug-Bounty-Management-System/
├── backend/                # Node.js backend API
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   └── server.js          # Express server
├── src/                   # React frontend
│   ├── pages/            # Page components
│   ├── shared/           # Shared components
│   └── utils/            # Utilities and API calls
└── public/               # Static assets
```

## 🛠 Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- Axios for API calls
- CSS for styling

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Bug-Bounty-Management-System
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Configure environment variables**

Create `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bug-bounty-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

Create `src/.env` (or add to root `.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

5. **Start MongoDB**
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

6. **Start the backend server**
```bash
cd backend
npm run dev
```

7. **Start the frontend** (in a new terminal)
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`

## 👥 User Roles

### 🔍 Researcher
- Browse bug bounty programs
- Submit vulnerability reports
- Track reports and earnings
- View profile statistics

### 🏢 Company
- Create bug bounty programs
- Manage programs and scope
- Review submitted reports
- Track bounty payments
- View program statistics

### ⚖️ Triage Team
- Review all reports
- Validate vulnerabilities
- Update report status
- Provide feedback

## 📝 Usage

### Creating an Account

1. Visit the signup page
2. Select your role (Researcher or Company)
3. Fill in the registration form
4. Start using the platform

### Demo Accounts

The backend will automatically create demo accounts on first run (you can seed them):

**Researcher**
- Email: `demo@researcher.com`
- Password: `demo123`

**Company**
- Email: `demo@company.com`
- Password: `demo123`

**Triage**
- Email: `demo@triage.com`
- Password: `demo123`

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Protected API endpoints
- Secure session management

## 🧪 Testing

The backend API can be tested using:
- Postman
- Thunder Client
- curl commands

Example API calls are documented in `backend/README.md`

## 📊 Database Schema

### User Model
- Authentication fields (email, password, username)
- Role-specific fields based on user type
- Statistics and profile information

### Report Model
- Link to user (submitter)
- Link to company/program
- Vulnerability details
- Status and reward tracking

### Program Model
- Company information
- Scope and rules
- Reward structure
- Statistics

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Heroku/Render)
1. Push to repository
2. Set environment variables
3. Start server with `npm start`

Ensure to:
- Set production `JWT_SECRET`
- Use MongoDB Atlas or managed database
- Configure CORS for your domain
- Enable HTTPS

## 📄 License

ISC

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a pull request

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation in `backend/README.md`

---

Built with ❤️ for the security community
