import { render } from '@testing-library/react';

import DialogDeleteFile from './dialog-action-file.tsx';

describe('Header', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DialogDeleteFile />);
    expect(baseElement).toBeTruthy();
  });
});
