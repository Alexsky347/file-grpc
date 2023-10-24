import { render } from '@testing-library/react';

import SelectC from './select-c';

describe('SelectC', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SelectC />);
    expect(baseElement).toBeTruthy();
  });
});
