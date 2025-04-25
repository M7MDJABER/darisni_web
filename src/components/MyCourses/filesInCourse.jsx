import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFile, FaQuestionCircle, FaCalendarAlt, FaBrain, FaRegFilePdf, FaPlus } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Test = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const courseId = location.state?.course;
    const courseName = location.state?.courseName;
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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


    const handlequiz = (courseId) => (e) => {
        e.preventDefault();
        navigate("/QuizMaker", { state: { courseId: courseId } });
    };

    const handleUploadFile = (courseId) => (e) => {
        e.preventDefault();
        navigate("/addFile", { state: { courseId: courseId } });
    };

    const handleTimeTable = (courseId) => (e) => {
        e.preventDefault();
        navigate("/timetable", { state: { courseId: courseId } });
    };

    const handleTestMe = (fileUrl) => (e) => {
        e.preventDefault();
        navigate("/TestMe", { state: { fileUrl: fileUrl } });
        console.log("the fileUrl : ", fileUrl);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="text-red-500 text-xl font-semibold">{error}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
                    Course Materials {courseName}
                </h1>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center md:justify-start">
                    <Link onClick={handlequiz(courseId)} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                        <FaQuestionCircle className="text-xl" />
                        <span className="font-semibold">Generate Quiz</span>
                    </Link>
                    <Link onClick={handleTimeTable(courseId)} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                        <FaCalendarAlt className="text-xl" />
                        <span className="font-semibold">Generate Timetable</span>
                    </Link>
                    <Link className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                        <FaBrain className="text-xl" />
                        <span className="font-semibold">Test Me</span>
                    </Link>
                </div>

                {/* Files Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {files.map((file) => (
                        <Link
                            key={file.id}
                            onClick={handleTestMe(file.url)}
                            className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-200 transform hover:-translate-y-1"
                        >
                            <div className="relative mb-4 text-indigo-600 group-hover:text-indigo-700 transition-colors">
                                <div className="absolute inset-0 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <FaFile className="text-5xl relative z-10" />
                                <FaRegFilePdf className="text-xl absolute bottom-1 right-1 text-red-500 bg-white rounded-full p-1" />
                            </div>
                            <div className="text-center">
                                <p className="text-gray-700 font-medium text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    {file.filename}
                                </p>
                                <span className="text-xs text-gray-500 mt-1 inline-block">
                                    {Math.round(Math.random() * 5 + 1)} MB
                                </span>
                            </div>
                        </Link>
                    ))}

                    {/* Add File Button */}
                    <button onClick={handleUploadFile(courseId)} className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-dashed border-gray-300 hover:border-indigo-300 transform hover:-translate-y-1 group">
                        <div className="mb-4 text-indigo-600 group-hover:text-indigo-700 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
                                <FaPlus className="text-3xl text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-700 font-medium text-sm group-hover:text-indigo-600 transition-colors">
                                Add New File
                            </p>
                            <span className="text-xs text-gray-500 mt-1 inline-block">
                                PDF, DOC, PPT
                            </span>
                        </div>
                    </button>
                </div>

                {files.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No files available for this course.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Test;