# 🐛 BugHuntr - Complete Bug Bounty Management System

A fully-featured Bug Bounty Management System built with **Vite + React (JavaScript)** featuring a stunning **light neobrutalism design theme**.

## 🎨 Design Theme

- **Light Neobrutalism**: Bold borders, flat bright colors, big typography, raw grid-based layouts
- **Color Palette**:
  - `#b0acb0` - Gray
  - `#e2dddf` - Light Gray
  - `#85ebd9` - Teal/Mint
  - `#3d898d` - Dark Teal
  - `#2f404d` - Dark Blue

## ✨ Complete Features

### 🔐 Authentication System
- **Signup**: Create new user accounts with validation
- **Login**: Secure login with email/password
- **Session Management**: Persistent sessions using localStorage
- **Protected Routes**: Dashboard, reports, and profile require authentication

### 📄 All Pages Implemented

1. **Landing Page** (`/`)
   - Hero section with animated floating cards
   - Features showcase
   - Statistics display
   - Call-to-action buttons
   - Full responsive footer

2. **Login Page** (`/login`)
   - Beautiful neobrutalist form design
   - Email and password authentication
   - Error handling and validation
   - Link to signup

3. **Signup Page** (`/signup`)
   - Complete registration form
   - Password confirmation
   - Validation for all fields
   - Automatic redirection after signup

4. **Dashboard** (`/dashboard`)
   - Browse all bug bounty programs
   - Real-time search functionality
   - Filter by severity (Critical, High, Medium, Low)
   - Filter by bounty range
   - 12 companies with realistic data
   - Company cards with quick actions

5. **Companies Page** (`/companies`)
   - View all available bug bounty programs
   - Sort by: Bounty amount, Name, or Industry
   - Detailed company information
   - Direct access to report bugs

6. **Company Detail Page** (`/company/:id`)
   - Complete company profile
   - Reward structure breakdown
   - In-scope assets
   - Out-of-scope items
   - Program rules and guidelines
   - **Report Bug Form** with:
     - Vulnerability type selection
     - Severity selection
     - Detailed description fields
     - Steps to reproduce
     - Impact assessment
     - Proof of concept
     - Target URL

7. **My Reports Page** (`/my-reports`)
   - View all submitted reports
   - Filter by status: All, Pending, In Review, Accepted, Rejected
   - Report statistics dashboard
   - Report cards with:
     - Company information
     - Severity badges
     - Status tracking
     - Submission dates
     - Reward amounts (when applicable)
   - Empty state with CTA

8. **Profile Page** (`/profile`)
   - User avatar and information
   - Editable profile fields (name, bio, skills)
   - Statistics cards:
     - Reports submitted
     - Total earnings
     - Current rank
     - Member since date
   - View and edit mode

9. **Settings Page** (`/settings`)
   - **Account Tab**: View account information
   - **Notifications Tab**: Manage notification preferences
   - **Security Tab**: Password and 2FA settings
   - **Data & Privacy Tab**: 
     - View account statistics
     - Clear all reports
     - Delete account (with confirmation)
   - Tabbed interface with sticky navigation

### 🏢 12 Complete Bug Bounty Programs

1. **TechCorp** - Cloud Infrastructure ($100-$15K)
2. **FinanceHub** - Digital Banking ($500-$50K)
3. **DataStream** - Analytics Platform ($200-$8K)
4. **SecureChat** - Encrypted Messaging ($300-$20K)
5. **ShopNow** - E-commerce ($150-$10K)
6. **HealthVault** - Healthcare Records ($1K-$25K)
7. **EduLearn** - Online Education ($100-$5K)
8. **GameZone** - Gaming Platform ($200-$12K)
9. **TravelNow** - Travel Booking ($150-$8K)
10. **CloudStore** - Cloud Storage ($300-$18K)
11. **SocialConnect** - Social Network ($500-$30K)
12. **DevTools Pro** - Developer Tools ($250-$10K)

Each company includes:
- Complete "About" section
- Detailed reward structure
- In-scope and out-of-scope assets
- Program rules and guidelines
- Industry tags and severity ratings

### 🐛 Bug Reporting System

- **Submit Reports**: Complete bug submission form with validation
- **Track Reports**: View all your submitted reports
- **Status Updates**: Pending Review → In Review → Accepted/Rejected
- **Rewards Tracking**: See bounties earned on accepted reports
- **Statistics**: Track your performance with detailed stats
- **localStorage Based**: All reports persist in browser storage

### 🎯 Components

#### Shared Components
- **Navbar**: Brand logo, user info, logout button
- **Sidebar**: Navigation menu with active states
- **Footer**: Links, social media, legal information
- **CompanyCard**: Display company with bounty info
- **ReportCard**: Display submitted reports with status

#### Utilities
- **auth.js**: Authentication functions (signup, login, logout, getCurrentUser)
- **reports.js**: Report management (submit, get, update, delete reports)
- **mockData.js**: 12 companies with complete information

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Access the App

Open your browser to: **http://localhost:5173**

## 📖 Usage Guide

### 1. Create an Account
- Click "Sign Up" on the landing page
- Fill in your details (name, username, email, password)
- Click "Create Account"

### 2. Login
- Enter your email and password
- Click "Login" to access the dashboard

### 3. Browse Programs
- View all companies on the Dashboard
- Use search to find specific companies
- Filter by severity or bounty range
- Sort companies by different criteria

### 4. Submit a Bug Report
- Click on any company card
- Click "Report a Bug" button
- Fill in the complete report form:
  - Title of the vulnerability
  - Vulnerability type (XSS, SQLi, CSRF, etc.)
  - Severity level
  - Target URL
  - Detailed description
  - Steps to reproduce
  - Impact assessment
  - Proof of concept
- Click "Submit Report"

### 5. Track Your Reports
- Go to "My Reports" in the sidebar
- View all submitted reports
- Filter by status
- See rewards for accepted reports

### 6. Manage Profile
- Click on your avatar or "Profile" in sidebar
- View your statistics
- Click "Edit Profile" to update information
- Add skills, bio, and personal details

### 7. Customize Settings
- Go to "Settings" in the sidebar
- Manage notifications
- View security settings
- Access data and privacy controls

## 🎨 Design Features (Neobrutalism)

- ✅ **Thick Black Borders** (4px) on all major elements
- ✅ **Flat Color Blocks** with no gradients
- ✅ **Hard Drop Shadows** (offset shadows, no blur)
- ✅ **Chunky Buttons** with hover/active animations
- ✅ **Playful Transitions** and micro-interactions
- ✅ **Bold Typography** - uppercase headers, big fonts
- ✅ **Raw Grid-Based Layouts** - structured and clean
- ✅ **Severity Color Coding**:
  - Critical: Red (#ff6b6b)
  - High: Orange (#ffa500)
  - Medium: Yellow (#ffd93d)
  - Low: Blue (#a8dadc)

## 📁 Complete Project Structure

```
bugbountymanagementsystem/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx           # Landing page with hero
│   │   ├── Login.jsx              # Login authentication
│   │   ├── Signup.jsx             # User registration
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   ├── Companies.jsx          # All companies list
│   │   ├── CompanyDetail.jsx      # Company + report form
│   │   ├── MyReports.jsx          # User's submitted reports
│   │   ├── Profile.jsx            # User profile
│   │   └── Settings.jsx           # Account settings
│   ├── shared/
│   │   ├── Navbar.jsx             # Top navigation
│   │   ├── Sidebar.jsx            # Side menu
│   │   ├── Footer.jsx             # Footer component
│   │   ├── CompanyCard.jsx        # Company display card
│   │   └── ReportCard.jsx         # Report display card
│   ├── utils/
│   │   ├── auth.js                # Authentication logic
│   │   ├── reports.js             # Report management
│   │   └── mockData.js            # 12 companies data
│   ├── App.jsx                    # Router configuration
│   ├── main.jsx                   # Entry point
│   └── styles.css                 # Complete neobrutalism CSS
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Authentication Flow

1. **Signup**: Creates user in `localStorage.users` array
2. **Login**: Validates credentials, creates session in `localStorage.currentUser`
3. **Protected Routes**: Check authentication before rendering pages
4. **Logout**: Removes session from localStorage

## 🐛 Report Management Flow

1. **Submit Report**: User fills form on company detail page
2. **Store Report**: Saved to `localStorage.reports` with user ID
3. **Update Stats**: User's `reportsSubmitted` count increases
4. **View Reports**: User can see all reports in "My Reports"
5. **Filter/Sort**: Reports can be filtered by status
6. **Track Earnings**: Accepted reports show reward amounts

## 🎯 Key Features Highlights

### Search & Filtering
- Real-time search across company names, industries, and tags
- Multi-criteria filtering (severity, bounty range)
- Instant results without page reload

### Report Submission
- 12+ vulnerability types supported
- 4 severity levels
- Comprehensive form validation
- Success/error feedback
- Automatic stats updates

### User Experience
- Smooth animations and transitions
- Hover effects on interactive elements
- Responsive design for all devices
- Loading states and error handling
- Empty states with helpful CTAs

### Data Persistence
- All user data saved in localStorage
- Reports persist across sessions
- Profile updates saved automatically
- Statistics calculated in real-time

## 📱 Responsive Design

- **Desktop** (1024px+): Full layout with sidebar
- **Tablet** (768px-1023px): Adaptive grid layouts
- **Mobile** (< 768px): Single column, horizontal sidebar

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 6.20.0
- **Styling**: Pure CSS (Neobrutalism)
- **Storage**: localStorage (no backend needed)
- **Language**: JavaScript (ES6+)

## 🎓 Perfect For

- Learning React and Vite
- Understanding localStorage patterns
- Studying neobrutalism design
- Building CRUD applications
- Portfolio projects
- Bug bounty platform concepts

## 🚀 Production Ready

- Optimized build with Vite
- Code splitting for faster loads
- Responsive on all devices
- Clean, maintainable code
- No external dependencies for UI
- Works offline after first load

## 📊 Statistics Tracking

The app tracks:
- Total reports submitted
- Reports by status (pending, review, accepted, rejected)
- Total earnings from bounties
- User rank progression
- Member since date
- Skills and expertise

## 🎉 Complete & Ready to Use!

This is a **fully functional, production-ready** Bug Bounty Management System with:
- ✅ All 9 pages implemented
- ✅ Complete authentication system
- ✅ 12 realistic bug bounty programs
- ✅ Full report submission & tracking
- ✅ User profile management
- ✅ Settings and preferences
- ✅ Beautiful neobrutalism design
- ✅ Fully responsive
- ✅ localStorage persistence

**No backend required!** Everything works with localStorage for instant setup and testing.

---

**Built with ❤️ using Vite + React + Neobrutalism Design**

Start hunting bugs and earning bounties! 🐛💰
