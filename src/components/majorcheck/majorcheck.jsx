import React, { useState , useEffect } from 'react';
import Majorcheck from './majorcheckcomponent';
import axios from 'axios';

const QuizMaker = () => {

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
   const [files, setFiles] = useState([]);
 const [selectedFile, setSelectedFile] = useState(null);
 

    //هان بنحط ال api

    


  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <form className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        🎓 Major Fit Checker 🎓
      </h2>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Enter a Major
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>
      
      <div className="flex flex-nowrap overflow-x-auto pb-4 -mx-4 px-4">
        {/* Optional: Add major categories or tags here */}
      </div>
  
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl 
          hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
            </svg>
            Checking...
          </span>
        ) : 'Check My Fit'}
      </button>
  
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}
    </form>
  
    {questions.length > 0 && <Majorcheck questions={questions} />}
  </div>
  
  );
};

export default QuizMaker;