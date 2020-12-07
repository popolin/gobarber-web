import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import SignUp from '../../pages/SignUp';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();
const mockedSignUp = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
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
    post: () => mockedSignUp(),
  };
});

describe('SignUp Page', () => {
  it('should be able to Sign Up', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nomeField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('Email');
    const senhaField = getByPlaceholderText('Senha');
    const signUpButton = getByText('Cadastrar');

    fireEvent.change(nomeField, { target: { value: 'Jhon Doe' } });
    fireEvent.change(emailField, { target: { value: 'jhondoe@gmail.com' } });
    fireEvent.change(senhaField, { target: { value: '123123' } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(mockedHistoryPush).toBeCalledWith('/');
    });
  });

  it('should not sign up with invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nomeField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('Email');
    const senhaField = getByPlaceholderText('Senha');
    const signUpButton = getByText('Cadastrar');

    fireEvent.change(nomeField, { target: { value: 'Jhon Doe' } });
    fireEvent.change(emailField, { target: { value: 'invalid-email' } });
    fireEvent.change(senhaField, { target: { value: '123123' } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should not sign up with error', async () => {
    mockedSignUp.mockImplementation(() => {
      throw new Error();
    });
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nomeField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('Email');
    const senhaField = getByPlaceholderText('Senha');
    const signUpButton = getByText('Cadastrar');

    fireEvent.change(nomeField, { target: { value: 'Jhon Doe' } });
    fireEvent.change(emailField, { target: { value: 'jhon.doe@gmail.com' } });
    fireEvent.change(senhaField, { target: { value: '123123' } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
