import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { AuthProvider, useAuth } from '../../hooks/auth';
import api from '../../services/api';

const mockApi = new MockAdapter(api);

describe('Auth Hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'Jhon Doe',
        email: 'jhondoe@gmail.com',
      },
      token: 'token123',
    };
    mockApi.onPost('sessions').reply(200, apiResponse);

    // Storage.prototype é onde executa o storage
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    result.current.signIn({
      email: 'jhondoe@gmail.com',
      password: '123123',
    });
    await waitForNextUpdate();

    expect(setItemSpy).toBeCalledWith('@GoBarber:token', apiResponse.token);
    expect(setItemSpy).toBeCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );

    expect(result.current.user.email).toBe('jhondoe@gmail.com');
  });

  it('should restore saved data from storage when auth intialized', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'Jhon Doe',
            email: 'jhondoe@gmail.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toBe('jhondoe@gmail.com');
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'Jhon Doe',
            email: 'jhondoe@gmail.com',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(result.current.user).toBe(undefined);
    expect(removeItemSpy).toBeCalledTimes(2);
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    const user = {
      id: 'user123',
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      avatarUrl: 'image.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    expect(result.current.user).toBe(user);
  });
});
