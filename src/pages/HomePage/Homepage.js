
import React ,{useState,useEffect} from 'react';
import './HomePage.css';
import { useSelector, useDispatch } from 'react-redux';
import API_BASE_URL from '../../config/config';
import axios from 'axios';

const HomePage = () => {
  const [storyData,setStoryData]=useState([])
  const userIDfromREdux = useSelector((state) => state.user.userId);
  const [category,setCategory]=useState("All")
  const categoryList=['All', 'Medical', 'Fruits', 'World', 'India']

  const fetchSoryData = async () => {
    try {
       
        const response = await axios.get(`${API_BASE_URL}/getStoryByCategory?category=${category}`);
        
        if (response.status === 200) {
          setStoryData(response.data.data);
          console.log(response.data.data)
       
        } else {
            console.log('Error fetching data:', response.data.message);
        }
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
};


    
  useEffect(() => {
   
    fetchSoryData();
}, []);


  return (
    <div className="homepage">
      <div className="category-section">
        {categoryList.map((category, index) => (
          <div key={index} className="category-card">
            <div className="category-image"></div>
            <h3>{category}</h3>
          </div>
        ))}
      </div>

      <div className="top-stories">
        <h2>Top Stories About Food</h2>
        <div className="stories-grid">
          {storyData.map((story, index) => (
            <div key={index} className="story-card">
              <div className="story-image"></div>
              <h3>{story.slide[0].heading}</h3>
              <p>
              {story.slide[0].description}
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
