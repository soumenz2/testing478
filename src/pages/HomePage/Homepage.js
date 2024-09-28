import React, { useState, useEffect } from 'react';
import './HomePage.css';
import API_BASE_URL from '../../config/config';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import StoryDetailModal from '../modalPage/storyDetailsModal';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const [storyData, setStoryData] = useState( [] );
  const [expandedCategories, setExpandedCategories] = useState( {} );
  const [selectedCategory, setSelectedCategory] = useState( "All" );
  const [selectedStoryId, setSelectedStoryId] = useState( null );
  const [selectedSlideIndex, setSelectedSlideIndex] = useState( 0 );
  const [loading, setLoading] = useState( false ); // Add loading state
  const categoryList = [
    { name: 'All', image: 'https://cdn.pixabay.com/photo/2014/07/02/08/30/images-381937_960_720.jpg' },
    { name: 'Music', image: 'https://cdn.pixabay.com/photo/2024/02/02/22/05/audio-8549150_1280.jpg' },
    { name: 'Movies', image: 'https://cdn.pixabay.com/photo/2023/11/14/15/46/nikon-8388022_1280.jpg' },
    { name: 'World', image: 'https://cdn.pixabay.com/photo/2012/01/09/09/59/earth-11595_1280.jpg' },
    { name: 'India', image: 'https://media.istockphoto.com/id/2151557493/photo/the-india-gate-or-all-india-war-memorial-with-illuminated-in-new-delhi-in-india.jpg?s=1024x1024&w=is&k=20&c=eyDHzqBwypgAW5oedcqTRo4EjAPs1tZmdlVB2qhYO68=' },
  ];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect( () => {
    fetchStoryData( selectedCategory );
  }, [selectedCategory] );

  const fetchStoryData = async ( category, limit = 4 ) => {
    setLoading( true );
    try {
      const response = await axios.get( `${ API_BASE_URL }/getStoryByCategory?category=${ category }&limit=${ limit }` );
      if ( response.status === 200 ) {
        const newData = response.data.data;
        setStoryData( newData );
      } else {
        console.log( 'Error fetching data:', response.data.message );
      }
    } catch ( error ) {
      console.error( 'Error fetching story data:', error );
    }
    setLoading( false );
  };

  const handleStoryClick = ( storyId ) => {
    setSelectedStoryId( storyId );
    setSelectedSlideIndex( 0 );
    setSelectedStoryId( storyId )
    // navigate( `/story/${ storyId }?slideIndex=0` );
  };

  const handleCategoryClick = ( category ) => {
    setSelectedCategory( category );
    setExpandedCategories( {} );
    fetchStoryData( category, 4 );
  };

  const handleSeeMore = ( category ) => {
    fetchStoryData( category, 100 );
    setExpandedCategories( prevState => ( {
      ...prevState,
      [category]: true
    } ) );
  };
  const handleStoryCreated = () => {
    fetchStoryData();
  };

  return (
    <div className="homepage">
      <ToastContainer />
      <div className="category-section">
        {categoryList.map( ( category, index ) => (
          <div
            key={index}
            className={`category-card ${ selectedCategory === category.name ? 'active' : '' }`}
            onClick={() => handleCategoryClick( category.name )}
          >
            <div
              className="background"
              style={{ backgroundImage: `url(${ category.image })`, borderRadius: '25px', backgroundSize: 'cover', }}
            />
            <h3>{category.name}</h3>
          </div>

        ) )}
      </div>

      {loading ? (
        // Show a loading spinner when loading is true
        <div className="loading-container">
          <div className="spinner"></div> {/* This will be your loader */}
        </div>
      ) : (
        // Map through the story data when loading is false
        storyData.map( ( categoryData, index ) => (
          <div key={index} className="category-section1">
            <h2 className="top-stories-heading">Top Stories in {categoryData.category}</h2>
            {Array.isArray( categoryData.stories ) && categoryData.stories.length === 0 ? (
              <div className="no-stories-container">
                <p>No stories found</p>
              </div>
            ) : (
              <>
                <div className="stories-grid">
                  {/* Map through the stories */}
                  {Array.isArray( categoryData.stories ) && categoryData.stories.map( ( story, idx ) => (
                    <div key={idx} className="story-card" onClick={() => handleStoryClick( story.storyID )}>
                      {story?.slides[0].imageOrVideoURl.endsWith( '.mp4' ) ? (
                        <video
                          src={story?.slides[0].imageOrVideoURl}
                          autoPlay
                          muted
                          playsInline
                          style={{ width: '100%', height: '70%', objectFit: 'cover' }}
                        />
                      ) : (
                        <img
                          src={story?.slides[0].imageOrVideoURl}
                          alt={`Slide ${ 0 + 1 }`}
                          style={{ width: '100%', height: '70%', objectFit: 'cover' }}
                        />
                      )}
                      <h1>{story?.slides[0].heading}</h1>
                      <p>{story?.slides[0].description}</p>
                    </div>
                  ) )}
                </div>

                {/* Show 'See More' if there are more stories */}
                {categoryData.hasMore && !expandedCategories[categoryData.category] && (
                  <div className="see-more-container">
                    <button className="see-more-btn" onClick={() => handleSeeMore( categoryData.category )}>
                      See More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) )
      )}

      {/* Open StoryDetailModal only if selectedStoryId is set */}
      {selectedStoryId && (
        <div className="story-modal-home-container">
          <StoryDetailModal
            storyID={selectedStoryId}
            slideIndex={selectedSlideIndex}
            onClose={() => setSelectedStoryId( null )}
            onStoryCreated={handleStoryCreated}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
