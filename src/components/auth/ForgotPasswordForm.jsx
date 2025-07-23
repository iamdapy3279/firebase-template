import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ForgotPasswordForm = () => {
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword, error, clearError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      clearError();
      await resetPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100 dark:bg-success-900/20">
              <Mail className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-secondary-900 dark:text-white">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
              We've sent a password reset link to your email address.
            </p>
          </div>
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-secondary-900 dark:text-white">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600 dark:text-secondary-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md dark:bg-danger-900/20 dark:border-danger-800 dark:text-danger-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Email address
            </label>
            <div className="mt-1 relative">
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="input-field pl-10"
                placeholder="Enter your email"
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Sending...
                </>
              ) : (
                'Send reset link'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;