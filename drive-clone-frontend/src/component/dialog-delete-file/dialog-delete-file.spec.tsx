import { render } from '@testing-library/react'

import DialogDeleteFile from './dialog-delete-file.tsx'

describe('Header', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DialogDeleteFile />)
    expect(baseElement).toBeTruthy()
  })
})
