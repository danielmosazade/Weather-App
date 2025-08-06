import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/Rain.json' 

const AnimatedWeather = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor:'rgba(108,148,180,1)'
       
      }}
    >
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default AnimatedWeather;
