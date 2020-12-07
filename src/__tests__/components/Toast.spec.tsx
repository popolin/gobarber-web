import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { fireEvent, render, waitFor } from '@testing-library/react';
import Toast from '../../components/ToastContainer/Toast';

const mockedRemoveToast = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      removeToast: mockedRemoveToast,
    }),
  };
});

describe('Toast Component', () => {
  it('Should render a Toast', () => {
    const message = {
      id: 'od',
      title: 'title',
      description: 'description',
    };
    const style = {
      type: 'success',
      hasdescription: false,
    };
    const { getByTestId } = render(<Toast message={message} style={style} />);

    expect(getByTestId('toast-container')).toBeTruthy();
  });

  it('Should remove the Toast when clicked', async () => {
    const message = {
      id: 'od',
      title: 'title',
      description: 'description',
    };
    const style = {
      type: 'success',
      hasdescription: false,
    };
    const { getByTestId } = render(<Toast message={message} style={style} />);

    const buttonElement = getByTestId('button-toast');
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedRemoveToast).toHaveBeenCalledWith(message.id);
    });
  });

  it('Should remove the Toast when timeout', async () => {
    const message = {
      id: 'od',
      title: 'title',
      description: 'description',
    };
    const style = {
      type: 'success',
      hasdescription: false,
    };
    render(<Toast message={message} style={style} />);

    await waitFor(
      () => {
        expect(mockedRemoveToast).toHaveBeenCalledWith(message.id);
      },
      {
        timeout: 4000,
      },
    );
  });
});
