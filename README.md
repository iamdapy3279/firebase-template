# Firebase Template - React + Tailwind CSS + Firebase

A complete, production-ready React web application template featuring authentication, file storage, and user management with Firebase backend.

## ✨ Features

### 🔐 Authentication System
- Email/password registration and login
- Password reset functionality
- Email verification flow
- Protected routes with authentication guards
- Automatic user profile creation in Firestore

### 📁 File Storage System
- Drag and drop file upload with progress bars
- File manager interface with grid/list views
- File preview and download functionality
- User-specific folder organization
- File search and filtering
- Bulk file operations (select, delete)

### 👤 User Management
- User dashboard with statistics
- Profile management with bio, website, location
- Password change functionality
- Account preferences and settings
- User profile photos

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Dark mode support with theme persistence
- Professional color scheme (easily customizable)
- Loading states and animations
- Form validation with error messages
- Mobile-first responsive design

### 🚀 Production Ready
- Firebase hosting configuration
- GitHub Actions CI/CD pipeline
- Environment variables setup
- Security rules for Firestore and Storage
- Performance optimizations
- Error boundaries and loading states

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)
- **Routing**: React Router v7
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Deployment**: Firebase Hosting, GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase account
- Git

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd firebase-template
npm install
```

### 2. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Create Storage bucket
5. Copy your Firebase config from Project Settings

### 3. Environment Configuration
1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 4. Deploy Security Rules
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore:rules,storage
```

### 5. Start Development
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ForgotPasswordForm.jsx
│   │   ├── EmailVerification.jsx
│   │   └── ProtectedRoute.jsx
│   ├── dashboard/         # Dashboard components
│   │   └── Dashboard.jsx
│   ├── files/             # File management components
│   │   ├── FileUploadZone.jsx
│   │   └── FileManager.jsx
│   ├── layout/            # Layout components
│   │   ├── Layout.jsx
│   │   └── Navbar.jsx
│   ├── profile/           # Profile components
│   │   └── ProfileSettings.jsx
│   └── ui/                # Reusable UI components
│       └── LoadingSpinner.jsx
├── contexts/              # React contexts
│   ├── AuthContext.jsx    # Authentication state
│   └── ThemeContext.jsx   # Theme management
├── hooks/                 # Custom hooks
│   └── useFileUpload.js   # File upload logic
├── lib/                   # Utilities
│   └── firebase.js        # Firebase configuration
└── App.jsx               # Main app component
```

## 🔧 Configuration

### Customizing Colors
Edit `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary color shades
        50: '#eff6ff',
        500: '#3b82f6',
        900: '#1e3a8a',
      },
      // ... other colors
    }
  }
}
```

### Firebase Security Rules
The template includes production-ready security rules:
- Users can only access their own data
- File uploads are restricted to authenticated users
- 10MB file size limit
- Proper data validation

### Adding New Routes
1. Create your component in `src/components/`
2. Add the route to `src/App.jsx`
3. Update navigation in `src/components/layout/Navbar.jsx`

## 🚀 Deployment

### Automatic Deployment (Recommended)
1. Push to GitHub
2. Set up repository secrets:
   - `VITE_FIREBASE_*` (all Firebase config values)
   - `FIREBASE_SERVICE_ACCOUNT` (from Firebase project settings)
   - `FIREBASE_PROJECT_ID`
3. GitHub Actions will automatically deploy on push to `main`

### Manual Deployment
```bash
npm run build
firebase deploy
```

### Custom Domain
1. In Firebase Console, go to Hosting
2. Add custom domain
3. Follow DNS configuration instructions

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run deploy` - Build and deploy to Firebase

### Testing Locally with Firebase Emulators
```bash
firebase emulators:start
```

## 🔒 Security Features

⚠️ **CRITICAL**: This template includes production-ready security measures. Review `SECURITY.md` before deployment.

- **Authentication**: Secure Firebase Auth with email verification
- **Authorization**: User-specific data access with Firestore rules
- **File Security**: Private file storage with user-based access control (10MB limit)
- **Input Validation**: Client and server-side validation with file type restrictions
- **Error Boundaries**: Comprehensive error handling and cleanup
- **Component Safety**: Prevents state updates on unmounted components
- **HTTPS**: Enforced secure connections
- **Environment Variables**: Sensitive data protection with proper .gitignore

## 🎨 Customization

### Changing the App Name
1. Update `name` in `package.json`
2. Change the logo/title in `src/components/layout/Navbar.jsx`
3. Update `index.html` title
4. Modify Firebase project name if needed

### Adding New Features
The template is designed to be easily extensible:
1. Add new components following the existing patterns
2. Use the provided contexts for state management
3. Follow the established file structure
4. Maintain security best practices

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the Firebase console for errors
2. Verify your environment variables
3. Check browser developer tools
4. Review Firebase security rules
5. Open an issue on GitHub

---

**Happy coding! 🚀**
