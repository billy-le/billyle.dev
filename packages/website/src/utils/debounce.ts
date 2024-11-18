export function debounce<Args extends any[], R = void>(
	func: (args: Args) => R,
	delay: number,
): [(args: Args) => Promise<R>, () => void] {
	let timer: ReturnType<typeof setTimeout> | undefined;

	const debouncedFunc = (args: Args): Promise<R> =>
		new Promise((resolve) => {
			if (timer) {
				clearTimeout(timer);
			}

			timer = setTimeout(() => {
				resolve(func(args));
			}, delay);
		});

	const teardown = () => clearTimeout(timer);

	return [debouncedFunc, teardown];
}
