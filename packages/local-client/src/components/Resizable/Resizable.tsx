import React, { useEffect, useState } from 'react';

import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './Resizable.scss';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [editorWidth, setEditorWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: any;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);
        // If width piece of state is too large and needs to shrink
        if (window.innerWidth * 0.75 < editorWidth) {
          setEditorWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };

    window.addEventListener('resize', listener);

    // Cleans up useEffect in case. Whenever a global event listener is set up inside a component,
    // especially inside a useEffect funciton, make sure to clean up after in case
    // I decide to stop showing the component. As soon as component is about to stop being displayed or is removed
    // From the screen, this function is called automatically which will do some cleanup.
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [editorWidth]);

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resizable-horizontal',
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      width: editorWidth,
      height: Infinity,
      resizeHandles: ['e'],
      onResizeStop: (event, data) => {
        setEditorWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      minConstraints: [Infinity, 35],
      maxConstraints: [Infinity, innerHeight * 0.9],
      width: Infinity,
      height: 300,
      resizeHandles: ['s'],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
