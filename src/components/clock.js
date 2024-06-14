import React, { useState, useEffect } from 'react';
import LiveClock from 'react-live-clock';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <strong>
        <LiveClock date={currentTime} format="HH:mm:ss"/>
    </strong>    
  );
};

export default Clock;
