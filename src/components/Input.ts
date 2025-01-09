import { EventBus } from "./EventBus";
import styles from "./Input.module.scss";

interface InputProps {
	label: string;
	type: string;
	name: string;
	placeholder: string;
}

export class Input {
	private props: InputProps;
	private eventBus: EventBus;
	private element: HTMLElement;

	constructor(props: InputProps, eventBus: EventBus) {
		this.props = props;
		this.eventBus = eventBus;
		this.element = this.createElement();
	}

	private createElement(): HTMLElement {
		const div = document.createElement("div");
		div.classList.add(styles.field);
		const label = document.createElement("label");
		label.classList.add(styles.label);
		const input = document.createElement("input");
		input.classList.add(styles.input);

		input.type = this.props.type;
		input.name = this.props.name;
		input.placeholder = this.props.placeholder;

		input.addEventListener("input", () => {
			this.handleInputChange(input.value);
		});

		label.textContent = this.props.label;
		label.appendChild(input);

		div.appendChild(label);

		return div;
	}

	private handleInputChange(value: string): void {
		this.eventBus.emit("inputChange", { name: this.props.name, value });
	}

	public getElement(): HTMLElement {
		return this.element;
	}
}
