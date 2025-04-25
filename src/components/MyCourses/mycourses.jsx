import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [showOptions, setShowOptions] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Generate random pastel color
  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  };

  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getCourses", { withCredentials: true });
        setCourses(res.data);
      } catch (err) {
        setError("Failed to fetch courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  const handleDelete = async (courseId) => {
    try {
      if (window.confirm("Are you sure you want to delete this course?")) {
        const response = await axios.post(`http://localhost:5000/deleteCourse/${courseId}`, null, {
          withCredentials: true
        });
  
      }
    } catch (err) {
      window.location.reload();
    }
  };

  const handelEdit = (courseId , courseName) => (e) => {
    e.preventDefault();
    navigate("/EditCourse" , {state : {
      courseId : courseId ,
      courseName : courseName
    }})
  };

  const handleCourseNavigation = (courseId , courseName) => (e) => {
    e.preventDefault();
    navigate("/filesInCourses", { state: { course: courseId , courseName : courseName } });
  };

  return (
    <div className="min-h-screen  from-indigo-100 via-purple-100 to-pink-100 p-8 relative overflow-hidden">

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center font-serif drop-shadow-md">
          My Learning Universe
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Add New Course Card */}
          <Link
            to="/addCourse"
            className="group h-64 flex items-center justify-center bg-white/30 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-dashed border-gray-300 hover:border-indigo-400 relative overflow-hidden"
          >
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto transition-all group-hover:bg-indigo-200 group-hover:scale-110">
                <svg
                  className="w-8 h-8 text-indigo-600 group-hover:text-indigo-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-700 group-hover:text-indigo-700">
                Create New Course
              </p>
            </div>
          </Link>

          {/* Loading State */}
          {loading && (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="col-span-full text-center py-6">
              <div className="inline-flex items-center p-4 text-red-700 bg-red-100/90 backdrop-blur-sm rounded-xl shadow-sm">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Course Cards */}
          {courses.map((course) => {
            const cardColor = getRandomColor();

            return (
              <div
                key={course.id}
                className="relative h-64 bg-white/30 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
              >
                <div className="h-full p-6">
                  {/* Three-dot menu */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowOptions(showOptions === course.id ? null : course.id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-20"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>

                  {/* Options dropdown */}
                  {showOptions === course.id && (
                    <div className="absolute top-14 right-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-2 min-w-[160px] z-30">
                      <button onClick={ handelEdit(course.id , course.name)}className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50/50 rounded-lg transition-colors">
                        ✏️ Edit Course
                      </button>
                      <button onClick={() => handleDelete(course.id)} className="w-full px-4 py-3 text-left text-red-600 hover:bg-gray-50/50 rounded-lg transition-colors">
                        🗑️ Delete Course
                      </button>
                    </div>
                  )}

                  {/* Dynamic shape background */}
                  <div
                    className={`absolute -top-20 -right-20 w-64 h-64 shape2`}
                    style={{ backgroundColor: cardColor }}
                  />

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 drop-shadow-md">
                        {course.name}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {course.description || "Explore this course content and discover new learning opportunities..."}
                      </p>
                    </div>

                    {/* Explore Course Button */}
                    <button
                      onClick={handleCourseNavigation(course.id , course.name)}
                      className="mt-4 w-full bg-white/90 backdrop-blur-sm py-3 px-6 rounded-xl shadow-sm hover:bg-white transition-colors font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-100 hover:border-indigo-200"
                    >
                      Explore Course →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
   
        .shape2 {
          clip-path: circle(60% at 80% 20%);
        }
      `}</style>
    </div>
  );
};

export default MyCourses;