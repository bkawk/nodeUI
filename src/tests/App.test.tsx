import { render } from '@testing-library/react';
import React from 'react';
import { Home } from '../routes/home';

test('renders learn react link', () => {
  const { getByText } = render(<Home />);
  const linkElement = getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
