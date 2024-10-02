import React,{useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes ,Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/Homepage'; // Your HomePage component
import StoryDetailModal from './pages/modalPage/storyDetailsModal'; // Your StoryDetailPage component
import Navbar from './pages/navbar/navbar'; // Your Navbar component
import BookmarkPage from './pages/bookmarkPage/BookmarkPage';
import { useSelector,useDispatch} from "react-redux";
import { setUserId } from '../src/redux/userslice'
// App component
function App() {
  const userIDfromRedux = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check sessionStorage for userId and update Redux if present
    const userIdFromSession = sessionStorage.getItem("user");

    if (userIdFromSession && !userIDfromRedux) {
      // If userId is found in sessionStorage and not already in Redux, dispatch it
      dispatch(setUserId(userIdFromSession));
    }
  }, [dispatch, userIDfromRedux]);

  const userID = useSelector((state) => state.user.userId); 
  return (
    <div className="App">
      <Navbar />  {/* Navbar is rendered for all pages */}
      
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/story/:storyID" element={<StoryDetailModal />} />
        {userIDfromRedux ? (
            <Route path="/bookmarks" element={<BookmarkPage />} />
          ) : (
            <Route path="/bookmarks" element={<Navigate to="/" />} />
          )}
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
