import { render } from '@testing-library/react'

import Dashboard from './dashboard.tsx'

describe('Login', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Dashboard />)
    expect(baseElement).toBeTruthy()
  })
})
