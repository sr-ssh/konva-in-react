import React, { useEffect } from 'react';
import './App.css';
import { addGesturedEventNode, addStoryImage, draw } from './utils/imageStory';

function App() {

  useEffect(() => {
    addStoryImage()
    addGesturedEventNode()
    addGesturedEventNode()
    draw()
  }, [])


  return (
    <div className="App">
      <div id="container"></div>
    </div>
  );
}

export default App;
