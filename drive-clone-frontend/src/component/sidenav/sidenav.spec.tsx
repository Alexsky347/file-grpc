import { render } from '@testing-library/react';

import Sidenav from './sidenav';

describe('Sidenav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Sidenav />);
    expect(baseElement).toBeTruthy();
  });
});
