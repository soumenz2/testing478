import React, { useState, useEffect } from 'react';
import './HomePage.css';
import API_BASE_URL from '../../config/config';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import StoryDetailModal from '../modalPage/storyDetailsModal';

const HomePage = () => {
  const [storyData, setStoryData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0); // New state for slide index
  const categoryList = ['All', 'Music', 'Movies', 'World', 'India'];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchStoryData(selectedCategory); // Fetch stories for the selected category on mount
  }, [selectedCategory]);

  useEffect(() => {
    // Check if storyId and slideIndex are in the URL
    const storyIdFromUrl = new URLSearchParams(location.search).get('storyId');
    const slideIndexFromUrl = new URLSearchParams(location.search).get('slideIndex');
    
    if (storyIdFromUrl) {
      setSelectedStoryId(storyIdFromUrl);
      if (slideIndexFromUrl && !isNaN(slideIndexFromUrl)) {
        setSelectedSlideIndex(parseInt(slideIndexFromUrl, 10)); // Set slide index if available
      }
    }
  }, [location]);

  const handleStoryClick = (storyId) => {
    // Set the selected story ID and update the URL
    setSelectedStoryId(storyId);
    setSelectedSlideIndex(0); // Default to the first slide
    navigate(`/story/${storyId}?slideIndex=0`); // Redirect to story page
  };

  const handleModalClose = () => {
    setSelectedStoryId(null);
    setSelectedSlideIndex(0); // Reset slide index when closing
    navigate('/');  // Navigate back to the homepage when the modal is closed
  };

  const fetchStoryData = async (category, limit = 4) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getStoryByCategory?category=${category}&limit=${limit}`);
      if (response.status === 200) {
        const newData = response.data.data;
        setStoryData(newData);
      } else {
        console.log('Error fetching data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching story data:', error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchStoryData(category, 4); // Fetch stories for the clicked category
  };

  const handleSeeMore = (category) => {
    fetchStoryData(category, 100); // Load more data when 'See More' is clicked
    setExpandedCategories(prevState => ({
      ...prevState,
      [category]: true // Mark the category as expanded
    }));
  };

  return (
    <div className="homepage">
      <div className="category-section">
        {categoryList.map((category, index) => (
          <div key={index}
            className={`category-card ${selectedCategory === category ? 'active' : ''}`} 
            onClick={() => handleCategoryClick(category)}>
            <div className="category-image"></div>
            <h3>{category}</h3>
          </div>
        ))}
      </div>

      {/* Map through the story data to render categories and their stories */}
      {storyData.map((categoryData, index) => (
        <div key={index} className="category-section1">
          <h2 className="top-stories-heading">Top Stories in {categoryData.category}</h2>
          {Array.isArray(categoryData.stories) && categoryData.stories.length === 0 ? (
            <div className="no-stories-container">
              <p>No stories found</p>
            </div>
          ) : (
            <>
              <div className="stories-grid">
                {/* Map through the stories */}
                {Array.isArray(categoryData.stories) && categoryData.stories.map((story, idx) => (
                  <div key={idx} className="story-card" onClick={() => handleStoryClick(story.storyID)}>
                    {story?.slides[0].imageOrVideoURl.endsWith('.mp4') ? (
                      <video 
                        src={story?.slides[0].imageOrVideoURl} 
                        autoPlay 
                        muted 
                        playsInline
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                      />
                    ) : (
                      <img
                        src={story?.slides[0].imageOrVideoURl}
                        alt={`Slide ${0 + 1}`}
                      />
                    )}
                    <h3>{story?.slides[0].heading}</h3>
                    <p>{story?.slides[0].description}</p>
                  </div>
                ))}
              </div>

              {/* Show 'See More' if there are more stories */}
              {categoryData.hasMore && !expandedCategories[categoryData.category] && (
                <div className="see-more-container">
                  <button className="see-more-btn" onClick={() => handleSeeMore(categoryData.category)}>
                    See More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
      
      {/* Open StoryDetailModal only if selectedStoryId is set */}
      {selectedStoryId && (
        <StoryDetailModal storyID={selectedStoryId} slideIndex={selectedSlideIndex} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default HomePage;
