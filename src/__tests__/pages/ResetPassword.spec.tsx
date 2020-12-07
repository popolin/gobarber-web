import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ResetPassword from '../../pages/ResetPassword';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();
const mockedLocation = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush(),
    }),
    useLocation: () => mockedLocation(),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});
jest.mock('../../services/api', () => {
  return {
    post: () => jest.fn(),
  };
});

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to Reset the password', async () => {
    mockedLocation.mockImplementation(() => ({
      search: '?token=123456',
    }));
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da Senha',
    );
    const resetButton = getByText('Alterar Senha');

    fireEvent.change(passwordField, { target: { value: '123123' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123123' },
    });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not reset password without token', async () => {
    mockedLocation.mockImplementation(() => ({
      search: undefined,
    }));
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da Senha',
    );
    const resetButton = getByText('Alterar Senha');

    fireEvent.change(passwordField, { target: { value: '123123' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123123' },
    });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should not reset password with wrong confirmation', async () => {
    mockedLocation.mockImplementation(() => ({
      search: '?token=123456',
    }));
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    mockedHistoryPush.mockClear();
    const passwordField = getByPlaceholderText('Senha');

    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da Senha',
    );

    const resetButton = getByText('Alterar Senha');

    fireEvent.change(passwordField, { target: { value: '123' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: 'another' },
    });

    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });
});
