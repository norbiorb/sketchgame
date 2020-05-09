import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Play } from './Play';

import { mount } from 'enzyme';
import { Typed } from 'typed.js';
import { loadModel } from './loader.js';
import { GameContext } from './Game';
import { getPrediction, shuffle } from './helpers';

const labelsOrig = require("./labels.json");

jest.mock('./loader.js');
jest.mock('./helpers');
jest.mock('typed.js');

const [labelsObj, indices] = shuffle(labelsOrig);
const labels = Array.from(labelsObj);
const model = loadModel();

const ref = React.createRef();
const secondsPerRound = 20;

const dispatchPoints = jest.fn();

const toggleGameEnded = false;
const STORE_RESULT = 'store result';
const CORRECT = 'correct'
const TIMEDOUT = 'timeout'
const bonustime = 5;

describe('Play Component', () => {
    it('should show play again button after having predicted correctly all rounds', async () => {

        const wrapper = mount(<MemoryRouter>
          <GameContext.Provider value={{ 
          model, 
          ref, 
          secondsPerRound, 
          dispatchPoints, 
          getPrediction, 
          toggleGameEnded,
          labels,
          indices,
          STORE_RESULT,
          CORRECT,
          TIMEDOUT,
          bonustime
        }}>
          <Play />
          </GameContext.Provider></MemoryRouter>);

        const canvas = wrapper.find('canvas');

        let arr = [...Array(labels.length + 1).keys()];
        
        for (const a of arr) {
          canvas.simulate('mouseUp');

          if (a === labels.length + 1) {
            const playAgain = wrapper.find('button').contains('Play again');
            await expect(playAgain).toBeTruthy();
          }
        }
    });
});