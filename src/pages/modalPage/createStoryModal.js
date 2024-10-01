import React, { useState, useCallback, useMemo,useEffect  } from 'react';
import './CreateStoryModal.css';
import { useSelector, useDispatch } from 'react-redux';
import API_BASE_URL from '../../config/config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CreateStoryModal = ( { isOpen, onClose } ) => {
  const userIDfromREdux = useSelector( ( state ) => state.user.userId );
  const [selectedCategory,setSelectedcategory]=useState('')
  const [slides, setSlides] = useState( [
    { heading: '', description: '', image: '', category: '' ,videoDurationError: null },
    { heading: '', description: '', image: '', category: '',videoDurationError: null  },
    { heading: '', description: '', image: '', category: '',videoDurationError: null  },
  ] );
  const [currentSlide, setCurrentSlide] = useState( 0 );
  const [videoDurationError, setVideoDurationError] = useState( null );
  const maxSlides = 6;
  const navigate=useNavigate();

  const handleInputChange = useCallback((e, index, field) => {
    const updatedSlides = [...slides];
    updatedSlides[index][field] = e.target.value;
  
    if (field === 'image' && isVideoURL(e.target.value)) {
      validateVideoDuration(e.target.value, index); // Pass the index to validateVideoDuration
    } else {
      updatedSlides[index].videoDurationError = null; // Clear any previous video duration error
    }
  
    setSlides(updatedSlides);
  }, [slides]);

  const isVideoURL = ( url ) => {
    // Simple check based on file extensions (you can refine this if needed)
    return /\.(mp4|webm|ogg)$/i.test( url );
  };

  const validateVideoDuration = (videoURL, index) => {
    const video = document.createElement('video');
    video.src = videoURL;
  
    video.onloadedmetadata = () => {
      if (video.duration > 15) {
        setSlides((prevSlides) => {
          prevSlides[index].videoDurationError = 'Video duration exceeds 15 seconds.';
          return [...prevSlides];
        });
      } else {
        setSlides((prevSlides) => {
          prevSlides[index].videoDurationError = null;
          return [...prevSlides];
        });
      }
    };
  
    video.onerror = () => {
      setSlides((prevSlides) => {
        prevSlides[index].videoDurationError = 'Invalid video URL or unable to load video.';
        return [...prevSlides];
      });
    };
  };

  const handleAddSlide = useCallback( () => {
    if ( slides.length < maxSlides ) {
      let slideLength = slides?.length
      setSlides( [...slides, { heading: '', description: '', image: '', category: '',videoDurationError: null }] );
      setCurrentSlide( slideLength )
    }
  }, [slides] );

  // const handleRemoveSlide = useCallback( ( index ) => {

  //   setCurrentSlide( 0 )
  //   const updatedSlides = slides.filter( ( _, idx ) => idx !== index );
  //   setSlides( updatedSlides );
  //   console.log( updatedSlides?.length - 1 )

  // }, [slides] );
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
  //   const updatedSlides = slides.filter((_, idx) => idx !== index);
  
  //   setSlides(updatedSlides);
  
  //   setCurrentSlide((prevSlide) => {
  //     // If the current slide is out of bounds after removal, adjust it
  //     if (prevSlide >= updatedSlides.length) {
  //       return updatedSlides.length - 1; // Set to the last valid slide
  //     }
  //     else if (prevSlide > index) {
  //       // If the current slide was after the removed slide, decrement the index
  //       return prevSlide - 1;
  //     }
  //     console.log(prevSlide)
  //     return prevSlide; // Keep the current slide index if it's valid
  //   });
  // }, [slides]);

  const handlePrevious = useCallback( () => {
    if ( currentSlide > 0 ) {
      setCurrentSlide( currentSlide - 1 );
    }
  }, [currentSlide] );

  const handleNext = useCallback( () => {
    if ( currentSlide < slides.length - 1 ) {
      setCurrentSlide( currentSlide + 1 );
    }
  }, [currentSlide, slides.length] );

  const allFieldsFilled = useMemo( () => {
    return slides.every( slide => slide.heading && slide.description && slide.image && slide.category );
  }, [slides] );


  const handleSubmit = useCallback( async () => {
    if (slides.some(slide => slide.videoDurationError !== null)) {
      alert('Please correct the video duration for all slides before submitting.');
      return; // Prevent submission if any slide has a video duration error
    }
    if ( allFieldsFilled ) {
      try {
        console.log( 'Story Submitted:', slides );
        const storyData = {
          userID: userIDfromREdux,
          slides: slides.map( slide => ( {
            heading: slide.heading,
            description: slide.description,
            imageOrVideoURl: slide.image, // Adjusting property name to match the API requirement
            category: slide.category,
          } ) ),
        };
        const response = await axios.post( `${ API_BASE_URL }/createStoryWithSlide`, storyData );
        console.log( 'Story created successfully:', response.data.data );
       
        onClose();
        navigate( '/' );
      } catch ( error ) {
        console.error( 'Error creating story:', error );
        alert( 'An error occurred while creating the story. Please try again.' );
      }
    } else {
      alert( 'Please fill all fields before submitting.' );
    }
  }, [allFieldsFilled, slides, onClose, userIDfromREdux,videoDurationError] );


  if ( !isOpen ) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="slide-navigation1">
          {slides.map( ( _, idx ) => (
            <button
              key={idx}
              className={`slide-tab ${ currentSlide === idx ? 'active' : '' }`}
              onClick={() => setCurrentSlide( idx )}
            >
              Slide {idx + 1}
              {slides.length > 3 && idx === slides.length - 1 && (
                <span className="remove-slide" onClick={() => handleRemoveSlide( idx )}>✖</span>
              )}
            </button>
          ) )}
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
                  onChange={( e ) => handleInputChange( e, currentSlide, 'heading' )}
                  placeholder="Your heading"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={slides[currentSlide]?.description || ''}
                  onChange={( e ) => handleInputChange( e, currentSlide, 'description' )}
                  placeholder="Story description"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image/Video URL:</label>
                <input
                  type="text"
                  value={slides[currentSlide]?.image || ''}
                  onChange={( e ) => handleInputChange( e, currentSlide, 'image' )}
                  placeholder="Add image/Video URL"
                  required
                />
                {slides[currentSlide]?.videoDurationError!==null && <div className="error">{slides[currentSlide]?.videoDurationError}</div>} {/* Displaying error */}
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  value={slides[currentSlide]?.category || ''}
                  onChange={( e ) => handleInputChange( e, currentSlide, 'category' )}
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

        {/* <div className="navigation-buttons">
          <button className="prev-btn" onClick={handlePrevious} disabled={currentSlide === 0}>Previous</button>
          <button className="next-btn" onClick={handleNext} disabled={currentSlide === slides.length - 1}>Next</button>
        </div> */}

        <div className="post-section">
          <button className="post-btn" onClick={handleSubmit}>Post</button>
        </div>

        </div>
       
        <span className="close-modal" onClick={onClose}>✖</span>
      </div>
    </div>
  );
};

export default CreateStoryModal;
