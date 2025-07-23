import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import EmailVerification from './components/auth/EmailVerification';
import Dashboard from './components/dashboard/Dashboard';
import FileManager from './components/files/FileManager';
import FileUploadZone from './components/files/FileUploadZone';
import ProfileSettings from './components/profile/ProfileSettings';
import ErrorBoundary from './components/ui/ErrorBoundary';
import FirestoreTest from './components/test/FirestoreTest';
import SimpleTest from './components/test/SimpleTest';
import AuthDebug from './components/test/AuthDebug';
import FirebaseDirectTest from './components/test/FirebaseDirectTest';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/debug-direct" element={<AuthDebug />} />
              <Route path="/firebase-direct" element={<FirebaseDirectTest />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/files"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <FileManager />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                            Upload Files
                          </h1>
                          <p className="text-secondary-600 dark:text-secondary-400">
                            Drag and drop files or click to select them for upload
                          </p>
                        </div>
                        <FileUploadZone />
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfileSettings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SimpleTest />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/firestore-test"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <FirestoreTest />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth-debug"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AuthDebug />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
