import React, { useEffect, useState } from 'react';
import './CursorAnimation.css';

const CursorAnimation = () => {
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);

  useEffect(() => {
    const moveHandler = (e) => {
      setCursorX(e.pageX);
      setCursorY(e.pageY);
      spawnStardust(e.pageX, e.pageY);
    };

    document.addEventListener('mousemove', moveHandler);

    return () => {
      document.removeEventListener('mousemove', moveHandler);
    };
  }, []);

  const spawnStardust = (x, y) => {
    const star = document.createElement('div');
    star.className = 'stardust';
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1000); // Remove after 1s
  };

  return (
    <>
      <div
        className="custom-cursor-dot"
        style={{ left: cursorX, top: cursorY }}
      ></div>
      <div
        className="custom-cursor-circle"
        style={{ left: cursorX, top: cursorY }}
      ></div>
    </>
  );
};

export default CursorAnimation;