import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useResponsive from './use-responsive';

describe('useResponsive', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
