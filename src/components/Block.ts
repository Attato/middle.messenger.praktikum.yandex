import { EventBus } from "./EventBus";

export abstract class Block<
	Props extends Record<string, any> = Record<string, any>,
> {
	protected props: Props;
	protected eventBus: EventBus;
	protected element: HTMLElement;

	constructor(props: Props, eventBus: EventBus) {
		this.props = props;
		this.eventBus = eventBus;
		this.element = this.createElement();

		this._addEvents();
	}

	protected createElement(): HTMLElement {
		const div = document.createElement("div");
		return div;
	}

	private _addEvents(): void {
		const { events = {} } = this.props;

		Object.keys(events).forEach((eventName) => {
			const handler = events[eventName];
			if (typeof handler === "function") {
				this.element.addEventListener(eventName, handler);
			}
		});
	}

	private _removeEvents(): void {
		const { events = {} } = this.props;

		Object.keys(events).forEach((eventName) => {
			const handler = events[eventName];
			if (typeof handler === "function") {
				this.element.removeEventListener(eventName, handler);
			}
		});
	}

	public getElement(): HTMLElement {
		return this.element;
	}

	public destroy(): void {
		this._removeEvents();
		this.element.remove();
	}
}
