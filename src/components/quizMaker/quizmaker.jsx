import React, { useState, useEffect } from 'react';
import QuizComponent from './quizcomponent';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { FaFile, FaQuestionCircle, FaCalendarAlt, FaBrain, FaRegFilePdf, FaPlus } from "react-icons/fa";

const QuizMaker = () => {
  const location = useLocation();
  const courseId = location.state?.courseId;
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'http://localhost:5000/api/generate-quiz',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            NumberOfQuestion: Math.min(numQuestions, 10),
            fileUrl: selectedFile
          })
        }
      );


      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setQuestions(data.questions.slice(0, 10));
    } catch (err) {
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          ✨ Quiz Generator ✨
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Number of Questions (Max 10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Math.min(e.target.value, 10))}
            className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div className="flex flex-nowrap overflow-x-auto pb-4 -mx-4 px-4">
          {files.map((file) => (
            <label
              key={file.id}
              className={`
      flex-shrink-0 relative m-4 p-6 bg-white rounded-xl shadow-lg
      border-2 cursor-pointer transition-all duration-300
      ${selectedFile === file.url
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
                  <div className={`absolute inset-0 rounded-full transition-opacity ${selectedFile === file.url ? 'opacity-100 bg-indigo-100' : 'opacity-0'
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
                  <p className={`font-medium text-sm line-clamp-2 ${selectedFile === file.url ? 'text-indigo-700' : 'text-gray-700'
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
        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl 
            hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              </svg>
              Generating...
            </span>
          ) : 'Generate Quiz'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}
      </form>

      {questions.length > 0 && <QuizComponent questions={questions} />}
    </div>
  );
};

export default QuizMaker;