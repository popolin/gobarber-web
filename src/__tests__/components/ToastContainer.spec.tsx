import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { render } from '@testing-library/react';
import ToastContainer from '../../components/ToastContainer';

describe('Toast Container Component', () => {
  it('Should render a Toast', () => {
    const message = {
      id: 'od',
      title: 'title',
      description: 'description',
    };

    const { getByTestId } = render(<ToastContainer messages={[message]} />);

    expect(getByTestId('toast-cont-container')).toBeTruthy();
  });
});
