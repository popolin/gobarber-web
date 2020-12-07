import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to Sign In', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const signInButton = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'jhondoe@gmail.com' } });
    fireEvent.change(passwordField, { target: { value: '12312' } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockedHistoryPush).toBeCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const signInButton = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '12312' } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const signInButton = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'jhondoe@gmail.com' } });
    fireEvent.change(passwordField, { target: { value: '12312' } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
