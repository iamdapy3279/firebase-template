import { useState, useCallback } from 'react';
import { Upload, X, File, Image, Film, Music } from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';
import LoadingSpinner from '../ui/LoadingSpinner';

const FileUploadZone = ({ onUploadComplete, folder = 'general' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { uploadFiles, uploading, uploadProgress, error, clearError } = useFileUpload();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      clearError();
      const uploadedFiles = await uploadFiles(selectedFiles, folder);
      setSelectedFiles([]);
      if (onUploadComplete) {
        onUploadComplete(uploadedFiles);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      {error && (
        <div className="mb-4 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md dark:bg-danger-900/20 dark:border-danger-800 dark:text-danger-400">
          {error}
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
            : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-secondary-400" />
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            <span className="font-medium text-primary-600 dark:text-primary-400">
              Click to upload
            </span>{' '}
            or drag and drop files here
          </p>
          <p className="text-xs text-secondary-500 dark:text-secondary-500">
            PNG, JPG, GIF, PDF, DOC, etc. up to 10MB each
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-secondary-900 dark:text-white">
            Selected Files ({selectedFiles.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => {
              const fileId = `${Date.now()}-${index}-${file.name}`;
              const progress = uploadProgress[fileId] || 0;
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-secondary-500 dark:text-secondary-400">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        {formatFileSize(file.size)}
                      </p>
                      {uploading && progress > 0 && (
                        <div className="mt-1">
                          <div className="bg-secondary-200 dark:bg-secondary-700 rounded-full h-1.5">
                            <div
                              className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-secondary-500 mt-1">
                            {Math.round(progress)}% uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {!uploading && (
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 p-1 text-secondary-400 hover:text-danger-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </>
              )}
            </button>
            
            {!uploading && (
              <button
                onClick={() => setSelectedFiles([])}
                className="btn-secondary"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;