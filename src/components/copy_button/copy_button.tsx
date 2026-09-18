import { useEffect, useRef, useState, type ReactNode } from 'react';

import { surfaceError } from '#lib/surface_error';

const COPIED_INDICATOR_TIMEOUT = 2_000;

export interface CopyButtonProps {
	value: string;
	children: (props: {
		copied: boolean;
		copy: () => void | Promise<void>;
	}) => ReactNode;
	onError?: (error: unknown) => void;
}

export function CopyButton({
	value,
	children,
	onError,
}: Readonly<CopyButtonProps>) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => () => clearTimeout(timeoutRef.current), []);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(
				() => setCopied(false),
				COPIED_INDICATOR_TIMEOUT
			);
		} catch (error) {
			surfaceError(error, onError);
		}
	};

	// oxlint-disable-next-line react/refs -- copy is an event handler passed to a render prop; it reads timeoutRef.current only when invoked, never during render
	return <>{children({ copied, copy })}</>;
}
