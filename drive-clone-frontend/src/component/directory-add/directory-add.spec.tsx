import { render } from '@testing-library/react';

import DialogAddFile from './directory-add.tsx';

describe('Header', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DialogAddFile />);
    expect(baseElement).toBeTruthy();
  });
});
