import { createContext } from 'react';

import { type ToastApi } from '#components/toast/toast_types';

export const ToastContext = createContext<ToastApi | null>(null);
