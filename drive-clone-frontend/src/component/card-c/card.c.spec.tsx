import { render } from '@testing-library/react';

import File from './card.c';

describe('File', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<File />);
    expect(baseElement).toBeTruthy();
  });
});
