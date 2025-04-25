import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadCourseFile = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.state?.courseId;

  const handleUpload = async () => {
    if (!uploadedFile || !courseId) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("course_id", courseId);

    try {
      await axios.post(
        `http://localhost:5000/upload/${courseId}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
    } catch (err) {
      console.error("Upload error:", err);
      setError('Upload failed. Please try again.');
    } finally {
      navigate("/FilesInCourses", { state: { course: courseId } });
      setIsUploading(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Upload Course File
        </h1>

        {/* Drag & Drop Area */}
        <div 
          className={`relative p-8 border-4 border-dashed rounded-xl transition-all duration-200
            ${isDragging ? 'border-indigo-500 bg-indigo-50 animate-pulse' : 'border-gray-200'}
            ${error ? 'border-red-500 bg-red-50' : ''}
            ${uploadedFile ? 'border-green-500 bg-green-50' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={(e) => {
              setUploadedFile(e.target.files[0]);
              setError('');
            }}
          />
          <label 
            htmlFor="file-upload" 
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg 
                className={`w-8 h-8 ${uploadedFile ? 'text-green-500' : 'text-indigo-500'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {uploadedFile ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                )}
              </svg>
            </div>
            
            <div className="text-center">
              <p className={`text-sm font-medium ${uploadedFile ? 'text-green-600' : 'text-gray-600'}`}>
                {uploadedFile ? uploadedFile.name : 'Drag & drop files here'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {uploadedFile ? 'File ready for upload' : 'or click to browse (Max 100MB)'}
              </p>
            </div>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mt-4 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </p>
        )}

        {/* Upload Button */}
        <button
          disabled={!uploadedFile || isUploading}
          onClick={handleUpload}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            'Upload File'
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadCourseFile;