import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookmarkPage.css'; 
import API_BASE_URL from '../../config/config'; 
import { useSelector } from "react-redux";
import SlideDetailModal from '../modalPage/bookmarkSlideModal';

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [selectedslideId,setSelectedSlideId]=useState(null)
  const [selectedstoryId,setSelectedStoryId]=useState(null)

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
  const handleStoryClick = ( slideId ,storyId) => {
    setSelectedSlideId( slideId );
    setSelectedStoryId(storyId)
 
  };

  return (
    <div className="bookmark-page">
      <h2>Your Bookmarks</h2>
      
      {loading ? ( 
        <div className="loading-indicator">Loading bookmarks...</div>
      ) : (
        <>
          <div className="bookmark-grid">
            {bookmarks.map((bookmark, index) => (
              <div key={index} className="bookmark-card" onClick={()=>handleStoryClick(bookmark.slideID,bookmark.storyID)}>
                {bookmark.imageOrVideoURl.endsWith('.mp4') ? (
                <video
                  src={bookmark.imageOrVideoURl}
                  autoPlay
                  muted
                  playsInline
                  style={{ width: '100%', height: '70%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={bookmark.imageOrVideoURl}
                  alt={`Slide ${0 + 1}`}
                  style={{ width: '100%', height: '70%', objectFit: 'cover' }}
                />
              )}
                <h3>{bookmark.heading}</h3>
                <p className='description-p'>{bookmark.description}</p>
              </div>
            ))}
          </div>

          
        </>
      )}
      {selectedslideId  && (
        <div className="story-modal-home-container">
          <SlideDetailModal
            slideID={selectedslideId}
            storyID={selectedstoryId}
            onClose={() => setSelectedSlideId( null )}
           
          />
        </div>
      )}
    </div>
  );
};

export default BookmarkPage;
