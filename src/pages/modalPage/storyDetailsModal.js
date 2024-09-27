import React, { useEffect, useState } from 'react';
import './StoryDetailModal.css';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/config';
import { FaShare, FaBookmark, FaRegBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";

const StoryDetailModal = ( props ) => {
  const [story, setStory] = useState( null );
  const [slides, setSlides] = useState( [] );
  const [currentSlide, setCurrentSlide] = useState( 0 );
  const [progress, setProgress] = useState( 0 );
  const [isBookmarked, setIsBookmarked] = useState( false ); // Bookmark state
  const [isLiked, setIsLiked] = useState( false ); // Like state
  let { storyID } = useParams(); // Capture storyID from URL
  const navigate = useNavigate();
  const location = useLocation();
  const defaultImageTime = 5000; // Time in milliseconds for images
  const defaultVideoTime = 15000; // Max time in milliseconds for videos




  if ( storyID == undefined ) {
    storyID = props?.storyID
  }



  const fetchStoryDetails = async () => {
    try {
      const response = await axios.get( `${ API_BASE_URL }/getStorybyId?storyID=${ storyID }` );
      if ( response.status === 200 ) {
        setStory( response?.data );
        setSlides( response?.data?.slides || [] );
      } else {
        console.log( 'Error fetching story details' );
      }
    } catch ( error ) {
      console.log( 'Error fetching story:', error );
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
    const slideDuration = isVideo ? Math.min( currentSlideData.videoDuration || defaultVideoTime, defaultVideoTime ) : defaultImageTime;

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
      setCurrentSlide( currentSlide + 1 );
    } else if ( currentSlide === slides.length - 1 ) {
      handleClose();
    }
  };

  const handlePrevSlide = () => {
    if ( slides.length > 0 && currentSlide > 0 ) {
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
        alert( 'Story URL copied to clipboard!' );
      } )
      .catch( err => {
        console.error( 'Could not copy URL: ', err );
      } );
  };

  const toggleBookmark = () => {
    setIsBookmarked( prev => !prev ); // Toggle bookmark state
  };

  const toggleLike = () => {
    setIsLiked( prev => !prev ); // Toggle like state
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300 },
  };

  if ( slides.length === 0 ) {
    return <div>Loading slides...</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Story Header with Progress Bar */}
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
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                      />
                    ) : (
                      <img
                        src={slides[currentSlide].imageOrVideoURl}
                        alt={`Slide ${ currentSlide + 1 }`}
                      />
                    )}
                    <h2>{slides[currentSlide].heading}</h2>
                    <p>{slides[currentSlide].description}</p>

                    {/* Action buttons */}
                    <div className="action-buttons">
                      <button
                        className="bookmark-button"
                        onClick={toggleBookmark}
                        style={{ color: isBookmarked ? 'blue' : 'black' }}
                      >
                        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                      </button>
                      <button className="download-button"><MdOutlineFileDownload /></button>

                      <button
                        className="like-button"
                        onClick={toggleLike}
                        style={{ color: isLiked ? 'red' : 'black' }}
                      >
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                      </button>
                      <div className="like-count">0</div> {/* Replace 0 with actual like count */}
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
    </div>
  );
};

export default StoryDetailModal;
