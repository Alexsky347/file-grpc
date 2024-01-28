import { act, renderHook } from '@testing-library/react'
import * as React from 'react'

import useViewPort from './use-view-port'

describe('useViewPort', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useViewPort())

    expect(result.current.count).toBe(0)

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })
})
