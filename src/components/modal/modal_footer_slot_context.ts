import { createContext } from 'react';

/** @internal the shell's footer slot element, portaled into by `<ModalFooter>` — not part of the public API. */
export const ModalFooterSlotContext = createContext<HTMLElement | null>(null);
