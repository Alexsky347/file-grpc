import { render } from '@testing-library/react';

import { CardC } from './card.c';
import { MyFile } from '../../model/interface/file';

describe('File', () => {
  const myFile = {} as MyFile;
  it('should render successfully', () => {
    const { baseElement } = render(
      // @ts-ignore
      <CardC metaData={myFile} reRender={0} setReRender={1} />
    );
    expect(baseElement).toBeTruthy();
  });
});
