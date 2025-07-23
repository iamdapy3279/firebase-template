import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const FirestoreTest = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('FirestoreTest: Fetching data for user ID:', user.uid);
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          console.log('FirestoreTest: Successfully fetched user data:', data);
          setUserData(data);
        } else {
          console.log('FirestoreTest: No user document found');
          setError('No user document found in Firestore');
        }
      } catch (err) {
        console.error('FirestoreTest: Error fetching user data:', err);
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card p-8 text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-secondary-600 dark:text-secondary-400">
            Testing Firestore connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
          🧪 Firestore Connection Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Firebase Auth Data */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              📋 Firebase Auth Data
            </h2>
            <div className="bg-secondary-50 dark:bg-secondary-700 p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div>
                  <strong>User ID:</strong> 
                  <code className="ml-2 bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded">
                    {user?.uid || 'Not available'}
                  </code>
                </div>
                <div>
                  <strong>Email:</strong> 
                  <span className="ml-2">{user?.email || 'Not available'}</span>
                </div>
                <div>
                  <strong>Display Name:</strong> 
                  <span className="ml-2">{user?.displayName || 'Not set'}</span>
                </div>
                <div>
                  <strong>Email Verified:</strong> 
                  <span className={`ml-2 ${user?.emailVerified ? 'text-success-600' : 'text-warning-600'}`}>
                    {user?.emailVerified ? '✅ Yes' : '⚠️ No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Firestore Data */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              🗄️ Firestore Database Data
            </h2>
            <div className="bg-secondary-50 dark:bg-secondary-700 p-4 rounded-lg">
              {error ? (
                <div className="text-danger-600 dark:text-danger-400">
                  <strong>❌ Error:</strong> {error}
                </div>
              ) : userData ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Display Name:</strong> 
                    <span className="ml-2">{userData.displayName || 'Not set'}</span>
                  </div>
                  <div>
                    <strong>Email:</strong> 
                    <span className="ml-2">{userData.email || 'Not available'}</span>
                  </div>
                  <div>
                    <strong>Created At:</strong> 
                    <span className="ml-2">
                      {userData.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleString() : 'Not available'}
                    </span>
                  </div>
                  <div>
                    <strong>Last Login:</strong> 
                    <span className="ml-2">
                      {userData.lastLoginAt ? new Date(userData.lastLoginAt.seconds * 1000).toLocaleString() : 'Not available'}
                    </span>
                  </div>
                  <div>
                    <strong>Theme Preference:</strong> 
                    <span className="ml-2">{userData.preferences?.theme || 'Not set'}</span>
                  </div>
                  <div>
                    <strong>Notifications:</strong> 
                    <span className="ml-2">
                      {userData.preferences?.notifications ? '✅ Enabled' : '❌ Disabled'}
                    </span>
                  </div>
                  {userData.bio && (
                    <div>
                      <strong>Bio:</strong> 
                      <span className="ml-2">{userData.bio}</span>
                    </div>
                  )}
                  {userData.website && (
                    <div>
                      <strong>Website:</strong> 
                      <span className="ml-2">{userData.website}</span>
                    </div>
                  )}
                  {userData.location && (
                    <div>
                      <strong>Location:</strong> 
                      <span className="ml-2">{userData.location}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-warning-600 dark:text-warning-400">
                  <strong>⚠️ No data found</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Raw Data Display */}
        {userData && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
              🔍 Raw Firestore Document Data
            </h3>
            <pre className="bg-secondary-100 dark:bg-secondary-800 p-4 rounded-lg text-xs overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}

        {/* Connection Status */}
        <div className="mt-6 p-4 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
          <div className="flex items-center">
            <div className="text-success-600 dark:text-success-400">
              {error ? '❌' : userData ? '✅' : '⚠️'}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-success-800 dark:text-success-200">
                {error ? 'Firestore Connection Failed' : userData ? 'Firestore Connection Successful!' : 'Firestore Connection Status Unknown'}
              </h3>
              <p className="text-sm text-success-600 dark:text-success-400 mt-1">
                {error ? 'There was an error connecting to Firestore.' : 
                 userData ? 'Successfully fetched user data from Firestore database.' : 
                 'Unable to determine connection status.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirestoreTest;