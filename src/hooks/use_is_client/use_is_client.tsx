import { useEffect, useState } from 'react';

export const useIsClient = () => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		const frameId = requestAnimationFrame(() => {
			setIsClient(true);
		});
		return () => {
			cancelAnimationFrame(frameId);
		};
	}, []);
	return isClient;
};
