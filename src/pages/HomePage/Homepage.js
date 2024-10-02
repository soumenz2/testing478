import React, { useState, useEffect } from 'react';
import './HomePage.css';
import API_BASE_URL from '../../config/config';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import StoryDetailModal from '../modalPage/storyDetailsModal';
import EditStoryModal from '../modalPage/editStory';

import 'react-toastify/dist/ReactToastify.css';
import { useSelector} from "react-redux";
import { FaRegEdit } from "react-icons/fa";



const HomePage = () => {
  const [storyData, setStoryData] = useState( [] );
  const [userStories, setUserStories] = useState([]);
  const [expandedUserStories, setExpandedUserStories] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState( {} );
  const [selectedCategory, setSelectedCategory] = useState( "All" );
  const [selectedStoryId, setSelectedStoryId] = useState( null );
  const [selectedSlideIndex, setSelectedSlideIndex] = useState( 0 );
  const [loading, setLoading] = useState( false ); 
  const [editSoryId,setEditStoryId]=useState(null)
  const [isEditModalOpen,setIsEditModalOpen]=useState(false)
  const [isViewModalOpen,setIsViewModalOpen]=useState(false)
  const userIDfromREdux = useSelector((state) => state.user.userId);
  const categoryList = [
    { name: 'All', image: 'https://cdn.pixabay.com/photo/2014/07/02/08/30/images-381937_960_720.jpg' },
    { name: 'Music', image: 'https://cdn.pixabay.com/photo/2022/06/02/18/02/violin-7238620_1280.jpg' },
    { name: 'Movies', image: 'https://cdn.pixabay.com/photo/2023/11/14/15/46/nikon-8388022_1280.jpg' },
    { name: 'World', image: 'https://cdn.pixabay.com/photo/2012/01/09/09/59/earth-11595_1280.jpg' },
    { name: 'India', image: 'https://media.istockphoto.com/id/2151557493/photo/the-india-gate-or-all-india-war-memorial-with-illuminated-in-new-delhi-in-india.jpg?s=1024x1024&w=is&k=20&c=eyDHzqBwypgAW5oedcqTRo4EjAPs1tZmdlVB2qhYO68=' },
  ];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect( () => {
    fetchStoryData( selectedCategory );
    if(userIDfromREdux){
      fetchUserStories(userIDfromREdux,4)
    }
  }, [selectedCategory,userIDfromREdux] );

  const fetchStoryData = async ( category, limit = 4 ) => {
    
    setLoading( true );
    try {
      console.log("entered here")
      
      console.log('Loading started...');
      const response = await axios.get( `${ API_BASE_URL }/getStoryByCategory?category=${ category }&limit=${ limit }` );
      
      if ( response.status === 200 ) {
       
        const newData = response.data.data;
        setStoryData( newData );
        console.log("data saved")
      } else {
        console.log( 'Error fetching data:', response.data.message );
      }
    } catch ( error ) {
      console.error( 'Error fetching story data:', error );
    }finally {
      setLoading(false); 
      console.log('Loading stopped...');
    }
   
  };
  const fetchUserStories = async (userIDfromREdux, limit = 4) => {
    try {
      console.log("userId",userIDfromREdux)
      console.log("limt",limit)
      const response = await axios.get(`${API_BASE_URL}/getUserStory?userID=${userIDfromREdux}&limit=${limit}`);
      if (response.status === 200) {
        setUserStories(response.data.data);
        console.log(response.data.data)
      } else {
        console.log('Error fetching user stories:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user stories:', error);
    }
  };
  const closeEditModal=()=>{
 
    setIsEditModalOpen(false)
    setEditStoryId(null)

  }
  const handleStoryEdited=()=>{
    fetchStoryData('All',4)
    fetchUserStories(userIDfromREdux, 4);
    closeEditModal()
  }
  const handleSeeMoreUserStories = () => {
    fetchUserStories(userIDfromREdux, 100);
    setExpandedUserStories(true);
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
  const handleEditStory=(storyId)=>{
    console.log("edit clicked!!!!!")
    setIsEditModalOpen(true);
    setEditStoryId(storyId)

  
  
  }

  return (
    <div className="homepage">
   
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
      {userIDfromREdux && (
  <div className="your-stories-section">
    <h2 className="top-stories-heading">Your Stories</h2>
    
    {/* Check if there are any user stories */}
    {userStories.length === 0 ? (
      // Show "Your stories not present" when there are no stories
      <div className="no-stories-container">
        <p>Your stories not present</p>
      </div>
    ) : (
      <>
        {/* Display the user's stories */}
        <div className="stories-grid">
          {userStories.map((story, idx) => (
            <div key={idx} className="story-card" >
              {story?.slides[0].imageOrVideoURl.endsWith('.mp4') ? (
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
                  alt={`Slide ${0 + 1}`}
                  style={{ width: '100%', height: '70%', objectFit: 'cover' }}
                />
              )}
              <h1>{story?.slides[0].heading}</h1>
              <p className='description-p'>{story?.slides[0].description}</p>
              <button className="edit-btn" onClick={() => handleEditStory(story.slides[0].storyID)}>
                <FaRegEdit />
                      Edit
                    </button>
            </div>
          ))}
        </div>

        {/* Show "See More" only if there are more than 4 stories */}
        {userStories.length > 4 && !expandedUserStories && (
          <div className="see-more-container">
            <button className="see-more-btn" onClick={handleSeeMoreUserStories}>
              See More
            </button>
          </div>
        )}
      </>
    )}
  </div>
)}


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
                      <p className='description-p'>{story?.slides[0].description}</p>
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
      {selectedStoryId  && (
        <div className="story-modal-home-container">
          <StoryDetailModal
            storyID={selectedStoryId}
            slideIndex={selectedSlideIndex}
            onClose={() => setSelectedStoryId( null )}
            onStoryCreated={handleStoryCreated}
          />
        </div>
      )}
            {isEditModalOpen && (
        <div className="story-modal-home-container">
          <EditStoryModal
            storyID={editSoryId}
            onClose={closeEditModal}
            onStoryEdited={handleStoryEdited}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
