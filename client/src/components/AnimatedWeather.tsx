import React from 'react';
import Lottie from 'lottie-react';
import rain from '../assets/Rain.json' 
import sun from '../assets/sun.json' 
//b18f3bcb0124b1fa25c78c721284ef02
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
        animationData={rain}
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default AnimatedWeather;
