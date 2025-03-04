import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MagnetApp from '../components/MagnetApp';

const Testing = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <MagnetApp />
    </DndProvider>
  );
};

export default Testing;
