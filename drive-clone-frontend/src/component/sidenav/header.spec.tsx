import { render } from '@testing-library/react'

import Sidenav from './sidenav.tsx'

describe('Header', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Sidenav />)
    expect(baseElement).toBeTruthy()
  })
})
