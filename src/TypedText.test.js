import React from 'react';
import { mount } from 'enzyme';
import { TypedText } from './TypedText';

const message = 'Message from TypedText';

describe('TypedText Component', () => {
    it("renders correctly", () => {
        const tree = mount(<TypedText strings={[message]} />);
      expect(tree).toMatchSnapshot();
    });
  });