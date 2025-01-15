export class EventBus {
	private listeners: Record<string, Function[]> = {};

	on(event: string, listener: Function): void {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(listener);
	}

	emit(event: string, ...args: any[]): void {
		if (this.listeners[event]) {
			this.listeners[event].forEach((listener) => listener(...args));
		}
	}

	off(event: string, listener: Function): void {
		if (!this.listeners[event]) return;

		this.listeners[event] = this.listeners[event].filter(
			(registeredListener) => registeredListener !== listener,
		);
	}
}
