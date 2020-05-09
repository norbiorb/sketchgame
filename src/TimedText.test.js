import React from 'react';
import { mount } from 'enzyme';
import { TimedText } from './TimedText';
import { Typed } from 'typed.js';
import { PlayContext } from './Play';
jest.mock('typed.js');

const label = 'bird';
const answer = '';
const questionStart = '';
const secondsPerRound = -1;
const questionEnd = '';

const handleTimeout = jest.fn();

describe('TimedText Component', () => {

  it("renders correctly", () => {
    const tree = mount(<TimedText 
      key={label} 
      label={label} 
      strings={{answer, questionStart, secondsPerRound, questionEnd}} 
      callback={handleTimeout}
    />);
    expect(tree).toMatchSnapshot();
  });
});