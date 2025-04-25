import { useState , useEffect } from 'react';
import { DocumentIcon, ArrowLeftIcon, TrashIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useLocation , useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCourses = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const courseId = location.state?.courseId;
    const courseNameFromLocation = location.state?.courseName;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState(courseNameFromLocation);
  const [files, setFiles] = useState([]);
  

  useEffect(() => {
    const getFiles = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/getfiles?course=${courseId}`, {
                withCredentials: true,
            });
            const processedFiles = res.data.map(file => ({
                ...file,
                filename: file.url.split('/').pop().split('?')[0],
            }));
            setFiles(processedFiles);
        } catch (err) {
            setError("Failed to fetch files. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (courseId) {
        getFiles();
    }
}, [courseId]);

const handleUploadFile = (courseId) => (e) => {
    e.preventDefault();
    navigate("/addFile", { state: { course: courseId } });
};

  const handleRemoveFile = (fileId) => {
    setFiles(files.filter(file => file.id !== fileId));
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Settings</h1>
            <p className="text-gray-500 mt-1">Manage your course details and materials</p>
          </div>
          <button className="flex items-center px-5 py-2.5 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Course Name Section */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
          <div className="max-w-2xl">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Course Title</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-[#6a11cb]/20 focus:border-[#6a11cb] transition-all placeholder-gray-400"
              placeholder="Enter course name"
            />
          </div>
        </div>

        {/* File Management Section */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Course Materials</h2>
              <p className="text-gray-500 mt-1">Upload and manage your teaching resources</p>
            </div>
            <button
        onClick={handleUploadFile(courseId)}
        className="flex items-center px-5 py-2.5 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
      >
        <CloudArrowUpIcon className="w-5 h-5 mr-2" />
        Add Files
      </button>
          </div>

          {/* Files Grid */}
          
          {files.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((file) => (
                <div key={file.id} className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-[#6a11cb]/30 transition-all duration-200">
                  <div className="flex items-center truncate">
                    <div className="bg-[#6a11cb]/10 p-2 rounded-lg mr-3">
                      <DocumentIcon className="w-6 h-6 text-[#6a11cb]" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.filename}</p>
                      <p className="text-xs text-gray-500 mt-1">{file.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete file"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
          )} 
        </div>

        {/* Save Section */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm py-4 border-t border-gray-200">
          <div className="flex justify-end gap-4">
            <button className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCourses;