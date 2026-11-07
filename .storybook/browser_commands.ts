declare module 'vitest/browser' {
	interface BrowserCommands {
		/** Moves the real mouse cursor to a point outside the story document. */
		movePointerOutOfStory: () => Promise<void>;
	}
}

export {};
