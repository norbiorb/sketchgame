import React from 'react';
import { render } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it ('should render a Game button', () => {
      render(<MemoryRouter><App /></MemoryRouter>);
      const links = document.querySelectorAll('a');
      expect(links.length).toBe(3);
      expect(links[2].getAttribute('href')).toBe('/game');
  });
});
