import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { fireEvent, render, waitFor } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input Component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="Email" />,
    );

    expect(getByPlaceholderText('Email')).toBeTruthy();
  });

  it('it should render highlights when input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="Email" />,
    );

    const inputElement = getByPlaceholderText('Email');
    const containerElement = getByTestId('input-container');
    fireEvent.focus(inputElement);

    await waitFor(() => {
      expect(containerElement).toHaveStyle('border-color: #ff9000;');
      expect(containerElement).toHaveStyle('color: #ff9000;');
    });
  });

  it('it should render highlights when input blur', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="Email" />,
    );

    const inputElement = getByPlaceholderText('Email');
    const containerElement = getByTestId('input-container');
    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(containerElement).not.toHaveStyle('border-color: #ff9000;');
      expect(containerElement).not.toHaveStyle('color: #ff9000;');
    });
  });

  it('it should keep highlights when input filled blur', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="Email" />,
    );

    const inputElement = getByPlaceholderText('Email');
    const containerElement = getByTestId('input-container');

    fireEvent.change(inputElement, { target: { value: 'jhondoe@gmail.com' } });
    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(containerElement).toHaveStyle('color: #ff9000;');
    });
  });
});
