import { useAuth } from '../../contexts/AuthContext';

const SimpleTest = () => {
  const { user } = useAuth();

  console.log('SimpleTest: Component loaded');
  console.log('SimpleTest: User data:', user);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md border border-secondary-200 dark:border-secondary-700 p-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
          🔧 Simple Test Page
        </h1>
        
        <div className="space-y-4">
          <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-success-800 dark:text-success-200 mb-2">
              ✅ Page Loaded Successfully!
            </h2>
            <p className="text-success-700 dark:text-success-300">
              If you can see this message, React routing and component rendering are working.
            </p>
          </div>

          <div className="bg-secondary-50 dark:bg-secondary-700 p-4 rounded-lg">
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
              User Authentication Status:
            </h3>
            {user ? (
              <div className="space-y-2 text-sm">
                <p><strong>✅ User is logged in</strong></p>
                <p><strong>User ID:</strong> <code className="bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">{user.uid}</code></p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Display Name:</strong> {user.displayName || 'Not set'}</p>
              </div>
            ) : (
              <p className="text-danger-600 dark:text-danger-400">❌ No user found</p>
            )}
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-4 rounded-lg">
            <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-2">
              🧪 Next Steps:
            </h3>
            <ul className="text-primary-700 dark:text-primary-300 text-sm space-y-1">
              <li>• Check browser console for any error messages</li>
              <li>• Verify user authentication is working</li>
              <li>• Test Firestore connection next</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;