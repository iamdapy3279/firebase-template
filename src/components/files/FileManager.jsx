import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Download, Trash2, Eye, Grid, List, Search, Filter, File, Image, Film, Music } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useFileUpload } from '../../hooks/useFileUpload';
import LoadingSpinner from '../ui/LoadingSpinner';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { user } = useAuth();
  const { deleteFile, error, clearError } = useFileUpload();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'files'),
      where('userId', '==', user.uid),
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
      }));
      setFiles(filesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const folders = [...new Set(files.map(file => file.folder))];

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (fileType.startsWith('video/')) return <Film className="h-5 w-5" />;
    if (fileType.startsWith('audio/')) return <Music className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (file) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;
    
    try {
      await deleteFile(file);
      setSelectedFiles(prev => prev.filter(id => id !== file.id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} selected files?`)) return;
    
    try {
      const filesToDelete = files.filter(file => selectedFiles.includes(file.id));
      await Promise.all(filesToDelete.map(file => deleteFile(file)));
      setSelectedFiles([]);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAllFiles = () => {
    setSelectedFiles(filteredFiles.map(file => file.id));
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md dark:bg-danger-900/20 dark:border-danger-800 dark:text-danger-400">
          {error}
          <button onClick={clearError} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
            File Manager
          </h2>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            {filteredFiles.length} files ({files.length} total)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-secondary-500 hover:text-secondary-700 dark:text-secondary-400'}`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-secondary-500 hover:text-secondary-700 dark:text-secondary-400'}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="input-field pl-10 pr-8"
          >
            <option value="all">All Folders</option>
            {folders.map(folder => (
              <option key={folder} value={folder}>
                {folder.charAt(0).toUpperCase() + folder.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary-700 dark:text-primary-400">
              {selectedFiles.length} files selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="btn-danger text-sm py-1 px-3"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </button>
              <button
                onClick={clearSelection}
                className="btn-secondary text-sm py-1 px-3"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Files */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <File className="mx-auto h-12 w-12 text-secondary-400" />
          <h3 className="mt-2 text-sm font-medium text-secondary-900 dark:text-white">
            No files found
          </h3>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            {searchTerm || selectedFolder !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Upload some files to get started.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className={`card p-4 cursor-pointer transition-all ${
                selectedFiles.includes(file.id) 
                  ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => toggleFileSelection(file.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-secondary-500 dark:text-secondary-400">
                  {getFileIcon(file.type)}
                </div>
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="rounded"
                />
              </div>
              
              <h3 className="font-medium text-secondary-900 dark:text-white text-sm truncate mb-1">
                {file.name}
              </h3>
              
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-2">
                {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
              </p>
              
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(file);
                  }}
                  className="flex-1 text-xs btn-secondary py-1 px-2"
                  title="Download"
                >
                  <Download className="h-3 w-3" />
                </button>
                
                {file.type.startsWith('image/') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(file.url, '_blank');
                    }}
                    className="flex-1 text-xs btn-secondary py-1 px-2"
                    title="Preview"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file);
                  }}
                  className="flex-1 text-xs btn-danger py-1 px-2"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
          <div className="px-4 py-3 bg-secondary-50 dark:bg-secondary-700 border-b border-secondary-200 dark:border-secondary-600">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFiles.length === filteredFiles.length}
                onChange={() => selectedFiles.length === filteredFiles.length ? clearSelection() : selectAllFiles()}
                className="rounded"
              />
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Select All
              </span>
            </div>
          </div>
          
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-4 hover:bg-secondary-50 dark:hover:bg-secondary-700 ${
                  selectedFiles.includes(file.id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="rounded"
                  />
                  
                  <div className="text-secondary-500 dark:text-secondary-400">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {formatFileSize(file.size)} • {formatDate(file.uploadedAt)} • {file.folder}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(file)}
                    className="p-2 text-secondary-500 hover:text-primary-600 dark:text-secondary-400"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  {file.type.startsWith('image/') && (
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-2 text-secondary-500 hover:text-primary-600 dark:text-secondary-400"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(file)}
                    className="p-2 text-secondary-500 hover:text-danger-600 dark:text-secondary-400"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;