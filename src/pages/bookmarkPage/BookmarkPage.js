import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookmarkPage.css'; 
import API_BASE_URL from '../../config/config'; 
import { useSelector } from "react-redux";

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [expanded, setExpanded] = useState(false); 
  const [loading, setLoading] = useState(true); 
  const userIDfromREdux = useSelector((state) => state.user.userId);
  
  useEffect(() => {
    // Fetch bookmarks when component mounts
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getbookmarkbyId?userID=${userIDfromREdux}`); 
      setBookmarks(response.data.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleSeeMore = () => {
    setExpanded(true); // Expand to show all bookmarks
  };

  // Get the first 4 bookmarks or all if expanded
  const visibleBookmarks = bookmarks.slice(0, expanded ? bookmarks.length : 4); 

  const renderMedia = (bookmark) => {
    const isVideo = bookmark.imageOrVideoURl.endsWith('.mp4') || bookmark.imageOrVideoURl.endsWith('.mov'); // You can add other video formats if needed

    if (isVideo) {
      return (
        <video controls className="bookmark-media">
          <source src={bookmark.imageUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={bookmark.imageOrVideoURl}
          alt={bookmark.heading}
          className="bookmark-media"
        />
      );
    }
  };

  return (
    <div className="bookmark-page">
      <h2>Your Bookmarks</h2>
      
      {loading ? ( // Render loading state
        <div className="loading-indicator">Loading bookmarks...</div>
      ) : (
        <>
          <div className="bookmark-grid">
            {visibleBookmarks.map((bookmark, index) => (
              <div key={index} className="bookmark-card">
                {renderMedia(bookmark)} {/* Conditionally render image or video */}
                <h3>{bookmark.heading}</h3>
                <p>{bookmark.description}</p>
              </div>
            ))}
          </div>

          {!expanded && bookmarks.length > 4 && (
            <button className="see-more-btn" onClick={handleSeeMore}>
              See More
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default BookmarkPage;
