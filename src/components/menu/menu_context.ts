import { createContext, useContext } from 'react';

export const MenuCloseContext = createContext<(() => void) | null>(null);

/** Lets a `MenuItem` close its enclosing `Menu`/`ContextMenu` on select. */
export function useMenuClose(): (() => void) | null {
	return useContext(MenuCloseContext);
}
