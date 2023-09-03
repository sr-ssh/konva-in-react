import React, { useEffect } from 'react';
import './App.css';
import { addStoryImage } from './utils/imageStory';
import Konva from 'konva';
import Hammer from 'hammerjs';

function App() {

  useEffect(() => {
    addStoryImage()
    // TouchEmulator();

  }, [])


  return (
    <div className="App">
      <div id="container"></div>
    </div>
  );
}

export default App;
