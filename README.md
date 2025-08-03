# 🌟 TalentThread Frontend

A modern, responsive frontend for the TalentThread professional social networking platform. Built with React 19, Vite, and Tailwind CSS.

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.11-38B2AC?style=flat&logo=tailwind-css)

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Glass Morphism** - Modern glass effect design elements
- **Smooth Animations** - Framer Motion powered transitions
- **Custom Toast System** - Beautiful notification system
- **Dark Mode Ready** - Built-in dark mode support

### 🔐 Authentication
- **Secure Login/Register** - JWT-based authentication
- **Protected Routes** - Route-level authentication
- **Persistent Sessions** - Local storage token management

### 📱 Social Features
- **Post Creation** - Rich text posts with image upload
- **Real-time Feed** - Dynamic post feed with interactions
- **Like System** - Interactive like/unlike functionality
- **Comments** - Add and view post comments
- **User Profiles** - Customizable user profiles

## 🛠️ Tech Stack

- **React 19.0.0** - Latest React with modern features
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Framer Motion 12.5.0** - Animation library
- **React Router DOM 7.3.0** - Client-side routing
- **Axios 1.11.0** - HTTP client for API calls
- **React Icons 5.5.0** - Comprehensive icon library

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/JayThakor15/ThinkThreadFrontend
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── Logo.png              # App logo
│   └── _redirects            # Netlify redirects
├── src/
│   ├── components/           # Reusable components
│   │   ├── ui/
│   │   │   └── Notification.jsx
│   │   └── CreatePostDialog.jsx
│   ├── contexts/            # React contexts
│   │   └── ToastContext.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── Feed.jsx         # Post feed
│   │   ├── Landing.jsx      # Landing page
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   └── ProfilePage.jsx  # User profile
│   ├── utils/               # Utility functions
│   │   ├── defaultImages.js
│   │   └── imageClean.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── components.json          # Shadcn/ui config
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 API Integration

The frontend connects to the TalentThread backend API:

- **Production**: `https://thinkthreadbackend.onrender.com`
- **Development**: `http://localhost:5000`

### Key API Endpoints Used

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/posts` - Fetch posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

## 🎨 Styling & Theming

### Tailwind CSS Configuration
- Custom color palette
- Responsive breakpoints
- Glass morphism utilities
- Animation classes

### Component Library
- Custom toast notifications
- Reusable UI components
- Consistent design system

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Responsive layouts for tablets
- **Desktop Enhanced** - Rich desktop experience

## 🚀 Deployment

### Netlify (Recommended)

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Netlify**
- Connect your GitHub repository
- Set build command: `npm run build`
- Set publish directory: `dist`

### Manual Deployment

1. **Build for production**
```bash
npm run build
```

2. **Deploy the `dist` folder** to your hosting provider

## 🔒 Environment Variables

No environment variables required for the frontend. API endpoints are configured directly in the code.

## 🎯 Features in Detail

### Authentication Flow
- Secure JWT token management
- Automatic token validation
- Redirect handling for protected routes

### Post Management
- Rich text post creation
- Image upload with preview
- Real-time post updates
- Interactive like/comment system

### User Experience
- Smooth page transitions
- Loading states for all actions
- Error handling with user feedback
- Responsive navigation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Jay Thakor**
- LinkedIn: [Jay Thakor](https://www.linkedin.com/in/jay-thakor-39a580217/)
- GitHub: [JayThakor15](https://github.com/JayThakor15)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- Vite for the fast development experience

---

⭐ **Star this repository if you found it helpful!**

🐛 **Found a bug?** [Open an issue](https://github.com/JayThakor15/ThinkThreadFrontend/issues)

