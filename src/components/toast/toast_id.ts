let toastCounter = 0;

export function generateToastId(): string {
	toastCounter += 1;
	return `ms-toast-${toastCounter}`;
}
