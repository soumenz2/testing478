import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage/Homepage';  // Your HomePage component
import StoryDetailModal from './pages/modalPage/storyDetailsModal';  // Your StoryDetailPage component
import Navbar from './pages/navbar/navbar';  // Your Navbar component

// App component
function App() {
  const location = useLocation();  // Get the current path

  // Check if the current path is for story details
  const isStoryDetailPage = location.pathname.startsWith('/story/');

  return (
    <div className="App">
      {/* Conditionally render the Navbar based on the current path */}
      {!isStoryDetailPage && <Navbar />}  
      
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/story/:storyID" element={<StoryDetailModal />} />
      </Routes>
    </div>
  );
}

// App wrapper to enable useLocation inside App
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
