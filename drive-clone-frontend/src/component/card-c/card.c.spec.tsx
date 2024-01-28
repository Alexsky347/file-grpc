import { render } from '@testing-library/react';

import { CardC } from './card.c';
import { MyFile } from '../../model/interface/file';

describe('File', () => {
  const myFile = {} as MyFile;
  it('should render successfully', () => {
    const { baseElement } = render(
      <CardC metaData={myFile} reRender={false} setReRender={setReRender} />,
    );
    expect(baseElement).toBeTruthy();
  });
});
