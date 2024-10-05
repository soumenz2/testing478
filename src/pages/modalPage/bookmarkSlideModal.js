import React, { useEffect, useState, useCallback } from 'react';
import './StoryDetailModal.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/config';
import { FaShare, FaBookmark, FaRegBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";

const SlideDetailModal = (props) => {

  const [slide, setSlide] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);


  const navigate = useNavigate();
  const userIDfromRedux = useSelector((state) => state.user.userId);
  const defaultImageTime = 5000;
  const defaultVideoTime = 15000;

 const slideID=props?.slideID;
 const storyID=props?.storyID;

  const fetchSlideDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getBookmarkedSlide?slideID=${slideID}`);
      if (response.status === 200) {
        setSlide(response.data.data);
        setLikeCount(response.data?.data?.likeCount)
      } else {
        console.log('Error fetching story details');
      }
    } catch (error) {
      console.log('Error fetching story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slideID) {
        fetchSlideDetails();
    }
  }, [slideID, props]);

  useEffect(() => {
    if (!slide) return;

    // Reset progress for the slide
    setProgress(0);

    // Determine the duration for the current slide
    const isVideo = slide.imageOrVideoURl.endsWith('.mp4');
    const slideDuration = isVideo ? defaultVideoTime : defaultImageTime;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100; // Once progress reaches 100%, stop incrementing
        }
        return prev + (100 / (slideDuration / 100)); // Increment based on slide duration
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [slide]);

  const handleClose = () => {
    if (props?.storyID != null) {
      props?.onClose();
    }
    navigate('/bookmarks');
  };

  const handleShare = () => {
    const url = `${window.location.origin}/story/${storyID}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('Story URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy URL: ', err);
      });
  };

  const handleDownload = () => {
    if (slide) {
      const currentMedia = slide.imageOrVideoURl;
      const fileName = `slide_media${currentMedia.endsWith('.mp4') ? '.mp4' : '.jpg'}`;

      fetch(currentMedia)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(url);
        });
    }
  };

  const toggleBookmark = async () => {
    if (!userIDfromRedux) {
      // Handle login modal
      return;
    }
    try {
      const payload = {
        slideID: slide.slideID,
        userID: userIDfromRedux,
      };
      if (isBookmarked) {
        const response = await axios.post(`${API_BASE_URL}/undoBookmarkSlides`, payload);
        if (response.status === 200) {
          setIsBookmarked(false);
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/bookmarkSlides`, payload);
        if (response.status === 200) {
          setIsBookmarked(true);
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark status:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!userIDfromRedux) {
      // Handle login modal
      return;
    }
    try {
      const payload = {
        slideID: slide.slideID,
        userID: userIDfromRedux,
      };
      if (isLiked) {
        const response = await axios.post(`${API_BASE_URL}/unlikeSlides`, payload);
        if (response.status === 200) {
          setIsLiked(false);
          setLikeCount((prevCount) => prevCount - 1);
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/likeSlides`, payload);
        if (response.status === 200) {
          setIsLiked(true);
          setLikeCount((prevCount) => prevCount + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  };
  const checkIfLiked = useCallback(async () => {
    try {

      if (!slideID) return; // Ensure slideID is valid before proceeding

      // Fetch whether the slide is liked by the user
      const response = await axios.get(`${API_BASE_URL}/isLikedslides?slideID=${slideID}&userID=${userIDfromRedux}`);

      if (response.status === 200) {
        const { isLiked } = response.data;
        setIsLiked(isLiked);
      } else {
        console.log('Error checking like status');
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }, [ slideID,userIDfromRedux]);
  const checkIsBookmarked = useCallback(async (callback) => {
    try {
      

      if (!slideID) return; // Guard clause in case there's no valid slideID

      // Fetch whether the slide is bookmarked by the user
      const response = await axios.get(`${API_BASE_URL}/isbookmarked?slideID=${slideID}&userID=${userIDfromRedux}`);

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
  }, [slideID, userIDfromRedux]);
  useEffect(() => {
    
      checkIfLiked();
      checkIsBookmarked()
    
  }, [checkIfLiked,checkIsBookmarked]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <ToastContainer />
     
      <div className="modal-content1">
        <div className="story-header">
          <div className="progress-bar">
            <div className="fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="header-buttons">
            <button className="close-button" onClick={handleClose}>&times;</button>
            <button className="share-button" onClick={handleShare}><FaShare /></button>
          </div>
        </div>

        <div className="story-slides-container">
        <h1>{JSON.stringify(isLiked)}</h1>
          <AnimatePresence mode="wait">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="story-slide"
            >
              {slide && (
                <div className="story-slide">
                  {slide.imageOrVideoURl.endsWith('.mp4') ? (
                    <video
                      src={slide.imageOrVideoURl}
                      autoPlay
                      muted
                      playsInline
                      style={{ width: '100%', height: '40%', objectFit: 'cover' }}
                    />
                  ) : (
                    <img
                      className="story-image"
                      src={slide.imageOrVideoURl}
                      alt="Slide"
                      style={{ width: '100%', height: '40%', objectFit: 'cover' }}
                    />
                  )}
                 
                    <h2>{slide.heading}</h2>
                    <p className="description-p">{slide.description}</p>

                    {/* Action buttons */}
                    <div className="action-buttons">
                      <button
                        className="bookmark-button"
                        onClick={toggleBookmark}
                        style={{ color: isBookmarked ? 'blue' : 'aliceblue' }}
                      >
                        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                      </button>
                      <button className="download-button" onClick={handleDownload}><MdOutlineFileDownload style={{ color: "aliceblue" }} /></button>

                      <button
                        className="like-button"
                        onClick={handleLikeToggle}
                        style={{ color: isLiked ? 'red' : 'aliceblue' }}
                      >
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                      </button>
                      <div className="like-count" style={{ color: "aliceblue" }}>{likeCount}</div>
                    </div>
                  
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SlideDetailModal;
