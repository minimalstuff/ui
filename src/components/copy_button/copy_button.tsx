import { useEffect, useRef, useState, type ReactNode } from 'react';

import { useLabels } from '#components/ui_provider/use_labels';
import { surfaceError } from '#lib/surface_error';

const COPIED_INDICATOR_TIMEOUT = 2_000;
const ANNOUNCEMENT_REFRESH_DELAY = 0;

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
	const labels = useLabels();
	const [copied, setCopied] = useState(false);
	const [announcement, setAnnouncement] = useState('');
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const announcementTimeoutRef =
		useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(
		() => () => {
			clearTimeout(timeoutRef.current);
			clearTimeout(announcementTimeoutRef.current);
		},
		[]
	);

	const announceCopied = () => {
		clearTimeout(announcementTimeoutRef.current);
		setAnnouncement('');
		announcementTimeoutRef.current = setTimeout(
			() => setAnnouncement(labels.copied),
			ANNOUNCEMENT_REFRESH_DELAY
		);
	};

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			announceCopied();
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				setCopied(false);
				setAnnouncement('');
			}, COPIED_INDICATOR_TIMEOUT);
		} catch (error) {
			surfaceError(error, onError);
		}
	};

	// oxlint-disable-next-line react/refs -- copy is an event handler passed to a render prop; it reads timeoutRef.current only when invoked, never during render
	const content = children({ copied, copy });

	return (
		<>
			{content}
			<span role="status" className="sr-only">
				{announcement}
			</span>
		</>
	);
}
