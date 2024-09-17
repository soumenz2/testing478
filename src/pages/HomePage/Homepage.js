// HomePage.js
import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="category-section">
        {['All', 'Medical', 'Fruits', 'World', 'India'].map((category, index) => (
          <div key={index} className="category-card">
            <div className="category-image"></div>
            <h3>{category}</h3>
          </div>
        ))}
      </div>

      <div className="top-stories">
        <h2>Top Stories About Food</h2>
        <div className="stories-grid">
          {[1, 2, 3, 4].map((story, index) => (
            <div key={index} className="story-card">
              <div className="story-image"></div>
              <h3>Heading comes here</h3>
              <p>
                Inspirational designs, illustrations, and graphic elements from the world's best designers.
              </p>
            </div>
          ))}
        </div>
        <button className="see-more-btn">See more</button>
      </div>
    </div>
  );
};

export default HomePage;
