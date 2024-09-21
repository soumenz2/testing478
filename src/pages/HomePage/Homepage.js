import React, { useState, useEffect } from 'react';
import './HomePage.css';
import API_BASE_URL from '../../config/config';
import axios from 'axios';

const HomePage = () => {
  const [storyData, setStoryData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categoryList = ['All', 'Music', 'Movies', 'World', 'India'];

  const fetchStoryData = async (category, limit = 4) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getStoryByCategory?category=${category}&limit=${limit}`);
      if (response.status === 200) {
        const newData = response.data.data;
        setStoryData(newData);
        console.log(newData)
      } else {
        console.log('Error fetching data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching story data:', error);
    }
  };

  useEffect(() => {
    fetchStoryData(selectedCategory); // Fetch stories for the selected category on mount
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    if(category==='All'){
      setSelectedCategory(category);
    fetchStoryData(category); 
    }
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
        <div key={index} className="category-section">
          <h2>Top Stories in {categoryData.category}</h2>
          {Array.isArray(categoryData.stories) && categoryData.stories.length === 0 ? (
            <p>No stories found</p>
          ) : (
            <>
              <div className="stories-grid">
                {/* Map through the stories */}
                {Array.isArray(categoryData.stories) && categoryData.stories.map((story, idx) => (
                  <div key={idx} className="story-card">
                    <div className="story-image"></div>
                    <h3>{story?.slides[0].heading}</h3>
                    <p>{story?.slides[0].description}</p>
                  
                  </div>
                ))}
              </div>

              {/* Show 'See More' if there are more stories */}
              {categoryData.hasMore && !expandedCategories[categoryData.category] && (
                <button className="see-more-btn" onClick={() => handleSeeMore(categoryData.category)}>
                  See More
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default HomePage;
