import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const EmailVerification = () => {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const { user, resendVerificationEmail, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.emailVerified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleResendEmail = async () => {
    try {
      setResending(true);
      await resendVerificationEmail();
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (error) {
      console.error('Error resending verification email:', error);
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-warning-100 dark:bg-warning-900/20">
            <Mail className="h-6 w-6 text-warning-600 dark:text-warning-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-900 dark:text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            We've sent a verification email to{' '}
            <span className="font-medium text-secondary-900 dark:text-white">{user.email}</span>
          </p>
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
            Please check your email and click the verification link to continue.
          </p>
        </div>

        {resent && (
          <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md dark:bg-success-900/20 dark:border-success-800 dark:text-success-400">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Verification email sent successfully!
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="btn-secondary w-full flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend verification email
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="btn-secondary w-full"
          >
            Sign out
          </button>
        </div>

        <div className="text-center text-sm text-secondary-500 dark:text-secondary-400">
          <p>Having trouble?</p>
          <Link
            to="/contact"
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;