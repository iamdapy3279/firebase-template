import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile, updatePassword } from 'firebase/auth';
import { User, Mail, Lock, Camera, Save } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProfileSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const profileForm = useForm();
  const passwordForm = useForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserProfile(data);
          profileForm.reset({
            displayName: data.displayName || '',
            email: user.email,
            bio: data.bio || '',
            website: data.website || '',
            location: data.location || '',
          });
        } else {
          // User document doesn't exist, create default data
          console.log('User document not found, using defaults');
          profileForm.reset({
            displayName: user.displayName || '',
            email: user.email,
            bio: '',
            website: '',
            location: '',
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile data. Error: ' + error.message);
        // Still set default values even if Firestore fails
        profileForm.reset({
          displayName: user.displayName || '',
          email: user.email,
          bio: '',
          website: '',
          location: '',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, profileForm]);

  const onProfileSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await updateProfile(user, {
        displayName: data.displayName
      });

      await updateDoc(doc(db, 'users', user.uid), {
        displayName: data.displayName,
        bio: data.bio,
        website: data.website,
        location: data.location,
        updatedAt: new Date()
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await updatePassword(user, data.newPassword);
      passwordForm.reset();
      
      setSuccess('Password updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/requires-recent-login') {
        setError('Please sign out and sign back in before updating your password');
      } else {
        setError('Failed to update password');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md dark:bg-success-900/20 dark:border-success-800 dark:text-success-400">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md dark:bg-danger-900/20 dark:border-danger-800 dark:text-danger-400">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-secondary-200 dark:border-secondary-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preferences'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400'
            }`}
          >
            Preferences
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <div className="card p-6 text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-secondary-200 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-secondary-400" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-4 font-medium text-secondary-900 dark:text-white">
                {user?.displayName || 'User'}
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Display Name
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...profileForm.register('displayName', {
                          required: 'Display name is required'
                        })}
                        type="text"
                        className="input-field pl-10"
                        placeholder="Your display name"
                      />
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
                    </div>
                    {profileForm.formState.errors.displayName && (
                      <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                        {profileForm.formState.errors.displayName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Email Address
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...profileForm.register('email')}
                        type="email"
                        disabled
                        className="input-field pl-10 bg-secondary-50 dark:bg-secondary-700 cursor-not-allowed"
                      />
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
                    </div>
                    <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Bio
                  </label>
                  <textarea
                    {...profileForm.register('bio')}
                    rows="3"
                    className="input-field mt-1"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Website
                    </label>
                    <input
                      {...profileForm.register('website')}
                      type="url"
                      className="input-field mt-1"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Location
                    </label>
                    <input
                      {...profileForm.register('location')}
                      type="text"
                      className="input-field mt-1"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <LoadingSpinner size="small" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="max-w-2xl">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-6">
              Change Password
            </h3>
            
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...passwordForm.register('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type="password"
                    className="input-field pl-10"
                    placeholder="Enter new password"
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...passwordForm.register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => 
                        value === passwordForm.watch('newPassword') || 'Passwords do not match'
                    })}
                    type="password"
                    className="input-field pl-10"
                    placeholder="Confirm new password"
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <LoadingSpinner size="small" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="max-w-2xl">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-6">
              Account Preferences
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-secondary-900 dark:text-white">
                    Email Notifications
                  </h4>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    Receive email notifications for file uploads and account activity
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-secondary-900 dark:text-white">
                    Auto-backup
                  </h4>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    Automatically backup your files to ensure data safety
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-secondary-900 dark:text-white">
                    Public Profile
                  </h4>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    Make your profile visible to other users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;