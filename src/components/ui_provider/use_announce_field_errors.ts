import { createContext, useContext } from 'react';

export const AnnounceFieldErrorsContext = createContext(true);

export function useAnnounceFieldErrors(): boolean {
	return useContext(AnnounceFieldErrorsContext);
}
