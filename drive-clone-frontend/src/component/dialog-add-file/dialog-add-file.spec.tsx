import { render } from '@testing-library/react'

import DialogAddFile from './dialog-add-file.tsx'

describe('Header', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DialogAddFile />)
    expect(baseElement).toBeTruthy()
  })
})
