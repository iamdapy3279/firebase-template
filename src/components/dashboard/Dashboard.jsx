import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { FileText, Upload, Users, BarChart3, TrendingUp, Clock } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import FileUploadZone from '../files/FileUploadZone';
import LoadingSpinner from '../ui/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    filesThisMonth: 0,
    recentFiles: []
  });
  const [loading, setLoading] = useState(true);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const filesQuery = query(
          collection(db, 'files'),
          where('userId', '==', user.uid),
          orderBy('uploadedAt', 'desc')
        );

        const snapshot = await getDocs(filesQuery);
        const files = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
        }));

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const filesThisMonth = files.filter(file => file.uploadedAt >= startOfMonth);

        const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

        setStats({
          totalFiles: files.length,
          totalSize,
          filesThisMonth: filesThisMonth.length,
          recentFiles: files.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleUploadComplete = (uploadedFiles) => {
    setShowUploadZone(false);
    setStats(prev => ({
      ...prev,
      totalFiles: prev.totalFiles + uploadedFiles.length,
      recentFiles: [...uploadedFiles, ...prev.recentFiles.slice(0, 4)]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.displayName || 'User'}!
        </h1>
        <p className="text-primary-100 mb-4">
          Here's an overview of your file storage activity.
        </p>
        <button
          onClick={() => setShowUploadZone(!showUploadZone)}
          className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
        >
          <Upload className="h-4 w-4 inline mr-2" />
          Upload Files
        </button>
      </div>

      {/* Upload Zone */}
      {showUploadZone && (
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Upload New Files
          </h2>
          <FileUploadZone onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Total Files
              </p>
              <p className="text-3xl font-bold text-secondary-900 dark:text-white">
                {stats.totalFiles}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Storage Used
              </p>
              <p className="text-3xl font-bold text-secondary-900 dark:text-white">
                {formatFileSize(stats.totalSize)}
              </p>
            </div>
            <div className="p-3 bg-success-100 dark:bg-success-900/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                This Month
              </p>
              <p className="text-3xl font-bold text-secondary-900 dark:text-white">
                {stats.filesThisMonth}
              </p>
            </div>
            <div className="p-3 bg-warning-100 dark:bg-warning-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-warning-600 dark:text-warning-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Account Status
              </p>
              <p className="text-lg font-semibold text-success-600 dark:text-success-400">
                Active
              </p>
            </div>
            <div className="p-3 bg-secondary-100 dark:bg-secondary-700 rounded-lg">
              <Users className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Files */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Recent Files
          </h2>
          <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium text-sm">
            View All
          </button>
        </div>

        {stats.recentFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-2 text-sm font-medium text-secondary-900 dark:text-white">
              No files yet
            </h3>
            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
              Upload your first file to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded">
                    <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white text-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-secondary-500 dark:text-secondary-400">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(file.uploadedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg w-fit mx-auto mb-4">
            <Upload className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
            Upload Files
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
            Add new files to your storage
          </p>
          <button
            onClick={() => setShowUploadZone(true)}
            className="btn-primary text-sm"
          >
            Get Started
          </button>
        </div>

        <div className="card p-6 text-center">
          <div className="p-3 bg-success-100 dark:bg-success-900/20 rounded-lg w-fit mx-auto mb-4">
            <FileText className="h-6 w-6 text-success-600 dark:text-success-400" />
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
            Manage Files
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
            Organize and manage your files
          </p>
          <button className="btn-secondary text-sm">
            Open Manager
          </button>
        </div>

        <div className="card p-6 text-center">
          <div className="p-3 bg-warning-100 dark:bg-warning-900/20 rounded-lg w-fit mx-auto mb-4">
            <BarChart3 className="h-6 w-6 text-warning-600 dark:text-warning-400" />
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
            View Analytics
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
            Track your usage statistics
          </p>
          <button className="btn-secondary text-sm">
            View Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;