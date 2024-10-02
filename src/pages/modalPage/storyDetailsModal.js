import React, { useEffect, useState,useCallback } from 'react';
import './StoryDetailModal.css';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/config';
import { FaShare, FaBookmark, FaRegBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import LoginModal from './login';


const StoryDetailModal = ( props ) => {
  const [story, setStory] = useState( null );
  const [slides, setSlides] = useState( [] );
  const [currentSlide, setCurrentSlide] = useState( 0 );
  const [progress, setProgress] = useState( 0 );
  const [isBookmarked, setIsBookmarked] = useState( false ); 
  const [isLiked, setIsLiked] = useState( false );
  const [likeCount, setLikeCount] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userIDfromREdux = useSelector((state) => state.user.userId);
  const [isLoading, setIsLoading] = useState(true);

  let { storyID } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const defaultImageTime = 5000; 
  const defaultVideoTime = 15000; 

 


  if ( storyID === undefined ) {
    storyID = props?.storyID
  }



  const fetchStoryDetails = async () => {
    try {
      setIsLoading(true); 
      const response = await axios.get( `${ API_BASE_URL }/getStorybyId?storyID=${ storyID }` );
      if ( response.status === 200 ) {
        setStory( response?.data );
        setSlides( response?.data?.slides || [] );
        setLikeCount(response?.data.slides[0].likeCount )
      } else {
        console.log( 'Error fetching story details' );
      }
    } catch ( error ) {
      console.log( 'Error fetching story:', error );
    }finally {
      setIsLoading(false);
    }
  };

  useEffect( () => {
    console.log( props )
    console.log( storyID )
    if ( storyID ) {
      fetchStoryDetails();
    }
  }, [storyID, props] );

  useEffect( () => {
    // Set current slide based on URL query parameter
    const queryParams = new URLSearchParams( location.search );
    const slideIndex = queryParams.get( 'slideIndex' );

    if ( slideIndex && !isNaN( slideIndex ) ) {
      const index = parseInt( slideIndex, 10 );
      if ( index >= 0 && index < slides.length ) {
        setCurrentSlide( index );
      }
    }
  }, [location.search, slides] );

  useEffect( () => {
    if ( slides.length === 0 ) return; // Prevent errors if slides are empty

    // Reset progress for the new slide
    setProgress( 0 );

    // Determine the duration for the current slide
    const currentSlideData = slides[currentSlide];
    console.log( "video duration", currentSlideData.videoDuration )
    const isVideo = currentSlideData.imageOrVideoURl.endsWith( '.mp4' );
    const video = document.createElement( 'video' );
    video.src = currentSlideData.imageOrVideoURl;
    console.log("video source",video.src)
    console.log( "video duration2",  video.duration )
    const slideDuration = isVideo ? defaultVideoTime  : defaultImageTime;

    const progressInterval = setInterval( () => {
      setProgress( ( prev ) => {
        if ( prev >= 100 ) {
          clearInterval( progressInterval );
          handleNextSlide();
          return 0;
        }
        return prev + ( 100 / ( slideDuration / 100 ) ); // Calculate increment based on slide duration
      } );
    }, 100 ); // 

    return () => clearInterval( progressInterval ); // Clear interval on unmount or slide change
  }, [currentSlide, slides] );

  const handleNextSlide = () => {
    if ( slides.length > 0 && currentSlide < slides.length - 1 ) {
      setLikeCount(slides[currentSlide+1].likeCount)
      setCurrentSlide( currentSlide + 1 );
    } else if ( currentSlide === slides.length - 1 ) {
      //handleClose();
    }
  };

  const handlePrevSlide = () => {
    if ( slides.length > 0 && currentSlide > 0 ) {
      setLikeCount(slides[currentSlide-1].likeCount)
      setCurrentSlide( currentSlide - 1 );
    }
  };

  const handleClose = () => {
    if ( props?.storyID != null ) {
      props?.onClose()
    }
    navigate( '/' );
  };

  const handleShare = () => {
    const url = `${ window.location.origin }/story/${ storyID }?slideIndex=${ currentSlide }`;
    navigator.clipboard.writeText( url )
      .then( () => {
        toast.success('Story URL copied to clipboard!')
      } )
      .catch( err => {
        console.error( 'Could not copy URL: ', err );
      } );
  };

  const toggleBookmark = async() => {
    if (!userIDfromREdux) {
      
      setIsLoginOpen(true);
      return;
    }
    try {
      const payload = {
        slideID: slides[currentSlide].slideID,
        userID: userIDfromREdux,
      };
      console.log(payload)
      if (isBookmarked) {
      
        const response= await axios.post(`${API_BASE_URL}/undoBookmarkSlides`,payload);
        if ( response.status === 200 ) {
         
          setIsBookmarked(false)
        } else {
          console.log( 'Error fetching like slides' );
        }
        
       
      } else {
        // Like the slide
        console.log("payload:",payload)
        const response= await axios.post(`${API_BASE_URL}/bookmarklides`, payload);
        if ( response.status === 200 ) {
     
         setIsBookmarked(true)
         
          
        } else {
          console.log( 'Error fetching Unlike slides' );
        }
        
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300 },
  };
  const checkIfLiked = useCallback(async () => {
    try {
      const slideID = slides[currentSlide]?.slideID;

      if (!slideID) return; // Ensure slideID is valid before proceeding

      // Fetch whether the slide is liked by the user
      const response = await axios.get(`${API_BASE_URL}/isLikedslides?slideID=${slideID}&userID=${userIDfromREdux}`);

      if (response.status === 200) {
        const { isLiked } = response.data;
        setIsLiked(isLiked);
      } else {
        console.log('Error checking like status');
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }, [slides, currentSlide, userIDfromREdux]);
  const checkIsBookmarked = useCallback(async (callback) => {
    try {
      const slideID = slides[currentSlide]?.slideID;

      if (!slideID) return; // Guard clause in case there's no valid slideID

      // Fetch whether the slide is bookmarked by the user
      const response = await axios.get(`${API_BASE_URL}/isbookmarked?slideID=${slideID}&userID=${userIDfromREdux}`);

      if (response.status === 200) {
        const { isBookmarked } = response.data;
        setIsBookmarked(isBookmarked);

        // Execute callback if provided
        if (callback && typeof callback === 'function') {
          callback(isBookmarked);
        }
      } else {
        console.log('Error checking bookmark status');
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  }, [slides, currentSlide, userIDfromREdux]);
  useEffect(() => {
    if (slides.length > 0) {
      checkIfLiked();
      checkIsBookmarked()
    }
  }, [currentSlide, slides,checkIfLiked,checkIsBookmarked]);
  const handleLikeToggle = async () => {
    if (!userIDfromREdux) {
      
      setIsLoginOpen(true);
      return;
    }
    try {
      const payload = {
        slideID: slides[currentSlide].slideID,
        userID: userIDfromREdux,
      };
      console.log(payload)
      if (isLiked) {
      
      
        const response= await axios.post(`${API_BASE_URL}/unlikeSlides`,payload);
        if ( response.status === 200 ) {
          setIsLiked(false);
          setLikeCount((prevCount) => prevCount - 1);
        } else {
          console.log( 'Error fetching like slides' );
        }
        
       
      } else {
        // Like the slide
        console.log("payload:",payload)
        const response= await axios.post(`${API_BASE_URL}/likeslides`, payload);
        if ( response.status === 200 ) {
          setIsLiked(true);
         
            setLikeCount((prevCount) => prevCount + 1);
          
         
          
        } else {
          console.log( 'Error fetching Unlike slides' );
        }
        
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  const closeLoginModal = () => setIsLoginOpen(false);

  if ( slides.length === 0 ) {
    <div className="loading-container">
    <div className="spinner"></div> {/* This will be your loader */}
  </div>
  }
const handleDownload = () => {
  if (slides.length > 0) {
    const currentMedia = slides[currentSlide].imageOrVideoURl;
    const fileName = `slidemedia_${currentSlide + 1}${currentMedia.endsWith('.mp4') ? '.mp4' : '.jpg'}`;

    fetch(currentMedia)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);

        
      
      })
      .catch(error => {
        console.error('Error downloading file:', error);
      });
  }
};

  if(isLoading ) return (
    <div className="loading-container">
      <div className="spinner"></div> {/* Add your spinner or loader design here */}
    </div>
  ) 

  return (
    <div className="modal-overlay">
      <ToastContainer/>
      
       
         
          <div className="modal-content1">
                 <div className="story-header">
          <div className="progress-indicator">
            {slides.map( ( _, index ) => (
              <div key={index} className="progress-bar">
                <div
                  className="fill"
                  style={{
                    width: `${ index === currentSlide ? progress : currentSlide > index ? 100 : 0 }%`
                  }}
                ></div>
              </div>
            ) )}
          </div>
          <div className="header-buttons">
            <button className="close-button" onClick={handleClose}>
              &times;
            </button>
            <button className="share-button" onClick={handleShare}><FaShare /></button>
          </div>
        </div>

        <div className="story-modal-details">
          <div className="story-slides-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideVariants}
                transition={{ duration: 0.5 }}
                className="story-slide"
              >
                {slides[currentSlide] && (
                  <>
                    {slides[currentSlide].imageOrVideoURl.endsWith( '.mp4' ) ? (
                      <video
                        src={slides[currentSlide].imageOrVideoURl}
                        autoPlay
                        muted
                        playsInline
                        style={{ width: '100%', height: '40%', objectFit: 'cover' }}
                      />
                    ) : (
                      <img
                        src={slides[currentSlide].imageOrVideoURl}
                        alt={`Slide ${ currentSlide + 1 }`}
                      />
                    )}
                    <h2>{slides[currentSlide].heading}</h2>
                    <p className='description-p'>{slides[currentSlide].description}</p>

                    {/* Action buttons */}
                    <div className="action-buttons">
                      <button
                        className="bookmark-button"
                        onClick={toggleBookmark}
                        style={{ color: isBookmarked ? 'blue' : 'black' }}
                      >
                        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                      </button>
                      <button className="download-button" onClick={handleDownload}><MdOutlineFileDownload /></button>

                      <button
                        className="like-button"
                        onClick={handleLikeToggle} 
                        style={{ color: isLiked ? 'red' : 'black' }}
                      >
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                      </button>
                      <div className="like-count">{likeCount}</div> 
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows Outside the Slide Container */}
          <div className="slide-navigation">
            <button onClick={handlePrevSlide} disabled={currentSlide === 0}>
              &lt; {/* Left arrow */}
            </button>
            <button
              onClick={handleNextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              &gt; {/* Right arrow */}
            </button>
          </div>
        </div>
        </div>
       
 
     
      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={closeLoginModal}
          toggleMenu={toggleMenu}
          
        />
      )}
    </div>
  );
};

export default StoryDetailModal;
