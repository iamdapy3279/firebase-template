import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const FirebaseDirectTest = () => {
  const [authState, setAuthState] = useState({
    loading: true,
    user: null,
    error: null
  });

  useEffect(() => {
    console.log('FirebaseDirectTest: Setting up auth listener...');
    console.log('Firebase auth instance:', auth);
    
    const unsubscribe = onAuthStateChanged(
      auth, 
      (user) => {
        console.log('FirebaseDirectTest: Auth state changed:', user);
        setAuthState({
          loading: false,
          user: user,
          error: null
        });
      },
      (error) => {
        console.error('FirebaseDirectTest: Auth error:', error);
        setAuthState({
          loading: false,
          user: null,
          error: error.message
        });
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md border border-secondary-200 dark:border-secondary-700 p-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
          🔥 Direct Firebase Test
        </h1>
        
        <div className="space-y-4">
          <div className="bg-secondary-50 dark:bg-secondary-700 p-4 rounded-lg">
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
              Direct Firebase Auth State:
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Loading:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{String(authState.loading)}</code></p>
              <p><strong>User:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{authState.user ? 'Authenticated' : 'Not authenticated'}</code></p>
              {authState.user && (
                <>
                  <p><strong>User ID:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{authState.user.uid}</code></p>
                  <p><strong>Email:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{authState.user.email}</code></p>
                </>
              )}
              {authState.error && (
                <p><strong>Error:</strong> <code className="bg-danger-100 dark:bg-danger-900/20 text-danger-800 dark:text-danger-200 px-2 py-1 rounded">{authState.error}</code></p>
              )}
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-4 rounded-lg">
            <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-2">
              📝 What this test shows:
            </h3>
            <ul className="text-primary-700 dark:text-primary-300 text-sm space-y-1">
              <li>• Direct Firebase auth state without AuthContext</li>
              <li>• If this resolves (loading becomes false), the issue is in AuthContext</li>
              <li>• If this stays loading, the issue is with Firebase connection</li>
              <li>• Check console for Firebase errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseDirectTest;