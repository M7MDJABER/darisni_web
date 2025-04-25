import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CourseForm = () => {
  const [courseName, setCourseName] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!courseName || !uploadedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("name", courseName);
    formData.append("file", uploadedFile);

    try {
      const response = await fetch("http://localhost:5000/createCourse", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error('Upload failed');
      
      await response.json();
    } catch (err) {
      console.error("Error creating course:", err);
    } finally {
      setLoading(false);
      navigate("/mycourses");
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Course</h1>
            <p className="text-gray-500">Start by uploading your course materials</p>
          </div>

          <div>
            <label htmlFor="course-name" className="block text-sm font-medium text-gray-700 mb-3">
              Course Name
            </label>
            <input
              type="text"
              id="course-name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-gray-400 text-gray-700"
              placeholder="e.g., Advanced React Development"
            />
          </div>

          <div 
            className={`relative p-10 border-4 border-dashed rounded-xl group transition-all duration-200
              ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-gray-200 hover:border-blue-400'}
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
              onChange={(e) => setUploadedFile(e.target.files[0])}
              accept=".pdf,.docx,.pptx"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-full transition-all duration-200 
                ${uploadedFile ? 'bg-green-100' : 'bg-blue-100'} group-hover:scale-110`}>
                <svg 
                  className={`w-12 h-12 ${uploadedFile ? 'text-green-500' : 'text-blue-500'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
              </div>
              <div className="text-center space-y-2">
                <p className={`text-lg font-medium ${uploadedFile ? 'text-green-600' : 'text-gray-600'}`}>
                  {uploadedFile ? (
                    <>
                      <span className="font-semibold">{uploadedFile.name}</span>
                      <br />
                      <span className="text-sm">Click to change file</span>
                    </>
                  ) : (
                    <>
                      Drag & drop files or <span className="text-blue-600">browse</span>
                    </>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: PDF, DOCX, PPTX (Max 50MB)
                </p>
              </div>
            </label>
          </div>

          <button
            disabled={!courseName || !uploadedFile || loading}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02]"
            onClick={handleUpload}
          >
            {loading ? (
              <>
                <svg 
                  className="animate-spin h-6 w-6 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Uploading Course...</span>
              </>
            ) : (
              <>
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
                <span>Create Course</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;