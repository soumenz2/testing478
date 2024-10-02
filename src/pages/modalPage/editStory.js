import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './CreateStoryModal.css';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../../config/config';
import axios from 'axios';


const EditStoryModal = ({ storyID,onClose,onStoryEdited }) => {
  const userIDfromREdux = useSelector((state) => state.user.userId);
  
  const [slides, setSlides] = useState([
    { heading: '', description: '', imageOrVideoURl: '', category: '' },
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoDurationError, setVideoDurationError] = useState(null);
  const maxSlides = 6;

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getStorybyId?storyID=${storyID}`);
        const storyData = response.data;

        // Assuming storyData has slides
        setSlides(storyData.slides);
      } catch (error) {
        console.error('Error fetching story:', error);
      }
    };

    if (storyID) {
      fetchStory();
    }
  }, [storyID]);

  const handleInputChange = useCallback((e, index, field) => {
    const updatedSlides = [...slides];
    updatedSlides[index][field] = e.target.value;
    setSlides(updatedSlides);

    if (field === 'image' && isVideoURL(e.target.value)) {
      validateVideoDuration(e.target.value);
    } else {
      setVideoDurationError(null);
    }
  }, [slides]);

  const isVideoURL = (url) => /\.(mp4|webm|ogg)$/i.test(url);

  const validateVideoDuration = (videoURL) => {
    const video = document.createElement('video');
    video.src = videoURL;

    video.onloadedmetadata = () => {
      if (video.duration > 15) {
        setVideoDurationError('Video duration exceeds 15 seconds.');
      } else {
        setVideoDurationError(null);
      }
    };

    video.onerror = () => {
      setVideoDurationError('Invalid video URL or unable to load video.');
    };
  };

  const handleAddSlide = useCallback(() => {
    if (slides.length < maxSlides) {
      setSlides([...slides, { heading: '', description: '', imageOrVideoURl: '', category: '' }]);
      setCurrentSlide(slides.length);
    }
  }, [slides]);

  useEffect(() => {
    if (slides.length === 0) {
      setCurrentSlide(0);
    } else if (currentSlide >= slides.length) {
      setCurrentSlide(slides.length - 1);
    }
  }, [slides, currentSlide]);
  
  const handleRemoveSlide = (index) => {
    const updatedSlides = slides.filter((_, idx) => idx !== index);
    setSlides(updatedSlides);
  };
  

  // const handleRemoveSlide = useCallback((index) => {
  //   setSlides((prevSlides) => {
  //     const updatedSlides = prevSlides.filter((_, idx) => idx !== index);
  //     setCurrentSlide((prevSlide) => {
  //       if (prevSlide >= updatedSlides.length) {
  //         return updatedSlides.length - 1; // Set to last valid slide
  //       }
  //       return prevSlide > index ? prevSlide - 1 : prevSlide; // Keep valid index
  //     });
  //     return updatedSlides;
  //   });
  // }, []);

  const handlePrevious = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, slides.length]);

  const handleSubmit = async () => {
 
      try {
    
        console.log(slides)
        const response = await axios.post(`${API_BASE_URL}/updateStory`, {slides});
        console.log("enter here ")
          console.log('Story updated successfully:', response.data.data);
          onStoryEdited()
          onClose();
      
        
       
      } catch (error) {
        console.error('Error updating story:', error);
        alert('An error occurred while updating the story. Please try again.');
      }
    }
     


  if (!storyID) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="slide-navigation1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`slide-tab ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            >
              Slide {idx + 1}
              {slides.length > 3 && idx === slides.length - 1 && (
                <span className="remove-slide" onClick={() => handleRemoveSlide(idx)}>✖</span>
              )}
            </button>
          ))}
          {slides.length < maxSlides && (
            <button className="add-slide-btn" onClick={handleAddSlide}>{'Add + '}</button>
          )}
        </div>
        <div>
        <div className="slide-form">
          {currentSlide < slides.length && (
            <>
              <div className="form-group">
                <label>Heading:</label>
                <input
                  type="text"
                  value={slides[currentSlide]?.heading || ''}
                  onChange={(e) => handleInputChange(e, currentSlide, 'heading')}
                  placeholder="Your heading"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={slides[currentSlide]?.description || ''}
                  onChange={(e) => handleInputChange(e, currentSlide, 'description')}
                  placeholder="Story description"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image/Video URL:</label>
                <input
                  type="text"
                  value={slides[currentSlide]?.imageOrVideoURl || ''}
                  onChange={(e) => handleInputChange(e, currentSlide, 'imageOrVideoURl')}
                  placeholder="Add image/Video URL"
                  required
                />
                {videoDurationError && <div className="error">{videoDurationError}</div>}
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  value={slides[currentSlide]?.category || ''}
                  onChange={(e) => handleInputChange(e, currentSlide, 'category')}
                  required
                >
                  <option value="" disabled>Select category</option>
                  <option value="Music">Music</option>
                  <option value="Movies">Movies</option>
                  <option value="World">World</option>
                  <option value="India">India</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="navigation-buttons">
          <button className="prev-btn" onClick={handlePrevious} disabled={currentSlide === 0}>Previous</button>
          <button className="next-btn" onClick={handleNext} disabled={currentSlide === slides.length - 1}>Next</button>
        </div>

        <div className="post-section">
          <button className="post-btn" onClick={handleSubmit}>Update</button>
        </div>
          
        </div>
       

        <span className="close-modal" onClick={onClose}>✖</span>
      </div>
    </div>
  );
};

export default EditStoryModal;
