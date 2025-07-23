import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';

const AuthDebug = () => {
  const { user, loading, error } = useAuth();

  console.log('AuthDebug - loading:', loading);
  console.log('AuthDebug - user:', user);
  console.log('AuthDebug - error:', error);
  console.log('Firebase Auth instance:', auth);
  console.log('Firebase config check:', {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Present' : 'Missing',
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md border border-secondary-200 dark:border-secondary-700 p-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
          🔍 Auth Debug Information
        </h1>
        
        <div className="space-y-4">
          <div className="bg-secondary-50 dark:bg-secondary-700 p-4 rounded-lg">
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
              Authentication State:
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Loading:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{String(loading)}</code></p>
              <p><strong>User:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{user ? 'Authenticated' : 'Not authenticated'}</code></p>
              {user && (
                <>
                  <p><strong>User ID:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{user.uid}</code></p>
                  <p><strong>Email:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{user.email}</code></p>
                </>
              )}
              {error && (
                <p><strong>Error:</strong> <code className="bg-danger-100 dark:bg-danger-900/20 text-danger-800 dark:text-danger-200 px-2 py-1 rounded">{error}</code></p>
              )}
            </div>
          </div>

          <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 p-4 rounded-lg">
            <h3 className="font-semibold text-warning-800 dark:text-warning-200 mb-2">
              🔧 Firebase Configuration:
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>API Key:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{import.meta.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing'}</code></p>
              <p><strong>Auth Domain:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing'}</code></p>
              <p><strong>Project ID:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Present' : 'Missing'}</code></p>
              <p><strong>Firebase Auth Instance:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{auth ? 'Initialized' : 'Not initialized'}</code></p>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-4 rounded-lg">
            <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-2">
              🔧 Debug Actions:
            </h3>
            <ul className="text-primary-700 dark:text-primary-300 text-sm space-y-1">
              <li>• Check browser console for Firebase errors</li>
              <li>• Verify .env file has correct Firebase configuration</li>
              <li>• Check Firebase project settings</li>
              <li>• Ensure user is properly authenticated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;