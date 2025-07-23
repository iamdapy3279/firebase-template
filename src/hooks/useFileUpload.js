import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { storage, db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'text/plain', 'text/csv',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const validateFiles = (files) => {
    for (const file of files) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return `File "${file.name}" is too large. Maximum size is 10MB.`;
      }
      
      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return `File type "${file.type}" is not allowed for "${file.name}".`;
      }
    }
    return null;
  };

  const uploadFiles = async (files, folder = 'general') => {
    if (!user) {
      throw new Error('User must be authenticated to upload files');
    }

    // Validate files before upload
    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    setUploading(true);
    setError(null);
    const uploadPromises = [];
    const newProgress = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `${Date.now()}-${i}-${file.name}`;
      newProgress[fileId] = 0;

      const promise = uploadFile(file, folder, fileId);
      uploadPromises.push(promise);
    }

    setUploadProgress(newProgress);

    try {
      const results = await Promise.all(uploadPromises);
      setUploading(false);
      setUploadProgress({});
      return results;
    } catch (error) {
      setError(error.message);
      setUploading(false);
      setUploadProgress({});
      throw error;
    }
  };

  const uploadFile = async (file, folder, fileId) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `users/${user.uid}/${folder}/${fileId}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: progress
          }));
        },
        async (error) => {
          console.error('Upload error:', error);
          // Clean up failed upload from storage if it partially uploaded
          try {
            await deleteObject(storageRef);
          } catch (cleanupError) {
            console.error('Failed to clean up partial upload:', cleanupError);
          }
          reject(new Error(`Failed to upload ${file.name}: ${error.message}`));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            const fileDoc = await addDoc(collection(db, 'files'), {
              name: file.name,
              originalName: file.name,
              size: file.size,
              type: file.type,
              url: downloadURL,
              storagePath: `users/${user.uid}/${folder}/${fileId}`,
              folder,
              userId: user.uid,
              uploadedAt: serverTimestamp(),
            });

            resolve({
              id: fileDoc.id,
              name: file.name,
              size: file.size,
              type: file.type,
              url: downloadURL,
              storagePath: `users/${user.uid}/${folder}/${fileId}`,
              folder,
              uploadedAt: new Date(),
            });
          } catch (error) {
            console.error('Error saving file metadata:', error);
            reject(error);
          }
        }
      );
    });
  };

  const deleteFile = async (fileData) => {
    try {
      setError(null);
      
      const storageRef = ref(storage, fileData.storagePath);
      await deleteObject(storageRef);
      
      await deleteDoc(doc(db, 'files', fileData.id));
      
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => setError(null);

  return {
    uploadFiles,
    deleteFile,
    uploading,
    uploadProgress,
    error,
    clearError
  };
};