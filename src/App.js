import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import NavBar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero/Hero';
import HowToUse from './components/HowToUse/HowToUse';
import Reviews from './components/Reviews/Reviews';
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';
import MyCourses from './components/MyCourses/mycourses';
import FileUploadForm from './components/MyCourses/addcourse';
import QuizMaker from './components/quizMaker/quizmaker';
import Timetable from './components/timetable/timetable';
import FilesInCourses from './components/MyCourses/filesInCourse';
import Majorcheck from './components/majorcheck/majorcheckr';
import TestMe from './components/testme/testme';
import FilesTestMe from './components/testme/choosefiletestme';
import Addfiletocourse from './components/MyCourses/addfile';
import EditCourses from "./components/MyCourses/EditCourses";

import { Link } from 'react-router-dom';

function App() {
  const [auth, setAuth] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    axios.get("http://localhost:5000/profile", { withCredentials: true })
      .then(res => {
        if (res.data.email) {
          setAuth(true);
          setProfile({ name: res.data.name, email: res.data.email , id : res.data.id});
        } else {
          setAuth(false);
          setProfile(null);
        }
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setAuth(false);
        setProfile(null);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {profile ?       
         <NavBar profile={profile} />
         : 
          <NavBar profile={""}/>
         }
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Hero /><HowToUse /><Reviews /></>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/majorcheck" element={<Majorcheck />} />

          {/* Private Routes */}
          {auth ? (
            <>
              <Route path="/TestMe" element={<TestMe />}/>
              <Route path="/FilesTestMe" element={<FilesTestMe />}/>
              <Route path="/MyCourses" element={<MyCourses />} />
              <Route path="/addCourse" element={<FileUploadForm />} />
              <Route path="/QuizMaker" element={<QuizMaker />} />
              <Route path="/FilesInCourses" element={<FilesInCourses />} />
              <Route path="/Timetable" element={<Timetable />} />
              <Route path="/addFile" element={<Addfiletocourse />} />
              <Route path="/EditCourse" element={<EditCourses />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
          <Link to="/terms" className="text-sm hover:underline">Terms and Services</Link>
          <span className="text-sm text-gray-400">© 2025 Made by Darsni Group.</span>
        </div>
      </div>
    </Router>
  );
}

export default App;
