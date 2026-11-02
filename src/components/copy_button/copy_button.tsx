import { useEffect, useRef, useState, type ReactNode } from 'react';

import { IconButton } from '#components/icon_button/icon_button';
import { DEFAULT_COPY_LABEL } from '#components/ui_provider/ui_labels';
import { useLabels } from '#components/ui_provider/use_labels';
import { surfaceError } from '#lib/surface_error';

const COPIED_INDICATOR_TIMEOUT = 2_000;
const ANNOUNCEMENT_REFRESH_DELAY = 0;

export interface CopyButtonProps {
	value: string;
	/**
	 * Render prop for a custom control. Omit it to get the default icon button,
	 * which swaps its copy icon for a check while `copied`.
	 */
	children?: (props: {
		copied: boolean;
		copy: () => void | Promise<void>;
	}) => ReactNode;
	/** Accessible name of the default icon button. Defaults to `labels.copy`. */
	label?: string;
	onError?: (error: unknown) => void;
}

export function CopyButton({
	value,
	children,
	label,
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
	const customContent = children?.({ copied, copy });
	const content =
		customContent ??
		(children ? null : (
			<IconButton
				icon={copied ? 'i-mdi-check' : 'i-mdi-content-copy'}
				aria-label={label ?? labels.copy ?? DEFAULT_COPY_LABEL}
				onClick={() => void copy()}
			/>
		));

	return (
		<>
			{content}
			<span role="status" className="sr-only">
				{announcement}
			</span>
		</>
	);
}
