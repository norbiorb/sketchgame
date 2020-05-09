import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import { GameContext } from './Game';
import { PlayContext } from './Play';
import { Canvas } from './Canvas';

jest.mock('./loader.js');
jest.mock('./helpers');
jest.mock('typed.js');

const ref = React.createRef();
const handlePrediction = jest.fn();
describe('Canvas Component', () => {
  it('should call handlePrediction when mouseUp event occurs in canvas', async () => {
    const wrapper = mount(<MemoryRouter>
      <GameContext.Provider value={{ ref }}>
          <PlayContext.Provider value={{ handlePrediction}} >
      <Canvas />
      </PlayContext.Provider>
      </GameContext.Provider></MemoryRouter>);
    const canvas = wrapper.find('.canvas');
    canvas.simulate("mouseUp");

    await expect(handlePrediction).toHaveBeenCalled();
  });
});