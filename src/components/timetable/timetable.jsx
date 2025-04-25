import { useState , useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaFile, FaQuestionCircle, FaCalendarAlt, FaBrain, FaRegFilePdf, FaPlus } from "react-icons/fa";

const Timetable = () => {
  const Location = useLocation();
  const courseId = Location.state?.courseId;
   const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [error, setError] = useState('');
   const [selectedFile, setSelectedFile] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !startDate || !startTime || !endDate || !endTime) {
      setError('الرجاء تعبئة جميع الحقول');
      return;
    }

    setError('');
    setIsUploading(true);

    try {

      const response = await fetch('http://localhost:5000/api/generate-timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileUrl : selectedFile,
          DateOfStart: startDate,
          TimeOfStart: startTime,
          DateOfEnd: endDate,
          TimeOfEnd: endTime
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في إنشاء الجدول');
      }

      const data = await response.text();
      setHtmlCode(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

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

  const createPreviewUrl = () => {
    if (!htmlCode) return '';
    const blob = new Blob([htmlCode], { type: 'text/html' });
    return URL.createObjectURL(blob);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              AI Timetable Generator
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            أدخل رابط الملف وحدد الأوقات لإنشاء جدول دراسي ذكي
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* حقل رابط الملف */}
     <div className="flex flex-nowrap overflow-x-auto pb-4 -mx-4 px-4">
             {files.map((file) => (
       <label 
         key={file.id}
         className={`
           flex-shrink-0 relative m-4 p-6 bg-white rounded-xl shadow-lg
           border-2 cursor-pointer transition-all duration-300
           ${
             selectedFile === file.url 
               ? 'border-indigo-500 bg-indigo-50 shadow-xl scale-105'
               : 'border-gray-200 hover:border-indigo-300 hover:shadow-xl'
           }
         `}
         style={{ minWidth: '250px' }}
       >
         <input
           type="radio"
           name="file-selector"
           value={file.url}
           checked={selectedFile === file.url}
           onChange={(e) => setSelectedFile(e.target.value)}
           className="hidden"
         />
     
         <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center
           ${selectedFile === file.url ? 'bg-indigo-500' : 'bg-gray-300'}`}>
           <div className="w-2 h-2 bg-white rounded-full" />
         </div>
     
         <div className="flex flex-col items-center">
           <div className="relative mb-4 text-indigo-600">
             <div className={`absolute inset-0 rounded-full transition-opacity ${
               selectedFile === file.url ? 'opacity-100 bg-indigo-100' : 'opacity-0'
             }`}></div>
             <FaFile className="text-5xl" />
             <a
               href={file.url}
               target="_blank"
               rel="noopener noreferrer"
               className="absolute bottom-1 right-1 text-red-500 bg-white rounded-full p-1 hover:text-red-600"
               onClick={(e) => e.stopPropagation()}
             >
               <FaRegFilePdf className="text-xl" />
             </a>
           </div>
     
           <div className="text-center">
             <p className={`font-medium text-sm line-clamp-2 ${
               selectedFile === file.url ? 'text-indigo-700' : 'text-gray-700'
             }`}>
               {file.filename}
             </p>
             <span className="text-xs text-gray-500 mt-1 block">
               {Math.round(Math.random() * 5 + 1)} MB
             </span>
           </div>
         </div>
       </label>
     ))}
            </div>

          {/* حقول التوقيت */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">تاريخ البداية</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isUploading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">وقت البداية</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">تاريخ النهاية</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isUploading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">وقت النهاية</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isUploading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all ${
              isUploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {isUploading ? 'جاري الإنشاء...' : 'إنشاء الجدول الذكي'}
          </button>
        </form>

        {error && <div className="text-red-600 text-center p-4">{error}</div>}

        {htmlCode && (
          <div className="space-y-4">
            <div className="text-center bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">الجدول الزمني المولد</h3>
              <iframe 
                src={createPreviewUrl()}
                className="w-full h-96 border rounded-lg"
                title="Generated Timetable"
              />
              <a
                href={createPreviewUrl()}
                download="timetable.html"
                className="mt-4 inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                تحميل الجدول
              </a>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <svg className="w-6 h-6 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 className="mt-2 font-medium">دقة عالية</h3>
            <p className="text-sm text-gray-600">تحويل ذكي باستخدام أحدث نماذج الذكاء الاصطناعي</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <svg className="w-6 h-6 mx-auto text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <h3 className="mt-2 font-medium">آمن تماماً</h3>
            <p className="text-sm text-gray-600">جميع الملفات محذوفة تلقائياً بعد التحويل</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <svg className="w-6 h-6 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <h3 className="mt-2 font-medium">سرعة فائقة</h3>
            <p className="text-sm text-gray-600">معالجة الملفات خلال ثوانٍ معدودة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;