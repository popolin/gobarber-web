import { renderHook } from '@testing-library/react-hooks';
import { ToastProvider, useToast } from '../../hooks/toast';

describe('Toast Hook', () => {
  it('should be able add a toast', async () => {
    // Storage.prototype é onde executa o storage

    const { result, waitForNextUpdate } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    result.current.addToast({
      title: 'title',
      description: 'description',
    });
    await waitForNextUpdate();
  });
});
