import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Game from './Game';

import { mount } from 'enzyme';
import { Typed } from 'typed.js';
import { loadModel } from './loader.js';

jest.mock('./loader.js');
jest.mock('./helpers');
jest.mock('typed.js');

describe('Game Component', () => {

  it('should render without crashing', () => {
    mount(<MemoryRouter><Game model={loadModel()} /></MemoryRouter>);
  })

  it('should show canvas, home link, clear canvas button and 4 typed text but not play again button', () => {
    const wrapper = mount(<MemoryRouter><Game model={loadModel()} /></MemoryRouter>);
    const canvas = wrapper.find('.canvas');
    const clearCanvas = wrapper.find('button').contains("Clear Canvas");
    const home = wrapper.find('a').contains("Home");
    const typed = wrapper.find('.typed');
    expect(canvas).toBeTruthy();
    expect(clearCanvas).toBeTruthy();
    expect(home).toBeTruthy();
    expect(typed.length).toEqual(4);

    const playAgain = wrapper.find('button').contains("Play again");
    expect(playAgain).toBeFalsy();
  })
})