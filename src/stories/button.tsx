import './button.css';

export interface ButtonProps {
	primary?: boolean;
}

/** Primary UI component for user interaction */
export const Button = ({ primary = false, ...props }: ButtonProps) => {
	const mode = primary
		? 'storybook-button--primary'
		: 'storybook-button--secondary';
	return (
		<button
			type="button"
			className={['storybook-button', mode].join(' ')}
			{...props}
		>
			My pretty button
		</button>
	);
};
